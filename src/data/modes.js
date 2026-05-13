// =========================================================================
// HOW TO ADD A NEW MODE
// =========================================================================
// 1. Create a new file at src/data/syndromes/<yourmode>.js and export a
//    named array (e.g. SYNDROMES_YOURMODE) of syndrome objects following
//    the schema documented at the top of that file.
// 2. (Optional) Create src/data/fallbacks/<yourmode>.js and export
//    FALLBACK_DIAGNOSIS_*, FALLBACK_DEFECT_*, FALLBACK_TEST_*, and any
//    FALLBACK_CARDIAC / FALLBACK_COMPLICATION arrays you need.
// 3. Import your syndrome array and fallback arrays below.
// 4. Add a new entry object to the MODES array following the same shape as
//    the existing entries (id, name, blurb, syndromes, pmhPool, shxPool,
//    headerLabel, fallbacks).  The id must be a unique camelCase string.
// =========================================================================

import { SYNDROMES_IMMUNO }      from './syndromes/immunodeficiency.js';
import { SYNDROMES_TRISOMY }     from './syndromes/trisomy.js';
import { SYNDROMES_TRINUCLEOTIDE } from './syndromes/trinucleotide.js';
import { SYNDROMES_MENDELIAN }   from './syndromes/mendelian.js';
import { SYNDROMES_HEME }        from './syndromes/hematology.js';

import { FALLBACK_DIAGNOSIS_HEME, FALLBACK_DEFECT_HEME, FALLBACK_TEST_HEME, FALLBACK_COMPLICATION_HEME } from './fallbacks/hematology.js';
import { FALLBACK_DIAGNOSIS_TRISOMY, FALLBACK_DEFECT_TRISOMY, FALLBACK_TEST_TRISOMY } from './fallbacks/trisomy.js';
import { FALLBACK_DIAGNOSIS_TRINUCLEOTIDE, FALLBACK_DEFECT_TRINUCLEOTIDE, FALLBACK_TEST_TRINUCLEOTIDE } from './fallbacks/trinucleotide.js';
import { FALLBACK_DIAGNOSIS_MENDELIAN, FALLBACK_DEFECT_MENDELIAN, FALLBACK_TEST_MENDELIAN } from './fallbacks/mendelian.js';
import { FALLBACK_CARDIAC, FALLBACK_COMPLICATION } from './fallbacks/shared.js';

import { RH_PMH, RH_SHX, NEONATAL_PMH, NEONATAL_SHX, ADULT_PMH, ADULT_SHX, PEDIATRIC_PMH, PEDIATRIC_SHX } from './patient.js';

export const MODES = [
  {
    id:'immuno',
    name:'Immunodeficiency',
    blurb:'Primary immunodeficiencies — B-cell, T-cell, combined, phagocyte, complement.',
    syndromes: SYNDROMES_IMMUNO,
    pmhPool: RH_PMH,
    shxPool: RH_SHX,
    headerLabel:'Immunodeficiency',
    fallbacks:{}
  },
  {
    id:'trisomy',
    name:'Chromosomal Disorders',
    blurb:'Chromosomal and imprinting syndromes: trisomies 21/18/13, Klinefelter, Turner, Angelman, Prader-Willi.',
    syndromes: SYNDROMES_TRISOMY,
    pmhPool: NEONATAL_PMH,
    shxPool: NEONATAL_SHX,
    headerLabel:'Chromosomal Disorders',
    fallbacks:{
      diagnosis: FALLBACK_DIAGNOSIS_TRISOMY,
      defect: FALLBACK_DEFECT_TRISOMY,
      test: FALLBACK_TEST_TRISOMY,
      cardiac: FALLBACK_CARDIAC,
      complication: FALLBACK_COMPLICATION
    }
  },
  {
    id:'trinucleotide',
    name:'Trinucleotide Repeat Disorders',
    blurb:'Triplet-repeat expansion diseases: Huntington, Friedreich ataxia, myotonic dystrophy, fragile X, spinocerebellar ataxia.',
    syndromes: SYNDROMES_TRINUCLEOTIDE,
    pmhPool: ADULT_PMH,
    shxPool: ADULT_SHX,
    headerLabel:'Trinucleotide Repeat Disorders',
    fallbacks:{
      diagnosis: FALLBACK_DIAGNOSIS_TRINUCLEOTIDE,
      defect: FALLBACK_DEFECT_TRINUCLEOTIDE,
      test: FALLBACK_TEST_TRINUCLEOTIDE,
      cardiac: FALLBACK_CARDIAC,
      complication: FALLBACK_COMPLICATION
    }
  },
  {
    id:'mendelian',
    name:'Inherited Multisystem Disorders',
    blurb:'Single-gene Mendelian disorders: cystic fibrosis, MPS I (Hurler), MPS II (Hunter), classical EDS, vascular EDS.',
    syndromes: SYNDROMES_MENDELIAN,
    pmhPool: PEDIATRIC_PMH,
    shxPool: PEDIATRIC_SHX,
    headerLabel:'Inherited Multisystem Disorders',
    fallbacks:{
      diagnosis: FALLBACK_DIAGNOSIS_MENDELIAN,
      defect: FALLBACK_DEFECT_MENDELIAN,
      test: FALLBACK_TEST_MENDELIAN,
      cardiac: FALLBACK_CARDIAC,
      complication: FALLBACK_COMPLICATION
    }
  },
  {
    id:'heme',
    name:'Leukemias and Lymphomas',
    blurb:'Hematologic malignancies — acute and chronic leukemias (AML, ALL, CML, CLL, hairy cell), Hodgkin and non-Hodgkin lymphomas (Burkitt, DLBCL, follicular, mantle, MALT), multiple myeloma, polycythemia vera vs secondary erythrocytosis, ATLL, mycosis fungoides.',
    syndromes: SYNDROMES_HEME,
    pmhPool: ADULT_PMH,
    shxPool: ADULT_SHX,
    headerLabel:'Leukemias and Lymphomas',
    fallbacks:{
      diagnosis: FALLBACK_DIAGNOSIS_HEME,
      defect: FALLBACK_DEFECT_HEME,
      test: FALLBACK_TEST_HEME,
      complication: FALLBACK_COMPLICATION_HEME
    }
  }
];
