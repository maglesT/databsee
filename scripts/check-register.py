#!/usr/bin/env python3
"""Check every clause cited in compliance/register.yaml against the official texts.

For each citation: the clause must exist in the source text, and the quoted phrase must
appear inside that clause (whitespace, hyphenation and ligatures normalised).
Usage: python3 scripts/check-register.py [--render docs/03-compliance-register.md]
Exit code 1 if any citation fails.
"""
import re
import sys
import unicodedata
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
SOURCES = {
    "CFR211": "cfr211.txt", "CFR11": "cfr11.txt",
    "C3": "eu-ch3.txt", "C4": "eu-ch4.txt", "C5": "eu-ch5.txt", "C6": "eu-ch6.txt",
    "A11": "eu-annex11.txt",
    "SCHM": "schedule-m-part1.txt",
}
NUMBERED = re.compile(r"^\s*(\d+\.\d+(?:\.\d+)*\.?|\d+\.)\s")


def norm(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("’", "'").replace("“", '"').replace("”", '"')
    text = re.sub(r"-\s*\n\s*", "-", text)
    return re.sub(r"\s+", " ", text).strip().lower()


def cfr_section(lines, clause):
    m = re.match(r"(\d+\.\d+)((?:\([a-z0-9]+\))*)$", clause)
    if not m:
        return None, f"bad CFR clause format {clause}"
    sec, subs = m.group(1), m.group(2)
    starts = [i for i, l in enumerate(lines) if l.startswith(f"§ {sec} ")]
    if not starts:
        return None, f"section § {sec} not found"
    i = starts[-1]  # body, not the table of contents
    j = i + 1
    while j < len(lines) and not lines[j].startswith("§ "):
        j += 1
    body = "\n".join(lines[i:j])
    for part in re.findall(r"\([a-z0-9]+\)", subs):
        if part not in body:
            return None, f"paragraph {part} not found in § {sec}"
    return body, None


def numbered_clause(lines, clause):
    want = clause.rstrip(".")
    for i, l in enumerate(lines):
        m = NUMBERED.match(l)
        if m and m.group(1).rstrip(".") == want:
            j = i + 1
            while j < len(lines):
                n = NUMBERED.match(lines[j])
                if n and not n.group(1).rstrip(".").startswith(want + "."):
                    break
                j += 1
            return "\n".join(lines[i:j]), None
    return None, f"clause {clause} not found"


def check(register):
    texts = {k: (ROOT / "compliance/sources" / f).read_text(encoding="utf-8") for k, f in SOURCES.items()}
    failures, count = [], 0
    for rule in register["rules"]:
        for c in rule["clauses"]:
            count += 1
            lines = texts[c["src"]].splitlines()
            finder = cfr_section if c["src"].startswith("CFR") else numbered_clause
            body, err = finder(lines, c["clause"])
            if err is None and norm(c["quote"]) not in norm(body):
                err = f'quote not in clause: "{c["quote"]}"'
            if err:
                failures.append(f'{rule["id"]} {c["src"]} {c["clause"]}: {err}')
    return count, failures


def cite(c):
    return f'{c["src"]} {c["clause"]} "{c["quote"]}"'


def render(register, out: Path):
    r = ["# Deliverable (c) — Minimum compliance register",
         "",
         "Generated from `compliance/register.yaml` by `scripts/check-register.py --render`; edit the YAML, not this file.",
         "",
         "**Test for every rule:** a binding clause (21 CFR 211/11 *shall*, EudraLex Vol 4, Revised Schedule M) breaks if it is dropped. FDA guidance only narrows. Least-strict implementation that satisfies all three.",
         "",
         "**Source keys:** CFR211, CFR11 (eCFR 24 Sep 2026); C3–C6 EudraLex Vol 4 Part I chapters; A8, A11, A19 annexes; SCHM Revised Schedule M (G.S.R. 922(E)) Part I.",
         "",
         f'**{len(register["rules"])} product rules, {len(register["customer_procedures"])} customer procedures.**',
         "",
         "## A. Product rules", ""]
    for x in register["rules"]:
        r += [f'### {x["id"]} — {x["title"]}', "",
              f'**Rule.** {x["rule"]}', "",
              "**Clauses.** " + "; ".join(cite(c) for c in x["clauses"]), "",
              f'**Breaks if dropped.** {x["breaks_if_dropped"]}', "",
              f'**Implementation (least strict).** {x["implementation"]}', "",
              f'**Test.** {x["test"]}', ""]
    r += ["## B. Customer procedures (the site does them; the product supports)", "",
          "| ID | Procedure | Clauses | Product support |", "|---|---|---|---|"]
    r += [f'| {x["id"]} | {x["rule"]} | {x["clauses"]} | {x["support"]} |' for x in register["customer_procedures"]]
    r += ["", "## C. Considered and not applicable", "", "| Clause | Why |", "|---|---|"]
    r += [f'| {x["clause"]} | {x["why"]} |' for x in register["not_applicable"]]
    r += ["", "## D. Dropped candidates (no binding clause breaks)", "", "| Candidate | Why dropped |", "|---|---|"]
    r += [f'| {x["candidate"]} | {x["why"]} |' for x in register["dropped"]]
    out.write_text("\n".join(r) + "\n", encoding="utf-8")


def main():
    register = yaml.safe_load((ROOT / "compliance/register.yaml").read_text(encoding="utf-8"))
    count, failures = check(register)
    for f in failures:
        print("FAIL", f)
    print(f"{count - len(failures)}/{count} citations verified")
    if "--render" in sys.argv:
        render(register, ROOT / sys.argv[sys.argv.index("--render") + 1])
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
