// The products as people see them on "Your applications" and on the sign-in page (owner's names here; logos in apps/core/web/public/products).
// The key is the product's name in the customer config (its OIDC client id). logo: a file public/products/<key>.png
// exists (only those are requested; the others show their initials, no request).
export interface ProductInfo { name: string; tagline: string; initials: string; logo?: true }

export const PRODUCTS: Record<string, ProductInfo> = {
  logbook: { name: 'Medhanta LEAD', tagline: 'Electronic GMP logbooks for equipment, rooms and breakdowns', initials: 'LB', logo: true },
  mms: { name: 'Medhanta MMS', tagline: 'Material management: receipt, sampling, release, issue and stock', initials: 'MM', logo: true },
  qms: { name: 'Medhanta ASSURE', tagline: 'Change control, complaints, recalls, reviews, documents, audits and suppliers', initials: 'QS', logo: true },
  qual: { name: 'Medhanta EQUIP', tagline: 'IQ, OQ and PQ protocols, runs and reports', initials: 'QL', logo: true },
  deviations: { name: 'Medhanta DIVE', tagline: 'Report, investigate and close deviations with their CAPAs', initials: 'DV', logo: true },
  recruitment: { name: 'Medhanta TIDE', tagline: 'Openings, candidates, tests, interviews and offers', initials: 'RC', logo: true },
  lims: { name: 'Medhanta QLIMS', tagline: 'The QC laboratory: specifications, methods, samples, analyses, review and certificates of analysis', initials: 'LI', logo: true },
  audit: { name: 'Medhanta CLEAR', tagline: 'Compliance Library for Evaluation and Audit Readiness: audit checklists from the GMP regulations', initials: 'CL' },
  ops: { name: 'Medhanta RISE', tagline: 'OEE, losses, process parameters and advice', initials: 'OP', logo: true },
  truebatch: { name: 'TrueBatch Tablets', tagline: 'Electronic batch records for tablets, dispensing to QA release of bulk', initials: 'TB', logo: true },
  truebatch_api: { name: 'TrueBatch API', tagline: 'Electronic batch records for APIs made by chemical synthesis, first charge to QA release of the packed drums', initials: 'TA', logo: true },
  truebatch_capsules: { name: 'TrueBatch Capsules', tagline: 'Electronic batch records for hard and soft gel capsules, dispensing to QA release of bulk filled capsules', initials: 'TC', logo: true },
  truebatch_capsules_packing: { name: 'TrueBatch Capsules Packing', tagline: 'Packing batch records, released bulk capsules to QA release of the packed batch', initials: 'CP', logo: true },
  truebatch_injectables: { name: 'TrueBatch Injectables', tagline: 'Electronic batch records for sterile injectables, dispensing to QA release of filled, inspected units', initials: 'TI', logo: true },
  truebatch_liquids: { name: 'TrueBatch Oral Liquids', tagline: 'Electronic batch records for oral liquids, dispensing to QA release of the bulk', initials: 'TL', logo: true },
  truebatch_liquids_packing: { name: 'TrueBatch Oral Liquids Packing', tagline: 'Filling and packing records for oral liquids, released bulk to QA release of the packed batch', initials: 'LP', logo: true },
  truebatch_injectables_packing: { name: 'TrueBatch Injectables Packing', tagline: 'Packing batch records for injectables, released filled units to QA release of the packed batch', initials: 'IP', logo: true },
  truebatch_packing: { name: 'TrueBatch Tablets Packing', tagline: 'Packing batch records, released bulk tablets to QA release of the packed batch', initials: 'TP', logo: true },
};

export const productInfo = (p: string): ProductInfo =>
  PRODUCTS[p] ?? { name: p.charAt(0).toUpperCase() + p.slice(1), tagline: '', initials: p.slice(0, 2).toUpperCase() };

/** The databases core itself reads through a platform link (customer config `links.core`), with their views. */
export const CORE_READS: Record<string, string[]> = { recruitment: ['hire_v1', 'training_v1'] };

/** A database's name as people see it. */
export const databaseName = (db: string): string =>
  db === 'master_data' ? 'Master data' : db === 'identity' ? 'People (core)' : productInfo(db).name;
