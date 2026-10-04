/**
 * Live weather for a destination.
 *
 * The catalogue says which months suit a place. It cannot say whether it is
 * raining there this afternoon — and that is the question a traveller opens a
 * second app to answer. Open-Meteo gives a forecast for any coordinate with
 * no key and no account, so the page can carry it directly.
 *
 * The rules this follows:
 * - It is never required. No coordinate, no network, a slow answer: the page
 *   is complete without it and nothing waits on it.
 * - It is never stale-and-pretending. A cached forecast carries its fetch
 *   time and is shown as "as of", and anything over the TTL is refetched.
 * - It is never ours to make up. Nothing here is filled in from a guess.
 */

export interface DayForecast {
  /** ISO date, local to the place. */
  date: string;
  maxC: number;
  minC: number;
  /** 0–100, highest hourly value for the day. */
  rainChance: number;
  code: number;
}

export interface Forecast {
  nowC: number;
  nowCode: number;
  days: DayForecast[];
  /** When this was fetched, ms since epoch. */
  fetchedAt: number;
}

export const WEATHER_TTL_MS = 60 * 60 * 1000;
export const WEATHER_CACHE_KEY = "onlytravelers.weather.v1";

/** What Open-Meteo is asked for. Exposed so tests and the demo build the same URL. */
export function forecastUrl(lat: number, lng: number, days = 5): string {
  const p = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: "temperature_2m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
    timezone: "Asia/Kolkata",
    forecast_days: String(days),
  });
  return `https://api.open-meteo.com/v1/forecast?${p.toString()}`;
}

/**
 * Turns the API's column-oriented JSON into rows. Defensive on purpose: a
 * field missing or the wrong length returns null rather than a half-forecast.
 */
export function parseForecast(raw: unknown, now = Date.now()): Forecast | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as {
    current?: { temperature_2m?: unknown; weather_code?: unknown };
    daily?: {
      time?: unknown;
      temperature_2m_max?: unknown;
      temperature_2m_min?: unknown;
      precipitation_probability_max?: unknown;
      weather_code?: unknown;
    };
  };
  const cur = r.current;
  const d = r.daily;
  if (!cur || !d) return null;
  if (typeof cur.temperature_2m !== "number" || typeof cur.weather_code !== "number") return null;

  const cols = [d.time, d.temperature_2m_max, d.temperature_2m_min, d.precipitation_probability_max, d.weather_code];
  if (!cols.every((c) => Array.isArray(c))) return null;
  const [time, max, min, rain, code] = cols as unknown[][];
  const n = time.length;
  if (!n || [max, min, rain, code].some((c) => c.length !== n)) return null;

  const days: DayForecast[] = [];
  for (let i = 0; i < n; i++) {
    const date = time[i];
    const maxC = max[i];
    const minC = min[i];
    const rc = rain[i];
    const wc = code[i];
    if (typeof date !== "string" || typeof maxC !== "number" || typeof minC !== "number" || typeof wc !== "number") {
      return null;
    }
    days.push({
      date,
      maxC: Math.round(maxC),
      minC: Math.round(minC),
      // Precipitation probability is null where the model has none.
      rainChance: typeof rc === "number" ? Math.round(rc) : 0,
      code: wc,
    });
  }

  return {
    nowC: Math.round(cur.temperature_2m),
    nowCode: cur.weather_code,
    days,
    fetchedAt: now,
  };
}

/** WMO weather interpretation codes, as Open-Meteo returns them. */
export function describeCode(code: number): { label: string; icon: string } {
  if (code === 0) return { label: "Clear", icon: "☀️" };
  if (code === 1) return { label: "Mostly clear", icon: "🌤️" };
  if (code === 2) return { label: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { label: "Overcast", icon: "☁️" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "🌫️" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "🌦️" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "🌨️" };
  if (code >= 80 && code <= 82) return { label: "Showers", icon: "🌧️" };
  if (code === 85 || code === 86) return { label: "Snow showers", icon: "🌨️" };
  if (code >= 95 && code <= 99) return { label: "Thunderstorm", icon: "⛈️" };
  return { label: "—", icon: "🌡️" };
}

/** "Tue" for a forecast row, in the place's own calendar. */
export function dayLabel(iso: string, today = new Date()): string {
  const d = new Date(iso + "T00:00:00");
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - t.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

export function isFresh(f: Forecast | null | undefined, now = Date.now()): f is Forecast {
  return Boolean(f && now - f.fetchedAt < WEATHER_TTL_MS);
}

/**
 * One line a traveller can act on, derived from the forecast rather than
 * copied from it: the thing the numbers mean for the day.
 */
export function forecastAdvice(f: Forecast): string | undefined {
  const today = f.days[0];
  if (!today) return undefined;
  const wet = f.days.slice(0, 3).filter((d) => d.rainChance >= 60).length;
  if (wet >= 2) return "Rain is likely most of the next few days — plan the indoor half of each day first.";
  if (today.rainChance >= 60) return "Good chance of rain today. Do the outdoor part early and keep a dry bag for the phone.";
  if (today.maxC >= 40) return "Over 40°C today. The midday break is compulsory, not optional — be out by nine, back by eleven.";
  if (today.maxC >= 35) return "Hot today. Early start, long lunch, back out after four.";
  if (today.minC <= 5) return "Near freezing overnight. Most budget rooms are unheated — ask about blankets, not heaters.";
  if (today.maxC - today.minC >= 18) return "A big swing between day and night. Layers, not one warm coat.";
  return undefined;
}
