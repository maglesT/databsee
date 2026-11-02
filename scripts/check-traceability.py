#!/usr/bin/env python3
"""Rule-to-test traceability (plan section 3): every rule in compliance/register.yaml has at least one test whose
name carries its ID (e.g. it('PL-07 ...')). Only plain it(...) calls count: not commented-out, skipped or
conditional ones. Prints the count per rule and fails if a rule has none."""
import pathlib, re, sys
import yaml

root = pathlib.Path(__file__).resolve().parent.parent
rules = [r['id'] for r in yaml.safe_load((root / 'compliance/register.yaml').read_text())['rules']]
names = []
for f in sorted((root / 'test').glob('*.test.ts')):
    names += re.findall(r"""^\s*it\(\s*(['"`])(.*?)\1""", f.read_text(), re.M)
counts = {r: sum(1 for _, n in names if re.search(rf'\b{re.escape(r)}\b', n)) for r in rules}
for r, n in counts.items():
    print(f'{r}: {n} test(s)')
missing = [r for r, n in counts.items() if n == 0]
if missing:
    sys.exit(f'No test named for: {", ".join(missing)}')
print(f'{len(rules)}/{len(rules)} rules have tests')
