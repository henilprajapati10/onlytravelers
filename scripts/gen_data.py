"""Turn the parsed PDF directory into the app's TypeScript data files."""
import json, re, unicodedata

DIR = json.load(open('/tmp/claude-0/-home-user-onlytravelers/bfb6b553-b701-5570-971f-67e2685b30f4/scratchpad/directory.json'))
OUT = '/home/user/onlytravelers/src/data'

# ---- state-level facts not in the PDF: hub coordinates + railheads ----
# lat/lng of the state's main travel hub; used for travel-leg estimates and map pins.
STATE_EXTRA = {
    'Delhi':                     dict(lat=28.61, lng=77.21, railhead='New Delhi (NDLS)'),
    'Uttar Pradesh':             dict(lat=26.85, lng=80.95, railhead='Lucknow (LJN), Agra Cantt (AGC), Varanasi (BSB)'),
    'Uttarakhand':               dict(lat=30.32, lng=78.03, railhead='Haridwar (HW), Dehradun (DDN), Kathgodam (KGM)'),
    'Himachal Pradesh':          dict(lat=31.10, lng=77.17, railhead='Kalka (KLK), Chandigarh (CDG), Pathankot (PTK)'),
    'Punjab':                    dict(lat=30.73, lng=76.78, railhead='Amritsar (ASR), Ludhiana (LDH)'),
    'Haryana':                   dict(lat=30.73, lng=76.78, railhead='Kurukshetra (KKDE), Chandigarh (CDG)'),
    'Rajasthan':                 dict(lat=26.91, lng=75.79, railhead='Jaipur (JP), Jodhpur (JU), Udaipur City (UDZ)'),
    'Chandigarh':                dict(lat=30.73, lng=76.78, railhead='Chandigarh (CDG)'),
    'Jammu & Kashmir':           dict(lat=34.08, lng=74.80, railhead='Jammu Tawi (JAT), Banihal (BAHL)'),
    'Ladakh':                    dict(lat=34.16, lng=77.58, railhead='No railway — nearest is Jammu Tawi (JAT)'),
    'Maharashtra':               dict(lat=19.08, lng=72.88, railhead='Mumbai CSMT, Pune (PUNE), Nagpur (NGP)'),
    'Gujarat':                   dict(lat=23.22, lng=72.68, railhead='Ahmedabad (ADI), Vadodara (BRC), Bhuj (BHUJ)'),
    'Goa':                       dict(lat=15.49, lng=73.83, railhead='Madgaon (MAO), Thivim (THVM)'),
    'Dadra & Nagar Haveli and Daman & Diu': dict(lat=20.40, lng=72.83, railhead='Vapi (VAPI) for Daman, Veraval (VRL) for Diu'),
    'Karnataka':                 dict(lat=12.97, lng=77.59, railhead='Bengaluru (SBC), Hubballi (UBL), Mysuru (MYS)'),
    'Kerala':                    dict(lat=8.52,  lng=76.94, railhead='Ernakulam (ERS), Thiruvananthapuram (TVC), Kozhikode (CLT)'),
    'Tamil Nadu':                dict(lat=13.08, lng=80.27, railhead='Chennai Central (MAS), Madurai (MDU), Coimbatore (CBE)'),
    'Andhra Pradesh':            dict(lat=16.51, lng=80.65, railhead='Vijayawada (BZA), Visakhapatnam (VSKP), Tirupati (TPTY)'),
    'Telangana':                 dict(lat=17.39, lng=78.49, railhead='Secunderabad (SC), Warangal (WL)'),
    'Puducherry':                dict(lat=11.94, lng=79.83, railhead='Puducherry (PDY), Villupuram (VM)'),
    'Lakshadweep':               dict(lat=10.57, lng=72.64, railhead='No railway — reach by flight or ship from Kochi'),
    'Andaman & Nicobar Islands': dict(lat=11.62, lng=92.73, railhead='No railway — reach by flight or ship from Chennai/Kolkata'),
    'West Bengal':               dict(lat=22.57, lng=88.36, railhead='Howrah (HWH), Sealdah (SDAH), New Jalpaiguri (NJP)'),
    'Bihar':                     dict(lat=25.59, lng=85.14, railhead='Patna (PNBE), Gaya (GAYA)'),
    'Jharkhand':                 dict(lat=23.34, lng=85.31, railhead='Ranchi (RNC), Tatanagar (TATA)'),
    'Odisha':                    dict(lat=20.30, lng=85.82, railhead='Bhubaneswar (BBS), Puri (PURI)'),
    'Madhya Pradesh':            dict(lat=23.26, lng=77.41, railhead='Bhopal (BPL), Jabalpur (JBP), Khajuraho (KURJ)'),
    'Chhattisgarh':              dict(lat=21.25, lng=81.63, railhead='Raipur (R), Bilaspur (BSP)'),
    'Assam':                     dict(lat=26.14, lng=91.74, railhead='Guwahati (GHY), Dibrugarh (DBRG)'),
    'Arunachal Pradesh':         dict(lat=27.08, lng=93.61, railhead='Naharlagun (NHLN), Tinsukia (NTSK)'),
    'Meghalaya':                 dict(lat=25.58, lng=91.89, railhead='No railway — Guwahati (GHY), then 3 hrs by road'),
    'Manipur':                   dict(lat=24.82, lng=93.94, railhead='Dimapur (DMV), then 5 hrs by road'),
    'Mizoram':                   dict(lat=23.73, lng=92.72, railhead='Silchar (SCL), then 6 hrs by road'),
    'Nagaland':                  dict(lat=25.67, lng=94.11, railhead='Dimapur (DMV)'),
    'Tripura':                   dict(lat=23.83, lng=91.28, railhead='Agartala (AGTL)'),
    'Sikkim':                    dict(lat=27.33, lng=88.61, railhead='No railway — New Jalpaiguri (NJP), then 4 hrs by road'),
}

