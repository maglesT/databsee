// The products as people see them on "Your applications" and on the sign-in page (owner's names here; logos in apps/core/web/public/products).
// The key is the product's name in the customer config (its OIDC client id).
export interface ProductInfo { name: string; tagline: string; initials: string }

export const PRODUCTS: Record<string, ProductInfo> = {
  logbook: { name: 'Pharma Logbook', tagline: 'Electronic GMP logbooks for equipment, rooms and breakdowns', initials: 'LB' },
  mms: { name: 'Materials', tagline: 'Material management: receipt, sampling, release, issue and stock', initials: 'MM' },
  qms: { name: 'Quality System', tagline: 'Change control, complaints, recalls, reviews, documents, audits and suppliers', initials: 'QS' },
  qual: { name: 'Qualification', tagline: 'IQ, OQ and PQ protocols, runs and reports', initials: 'QL' },
  deviations: { name: 'Deviations & CAPA', tagline: 'Report, investigate and close deviations with their CAPAs', initials: 'DV' },
  recruitment: { name: 'Recruitment', tagline: 'Openings, candidates, tests, interviews and offers', initials: 'RC' },
  ops: { name: 'Operations', tagline: 'OEE, losses, process parameters and advice', initials: 'OP' },
  truebatch: { name: 'TrueBatch Tablets', tagline: 'Electronic batch records for tablets, dispensing to QA release of bulk', initials: 'TB' },
  truebatch_injectables: { name: 'TrueBatch Injectables', tagline: 'Electronic batch records for sterile injectables, dispensing to QA release of filled, inspected units', initials: 'TI' },
  truebatch_injectables_packing: { name: 'TrueBatch Injectables Packing', tagline: 'Packing batch records for injectables, released filled units to QA release of the packed batch', initials: 'IP' },
  truebatch_packing: { name: 'TrueBatch Tablets Packing', tagline: 'Packing batch records, released bulk tablets to QA release of the packed batch', initials: 'TP' },
};

export const productInfo = (p: string): ProductInfo =>
  PRODUCTS[p] ?? { name: p.charAt(0).toUpperCase() + p.slice(1), tagline: '', initials: p.slice(0, 2).toUpperCase() };
