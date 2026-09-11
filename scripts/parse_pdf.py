import json, re
from pypdf import PdfReader

SRC = '/root/.claude/uploads/bfb6b553-b701-5570-971f-67e2685b30f4/11ab8d81-OnlyTravelers_India_Statewise_Destination_Directory_final.pdf'
reader = PdfReader(SRC)
pages = [(p.extract_text(extraction_mode='layout') or '') for p in reader.pages]

lines = []
for pno, text in enumerate(pages):
    for raw in text.split('\n'):
        if not raw.strip():
            continue
        if 'OnlyTravelers  |  State-wise Destination Directory' in raw:
            continue
        lines.append((pno, raw.rstrip()))

def col(raw):
    """Split a layout line on runs of 2+ spaces, keeping each chunk's start column."""
    out = []
    pos = 0
    for m in list(re.finditer(r'\s{2,}', raw)) + [None]:
        seg = raw[pos:m.start()] if m else raw[pos:]
        if seg.strip():
            out.append((pos + len(seg) - len(seg.lstrip()), seg.strip()))
        if m is None:
            break
        pos = m.end()
    return out

def row_is_new(chunks, header_cols):
    """A new table row carries values in the Days and Best Months columns."""
    keys = ['name', 'district', 'theme', 'days', 'months']
    seen = set()
    for pos, _text in chunks:
        best_k, best_d = None, 1e9
        for (hpos, _h), k in zip(header_cols, keys):
            d = abs(pos - hpos)
            if d < best_d:
                best_d, best_k = d, k
        seen.add(best_k)
    return 'days' in seen and 'months' in seen


zones = {}
states = []
cur_zone = None
cur_state = None
i = 0
n = len(lines)

ZONE_RE = re.compile(r'^\s*ZONE · (.+)$')
PEAK_RE = re.compile(r'^Peak:\s*(.+)$')