# Units small enough that moving between two of their destinations is local
# transport, already absorbed into the catalogue's time-at-destination.
COMPACT_UNITS = {'Delhi', 'Chandigarh', 'Goa'}

# Units whose districts are not contiguous — the PDF flags both of these.
# Crossing between their pockets is a real journey, not an intra-state hop.
NON_CONTIGUOUS_UNITS = {'Puducherry', 'Dadra & Nagar Haveli and Daman & Diu'}

# ---- rules stated in the PDF appendix ----
PERMIT_STATES = {'Arunachal Pradesh', 'Mizoram', 'Nagaland', 'Lakshadweep'}
PERMIT_DISTRICTS = {('Sikkim', 'Mangan')}  # North Sikkim
ISLAND_TRANSPORT_STATES = {'Andaman & Nicobar Islands', 'Lakshadweep'}
MONSOON_PRODUCTS = {'Saputara', 'Athirappilly', 'Chitrakote', 'Jog Falls', 'Kaas Plateau'}

# Diu routes with Gujarat even though it is administratively a UT (PDF appendix).
ROUTING_OVERRIDES = {'Dadra & Nagar Haveli and Daman & Diu': 'Saurashtra & South Gujarat coast'}

MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
MONTH_IDX = {m: i + 1 for i, m in enumerate(MONTHS)}

# 48 raw theme tokens -> 13 canonical themes used for filtering and artwork
THEME_MAP = {
    'Heritage':'Heritage','Architecture':'Heritage','Museum':'Heritage','Art':'Heritage',
    'Spiritual':'Spiritual',
    'Hills':'Hills','Snow':'Hills','High Altitude':'Hills','Scenic':'Hills','Scenic Pass':'Hills','Valley':'Hills',
    'Nature':'Nature','Waterfalls':'Nature','River':'Nature','Flowers':'Nature',
    'Lake':'Lakes','High Lake':'Lakes',
    'Wildlife':'Wildlife','Birding':'Wildlife',
    'Beach':'Beach','Coastal':'Beach',
    'Island':'Islands','Diving':'Islands','Scuba':'Islands','Snorkelling':'Islands','Watersports':'Islands',
    'Urban':'Cities','Modern':'Cities','Entertainment':'Cities','Luxury':'Cities',
    'Trek':'Trekking','Trek Base':'Trekking','Adventure':'Trekking','Paragliding':'Trekking',
    'Culture':'Culture','Tribal':'Culture','Tribal Culture':'Culture','Village':'Culture','Villages':'Culture',
    'Community':'Culture','Experience':'Culture',
    'Food':'Food & Drink','Tea':'Food & Drink','Coffee':'Food & Drink','Wine':'Food & Drink',
    'Desert':'Desert',
    'Backwater':'Backwaters','Houseboat':'Backwaters',
}
CANON_ORDER = ['Heritage','Spiritual','Hills','Nature','Wildlife','Beach','Islands','Lakes',
               'Cities','Trekking','Culture','Food & Drink','Desert','Backwaters']


