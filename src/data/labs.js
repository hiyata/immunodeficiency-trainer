// =============================================================================
// labs.js — Lab generation tables, formatting utilities, and label maps
// Exports: LAB_GEN, NORMAL_RANGES, genVal, LAB_LABELS, SPECIAL_LABEL,
//          SPECIAL_UNIT, fmtLab, capitalize
// =============================================================================

import { randFloat, randInt } from '../utils/random.js';

export const LAB_GEN = {
  igG: { absent:[5,30], very_low:[40,200], low:[250,550], normal:[750,1500], high:[1700,2200], very_high:[2300,3500] },
  igA: { absent:[0,4], very_low:[1,8], low:[10,45], normal:[80,380], high:[420,650], very_high:[700,1200] },
  igM: { absent:[1,5], very_low:[3,15], low:[18,35], normal:[50,220], high:[260,500], very_high:[600,2500] },
  igE: { absent:[0,1], very_low:[0,2], low:[1,5], normal:[10,90], high:[300,1500], very_high:[2500,50000] },
  bCells: { absent:[0,8], low:[20,90], normal:[150,500], high:[600,1200] },
  tCells: { absent:[10,80], low:[200,600], normal:[900,2000], high:[2200,3500] },
  wbc: { low:[2.0,3.5], normal:[4.5,10.5], high:[14,28], very_high:[60,280] },
  plt: { very_low:[15,55], low:[60,120], normal:[170,380], high:[450,650], very_high:[700,1400] },
  hgb: { very_low:[5,7.5], low:[8,11], normal:[12,15.5], high:[16,18], very_high:[18.5,22] },
  mpv: { low:[3.5,5.5], normal:[7.5,11.0], high:[12,14] },
};

export const NORMAL_RANGES = { igG:'700–1600 mg/dL', igA:'70–400 mg/dL', igM:'40–230 mg/dL', igE:'<100 IU/mL', bCells:'100–500 /μL', tCells:'700–2100 /μL', wbc:'4.5–11.0 ×10³/μL', plt:'150–400 ×10³/μL', hgb:'12–16 g/dL', mpv:'7.5–11.5 fL' };

export const genVal = (lab, qual) => {
  const range = LAB_GEN[lab][qual] || LAB_GEN[lab].normal;
  if (lab === 'wbc' || lab === 'hgb' || lab === 'mpv') return randFloat(range[0], range[1], 1);
  return randInt(range[0], range[1]);
};

export const LAB_LABELS = { igG:'IgG', igA:'IgA', igM:'IgM', igE:'IgE', bCells:'CD19+ B cells', tCells:'CD3+ T cells', wbc:'WBC', plt:'Platelets', hgb:'Hemoglobin', mpv:'Mean Platelet Volume' };

export function fmtLab(k, v) {
  let display, ref, status;
  switch(k) {
    case 'igG': display=`${v} mg/dL`; ref=NORMAL_RANGES.igG; status=v<700?'low':v>1600?'high':'normal'; break;
    case 'igA': display=`${v} mg/dL`; ref=NORMAL_RANGES.igA; status=v<70?'low':v>400?'high':'normal'; break;
    case 'igM': display=`${v} mg/dL`; ref=NORMAL_RANGES.igM; status=v<40?'low':v>230?'high':'normal'; break;
    case 'igE': display=`${v} IU/mL`; ref=NORMAL_RANGES.igE; status=v>100?'high':'normal'; break;
    case 'bCells': display=`${v} /μL`; ref=NORMAL_RANGES.bCells; status=v<100?'low':v>500?'high':'normal'; break;
    case 'tCells': display=`${v} /μL`; ref=NORMAL_RANGES.tCells; status=v<700?'low':v>2100?'high':'normal'; break;
    case 'wbc': display=`${v} ×10³/μL`; ref=NORMAL_RANGES.wbc; status=v<4.5?'low':v>11?'high':'normal'; break;
    case 'plt': display=`${v} ×10³/μL`; ref=NORMAL_RANGES.plt; status=v<150?'low':v>400?'high':'normal'; break;
    case 'hgb': display=`${v} g/dL`; ref=NORMAL_RANGES.hgb; status=v<12?'low':v>16?'high':'normal'; break;
    case 'mpv': display=`${v} fL`; ref=NORMAL_RANGES.mpv; status=v<7.5?'low':v>11.5?'high':'normal'; break;
    default: display=String(v); ref=''; status='normal';
  }
  return { display, ref, status };
}

