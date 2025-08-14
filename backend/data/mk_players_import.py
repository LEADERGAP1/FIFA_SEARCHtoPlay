import csv, re
from datetime import datetime
from pathlib import Path

SRC = Path("/work/male_players.csv")
DST = Path("/work/players_import.csv")

def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower())

# alias de cabeceras que suelen venir en datasets de FIFA
ALIAS = {
  'short_name':       ['short_name','shortname','name_short'],
  'long_name':        ['long_name','longname','name','player_name','full_name'],
  'age':              ['age'],
  'nationality_name': ['nationality_name','nationality','nation','country'],
  'club_name':        ['club_name','club','team'],
  'club_position':    ['club_position','position','pos','player_positions'],
  'fifa_version':     ['fifa_version','version','fifa'],
  'fifa_update_date': ['fifa_update_date','update','date','updated','last_update']
}

def find_col(headers, names):
    H = {norm(h):h for h in headers}
    for n in names:
        if norm(n) in H: return H[norm(n)]
    return None

with SRC.open(newline='', encoding='utf-8') as f_in, DST.open('w', newline='', encoding='utf-8') as f_out:
    r = csv.DictReader(f_in)
    cols = {k: find_col(r.fieldnames, v) for k,v in ALIAS.items()}

    print("Cabeceras detectadas:")
    for k,v in cols.items():
        print(f"  {k:17} <- {v}")

    w = csv.DictWriter(f_out, fieldnames=[
      'short_name','long_name','age','nationality_name',
      'club_name','club_position','fifa_version','fifa_update_date'
    ])
    w.writeheader()

    kept = 0
    for row in r:
        out = {}

        def get(field, default=''):
            c = cols.get(field)
            return (row.get(c,'') if c else '') or default

        out['short_name'] = get('short_name').strip()
        out['long_name']  = (get('long_name') or out['short_name']).strip()

        # age a int; si no se puede, salteamos la fila
        try:
            out['age'] = int(float(get('age','').strip()))
        except:
            continue

        out['nationality_name'] = get('nationality_name').strip()
        out['club_name']        = get('club_name').strip()

        # club_position: si viene "player_positions", tomar la primera
        pos_raw = get('club_position').strip()
        if ',' in pos_raw:
            pos_raw = pos_raw.split(',')[0].strip()
        out['club_position'] = pos_raw

        # defaults si faltan (tu modelo marca NOT NULL)
        out['fifa_version'] = (get('fifa_version') or '25').strip()

        dt = get('fifa_update_date').strip()
        if dt:
            ok = False
            for fmt in ('%Y-%m-%d','%d/%m/%Y','%m/%d/%Y','%d-%m-%Y'):
                try:
                    dt = datetime.strptime(dt, fmt).strftime('%Y-%m-%d')
                    ok = True; break
                except: pass
            if not ok: dt = '2024-09-15'
        else:
            dt = '2024-09-15'
        out['fifa_update_date'] = dt

        # validaciones mínimas
        if not out['short_name'] or not out['nationality_name']:
            continue

        w.writerow(out)
        kept += 1

print("OK: generado /work/players_import.csv")