def slugify(text):
    t = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode()
    t = re.sub(r"[''`]", '', t)
    t = re.sub(r'[^a-zA-Z0-9]+', '-', t).strip('-').lower()
    return re.sub(r'-{2,}', '-', t)


def parse_months(raw):
    """'Mar - May, Oct - Dec' -> [3,4,5,10,11,12]; 'Year round' -> all."""
    raw = (raw or '').strip()
    if not raw:
        return []
    if raw.lower().startswith('year'):
        return list(range(1, 13))
    out = []
    for part in raw.split(','):
        part = part.strip()
        m = re.match(r'^([A-Za-z]{3})\s*-\s*([A-Za-z]{3})$', part)
        if m:
            a, b = MONTH_IDX.get(m.group(1)), MONTH_IDX.get(m.group(2))
            if a and b:
                cur = a
                while True:
                    out.append(cur)
                    if cur == b:
                        break
                    cur = cur % 12 + 1
            continue
        single = MONTH_IDX.get(part[:3])
        if single:
            out.append(single)
    return sorted(set(out))


def canon_themes(raw):
    parts = [p.strip() for p in raw.split('/') if p.strip()]
    out = []
    for p in parts:
        c = THEME_MAP.get(p)
        if c and c not in out:
            out.append(c)
    if not out:
        out = ['Heritage']
    return out


def ts(value, indent=0):
    """Serialise a python value as TypeScript literal."""
    pad = '  ' * indent
    if isinstance(value, str):
        return '"' + value.replace('\\', '\\\\').replace('"', '\\"') + '"'
    if isinstance(value, bool):
        return 'true' if value else 'false'
    if isinstance(value, (int, float)):
        return repr(value)
    if value is None:
        return 'undefined'
    if isinstance(value, list):
        if not value:
            return '[]'
        if all(isinstance(v, (str, int, float)) for v in value):
            return '[' + ', '.join(ts(v) for v in value) + ']'
        inner = ',\n'.join(pad + '  ' + ts(v, indent + 1) for v in value)
        return '[\n' + inner + '\n' + pad + ']'
    if isinstance(value, dict):
        def key(k):
            return k if re.match(r'^[A-Za-z_$][A-Za-z0-9_$]*$', k) else '"' + k + '"'
        inner = ',\n'.join(
            pad + '  ' + key(k) + ': ' + ts(v, indent + 1)
            for k, v in value.items() if v is not None
        )
        return '{\n' + inner + '\n' + pad + '}'
    raise TypeError(type(value))


# ---------- build states ----------
states_out = []
for s in DIR['states']:
    name = s['name']
    if name.startswith('Dadra & Nagar Haveli'):
        name = 'Dadra & Nagar Haveli and Daman & Diu'
    extra = STATE_EXTRA.get(name)
    if not extra:
        raise SystemExit('missing STATE_EXTRA for ' + name)
    states_out.append({
        'id': slugify(name),
        'name': name,
        'kind': s['kind'],
        'zone': s['zone'],
        'capital': s['capital'],
        'airports': [a.strip() for a in (s['airports'] or '').split(',') if a.strip()],
        'railhead': extra['railhead'],
        'peakSeason': s['peak'],
        'peakMonths': parse_months(s['peak']),
        'positioning': s['note'],
        'lat': extra['lat'],
        'lng': extra['lng'],
        'permitRequired': name in PERMIT_STATES,
        'ferryOrFlightOnly': name in ISLAND_TRANSPORT_STATES,
        'compactUnit': name in COMPACT_UNITS,
        'nonContiguous': name in NON_CONTIGUOUS_UNITS,
        'routingNote': ROUTING_OVERRIDES.get(name),
    })

# ---------- build destinations ----------
slug_counts = {}
dests_out = []
for s, st in zip(DIR['states'], states_out):
    for d in s['destinations']:
        base = slugify(d['name'])
        if base in slug_counts:
            slug_counts[base] += 1
            slug = base + '-' + st['id']
        else:
            slug_counts[base] = 1
            slug = base
        permit = st['permitRequired'] or (st['name'], d['district']) in PERMIT_DISTRICTS
        months = parse_months(d['months'])
        dests_out.append({
            'slug': slug,
            'name': d['name'],
            'district': d['district'],
            'stateId': st['id'],
            'stateName': st['name'],
            'zone': st['zone'],
            'themes': canon_themes(d['theme']),
            'rawTheme': d['theme'],
            'idealDays': float(d['days']),
            'bestMonthsLabel': d['months'],
            'bestMonths': months,
            'permitRequired': permit or None,
            'monsoonProduct': (d['name'].split(' ')[0] in {m.split(' ')[0] for m in MONSOON_PRODUCTS}
                               and any(m.split(' ')[0] in d['name'] for m in MONSOON_PRODUCTS)) or None,
            'ferryOrFlightOnly': st['ferryOrFlightOnly'] or None,
        })