export const SPECIAL_LABEL = { ca:'Serum calcium', afp:'α-Fetoprotein', dhr:'DHR (NADPH oxidase)', ch50:'CH50 (total complement)', cd18:'CD18 (flow cytometry)', karyo:'Karyotype / chromosomal microarray', methylation:'DNA methylation analysis (15q11-q13)', testosterone:'Total testosterone', lh:'Luteinizing hormone (LH)', fsh:'Follicle-stimulating hormone (FSH)', estradiol:'Estradiol', tsh:'TSH', ghrelin:'Fasting serum ghrelin', repeats:'Trinucleotide repeat sizing (PCR)', sweat:'Sweat chloride (quantitative pilocarpine iontophoresis)', irt:'Immunoreactive trypsinogen (newborn screen)', enzyme:'Leukocyte lysosomal-enzyme activity', gags:'Urinary glycosaminoglycans', collagen:'Targeted collagen gene sequencing',
  // Hematology / oncology
  smear:'Peripheral blood smear',
  blasts:'Bone-marrow blast percentage',
  flow:'Flow cytometry (peripheral blood)',
  bmbx:'Bone marrow biopsy / aspirate',
  cytogenetics:'Karyotype / FISH (cytogenetics)',
  bcrabl:'BCR-ABL1 by RT-PCR',
  jak2:'JAK2 V617F mutation analysis',
  trap:'Tartrate-resistant acid phosphatase (TRAP) stain',
  braf:'BRAF V600E mutation analysis',
  lap:'Leukocyte alkaline phosphatase (LAP) score',
  ldh:'Serum lactate dehydrogenase (LDH)',
  uricacid:'Serum uric acid',
  spep:'Serum protein electrophoresis (SPEP)',
  upep:'Urine protein electrophoresis / immunofixation',
  freelc:'Serum free light-chain ratio (κ/λ)',
  m_spike:'Monoclonal (M) protein quantitation',
  beta2m:'Serum β2-microglobulin',
  epo:'Serum erythropoietin (EPO)',
  hct:'Hematocrit',
  smudge:'Peripheral-smear smudge-cell count',
  rs_cells:'Reed-Sternberg cells on lymph-node biopsy',
  histology:'Lymph-node histopathology',
  htlv:'HTLV-1 serology (anti-HTLV-1 antibody)',
  tcr_gene:'T-cell receptor gene rearrangement (PCR)',
  igh_gene:'Immunoglobulin heavy-chain gene rearrangement (PCR)',
  hpylori:'Helicobacter pylori testing (urea breath test or biopsy)',
  ki67:'Ki-67 proliferation index',
  cd_panel:'Immunophenotype (flow / IHC)',
  skin_bx:'Skin punch biopsy',
  abg:'Arterial blood gas (room air)'
};

export const SPECIAL_UNIT = { ca:' mg/dL', afp:' ng/mL', testosterone:' ng/dL', lh:' mIU/mL', fsh:' mIU/mL', estradiol:' pg/mL', tsh:' μIU/mL', ghrelin:' pg/mL', sweat:' mEq/L', irt:' ng/mL',
  // Hematology / oncology
  ldh:' U/L', uricacid:' mg/dL', beta2m:' mg/L', epo:' mU/mL', hct:'%', m_spike:' g/dL', lap:''
};

export function capitalize(s) { return s.charAt(0).toUpperCase()+s.slice(1); }