while i < n:
    pno, raw = lines[i]
    stripped = raw.strip()

    m = ZONE_RE.match(raw)
    if m:
        cur_zone = m.group(1).strip().title().replace('India', 'India')
        # next non-empty line is the zone blurb
        if i + 1 < n:
            zones[cur_zone] = lines[i + 1][1].strip()
        i += 2
        continue

    chunks = col(raw)
    texts = [c[1] for c in chunks]

    # State header line: "<Name> ... STATE|UNION TERRITORY" possibly with Peak on same or next line
    if any(t in ('STATE', 'UNION TERRITORY') for t in texts) and cur_zone:
        kind = 'Union Territory' if 'UNION TERRITORY' in texts else 'State'
        name_candidates = [t for t in texts if t not in ('STATE', 'UNION TERRITORY') and not t.startswith('Peak:')]
        name = name_candidates[0] if name_candidates else None
        peak = None
        for t in texts:
            if t.startswith('Peak:'):
                peak = t[len('Peak:'):].strip()
        # name / peak may be on the following line
        j = i + 1
        while (name is None or peak is None) and j < n and j < i + 4:
            t2 = col(lines[j][1])
            for _, t in t2:
                if t.startswith('Peak:') and peak is None:
                    peak = t[len('Peak:'):].strip()
                elif name is None and t not in ('STATE', 'UNION TERRITORY'):
                    name = t
            j += 1
        cur_state = {
            'name': name, 'kind': kind, 'zone': cur_zone, 'peak': peak,
            'capital': None, 'airports': None, 'count': None, 'note': None,
            'destinations': [],
        }
        states.append(cur_state)
        i = j
        continue

    if stripped.startswith('CAPITAL') and cur_state:
        # values are on the next line, aligned under CAPITAL / AIRPORTS / DESTINATIONS
        if i + 1 < n:
            vals = [t for _, t in col(lines[i + 1][1])]
            if len(vals) >= 3:
                cur_state['capital'], cur_state['airports'], cur_state['count'] = vals[0], vals[1], vals[2]
            elif len(vals) == 2:
                cur_state['capital'], cur_state['airports'] = vals[0], vals[1]
        # the state note follows
        if i + 2 < n:
            note_line = lines[i + 2][1].strip()
            if not note_line.startswith('Destination'):
                cur_state['note'] = note_line
        i += 3
        continue

    # Table header row
    if len(texts) >= 4 and texts[0] == 'Destination' and 'Theme' in texts:
        header_cols = chunks  # positions for Destination / District / Theme / Days / Best Months
        i += 1
        # consume data rows until next structural marker
        while i < n:
            pno2, raw2 = lines[i]
            s2 = raw2.strip()
            c2 = col(raw2)
            t2 = [t for _, t in c2]
            if not c2:
                i += 1
                continue
            if (t2[0] == 'Destination' and 'Theme' in t2) or ZONE_RE.match(raw2) \
               or any(t in ('STATE', 'UNION TERRITORY') for t in t2) or s2.startswith('CAPITAL'):
                break
            # appendix pages after the last state table
            if s2.startswith('Destination page layout') or s2.startswith('Photo sourcing plan') \
               or s2.startswith('Using this as seed data') or s2.startswith('Tier') \
               or s2.startswith('Total catalogue') or 'HERO IMAGE' in s2:
                cur_state = None
                break
            # stop a state's table once it has its declared number of rows
            if cur_state and (cur_state['count'] or '').isdigit() \
               and len(cur_state['destinations']) >= int(cur_state['count']) \
               and row_is_new(c2, header_cols):
                break
            # assign chunks to columns by nearest header start
            row = {'name': [], 'district': [], 'theme': [], 'days': None, 'months': []}
            keys = ['name', 'district', 'theme', 'days', 'months']
            for pos, text in c2:
                # find closest header column start
                best_k, best_d = None, 1e9
                for (hpos, _htext), k in zip(header_cols, keys):
                    d = abs(pos - hpos)
                    if d < best_d:
                        best_d, best_k = d, k
                if best_k == 'days':
                    row['days'] = text
                else:
                    row[best_k].append(text)
            name = ' '.join(row['name']).strip()
            district = ' '.join(row['district']).strip()
            theme = ' '.join(row['theme']).strip()
            months = ' '.join(row['months']).strip()
            days = row['days']

            is_continuation = (
                cur_state and cur_state['destinations']
                and days is None and not months
                and (bool(name) + bool(district) + bool(theme)) <= 2
            )
            if is_continuation:
                prev = cur_state['destinations'][-1]
                if name:
                    prev['name'] = (prev['name'] + ' ' + name).strip()
                if district:
                    prev['district'] = (prev['district'] + ' ' + district).strip()
                if theme:
                    prev['theme'] = (prev['theme'] + ' ' + theme).strip()
            elif cur_state is not None and name:
                cur_state['destinations'].append({
                    'name': name, 'district': district, 'theme': theme,
                    'days': days, 'months': months,
                })
            i += 1
        continue

    i += 1

# tidy: collapse double spaces, fix wrapped themes like "Spiritual /  Adventure"
for st in states:
    for d in st['destinations']:
        for k in ('name', 'district', 'theme', 'months'):
            d[k] = re.sub(r'\s+', ' ', d[k]).replace(' /', ' /').strip()
        d['theme'] = re.sub(r'/\s*', ' / ', d['theme']).strip()
        d['theme'] = re.sub(r'\s+', ' ', d['theme'])

total = sum(len(s['destinations']) for s in states)
print('zones:', list(zones.keys()))
print('states parsed:', len(states))
print('destinations parsed:', total)
missing_days = [(s['name'], d['name']) for s in states for d in s['destinations'] if not d['days']]
print('rows missing days:', len(missing_days), missing_days[:10])
for s in states:
    declared = int(s['count']) if (s['count'] or '').isdigit() else None
    got = len(s['destinations'])
    flag = '' if declared == got else '   <-- MISMATCH declared=%s' % declared
    print('%-28s %-16s %-3s got=%-3s%s' % (s['name'], s['zone'], s['count'], got, flag))

json.dump({'zones': zones, 'states': states}, open('/tmp/claude-0/-home-user-onlytravelers/bfb6b553-b701-5570-971f-67e2685b30f4/scratchpad/directory.json', 'w'), indent=1, ensure_ascii=False)
print('written')