# de-duplicate slugs properly (second occurrence onwards get a state suffix)
seen = {}
for d in dests_out:
    if d['slug'] in seen:
        d['slug'] = d['slug'] + '-' + d['stateId']
    seen[d['slug']] = True

assert len(set(d['slug'] for d in dests_out)) == len(dests_out), 'duplicate slugs remain'

header = '// Generated from the OnlyTravelers State-wise Destination Directory (Part 2 of 2).\n' \
         '// Source of truth for the catalogue: 359 destinations across 36 states and union territories.\n' \
         '// Regenerate with scripts/gen_data.py rather than editing by hand.\n\n'

states_ts = header + '''export type Zone =
  | "North India"
  | "West India"
  | "South India"
  | "East India"
  | "Central India"
  | "Northeast India";

export interface StateUnit {
  id: string;
  name: string;
  kind: "State" | "Union Territory";
  zone: Zone;
  capital: string;
  airports: string[];
  railhead: string;
  peakSeason: string;
  peakMonths: number[];
  positioning: string;
  lat: number;
  lng: number;
  permitRequired: boolean;
  ferryOrFlightOnly: boolean;
  /** Small enough that moving between its destinations is local transport. */
  compactUnit: boolean;
  /** Districts are not contiguous — crossing between them is a real journey. */
  nonContiguous: boolean;
  routingNote?: string;
}

export const zoneBlurbs: Record<Zone, string> = ''' + ts({k: v for k, v in DIR['zones'].items()}) + ''';

export const states: StateUnit[] = ''' + ts(states_out) + ''';

export const zones: Zone[] = [
  "North India",
  "West India",
  "South India",
  "East India",
  "Central India",
  "Northeast India",
];

export function getState(id: string): StateUnit | undefined {
  return states.find((s) => s.id === id);
}
'''

dests_ts = header + '''import type { Zone } from "./states";

export type Theme =
''' + '\n'.join('  | "%s"' % t for t in CANON_ORDER) + ''';

export interface Destination {
  slug: string;
  name: string;
  district: string;
  stateId: string;
  stateName: string;
  zone: Zone;
  themes: Theme[];
  /** Theme exactly as printed in the directory. */
  rawTheme: string;
  /** Time at the destination. Excludes travel to reach it. */
  idealDays: number;
  bestMonthsLabel: string;
  bestMonths: number[];
  permitRequired?: boolean;
  /** A deliberate monsoon-season product — best in Jun-Sep. */
  monsoonProduct?: boolean;
  ferryOrFlightOnly?: boolean;
}

export const themes: Theme[] = ''' + ts(CANON_ORDER) + ''';

export const destinations: Destination[] = ''' + ts(dests_out) + ''';

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function destinationsInState(stateId: string): Destination[] {
  return destinations.filter((d) => d.stateId === stateId);
}
'''

open(OUT + '/states.ts', 'w').write(states_ts)
open(OUT + '/destinations.ts', 'w').write(dests_ts)

print('states:', len(states_out))
print('destinations:', len(dests_out))
print('permit-controlled:', sum(1 for d in dests_out if d.get('permitRequired')))
print('monsoon products:', [d['name'] for d in dests_out if d.get('monsoonProduct')])
print('island transport:', sum(1 for d in dests_out if d.get('ferryOrFlightOnly')))
print('no best-months parsed:', [d['name'] for d in dests_out if not d['bestMonths']][:10])
# emit a compact worklist for writing guides
work = {}
for d in dests_out:
    work.setdefault(d['stateName'], []).append(
        {'slug': d['slug'], 'name': d['name'], 'district': d['district'],
         'theme': d['rawTheme'], 'days': d['idealDays'], 'months': d['bestMonthsLabel']})
json.dump(work, open('/tmp/claude-0/-home-user-onlytravelers/bfb6b553-b701-5570-971f-67e2685b30f4/scratchpad/worklist.json', 'w'), indent=1, ensure_ascii=False)
print('worklist written')
