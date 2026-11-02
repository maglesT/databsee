# Medhanta platform

Shared layer under the Medhanta pharma products: master data, identity + single sign-on, links between products, control panel and GitOps pipeline.

See docs/plan.md.

## Checks
- `python3 scripts/check-register.py --render docs/03-compliance-register.md` verifies every clause cited in
  `compliance/register.yaml` against the official texts in `compliance/sources/` (copied from Material Management)
  and regenerates the register document.
