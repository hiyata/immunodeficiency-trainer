export const FALLBACK_DIAGNOSIS_MENDELIAN = [
  { label:'Marfan syndrome (FBN1 mutation)', sub:'Connective tissue (AD)' },
  { label:'Osteogenesis imperfecta (COL1A1/COL1A2 mutation)', sub:'Connective tissue (AD)' },
  { label:'Loeys-Dietz syndrome (TGFBR1/2 mutation)', sub:'Connective tissue (AD)' },
  { label:'Alpha-1 antitrypsin deficiency (SERPINA1 PI*ZZ)', sub:'Codominant' },
  { label:'Primary ciliary dyskinesia (DNAH5/DNAI1 mutation)', sub:'Autosomal recessive' },
  { label:'Shwachman-Diamond syndrome (SBDS mutation)', sub:'Autosomal recessive' },
  { label:'Tay-Sachs disease (HEXA mutation)', sub:'Lysosomal storage' },
  { label:'Niemann-Pick disease type A (SMPD1 mutation)', sub:'Lysosomal storage' },
  { label:'Gaucher disease type 1 (GBA mutation)', sub:'Lysosomal storage' },
  { label:'Fabry disease (GLA mutation)', sub:'Lysosomal storage (XLR)' },
  { label:'Pompe disease (GAA mutation, GSD II)', sub:'Lysosomal storage' },
  { label:'Hypermobile EDS (no identified gene)', sub:'Connective tissue (AD)' }
];
export const FALLBACK_DEFECT_MENDELIAN = [
  'FBN1 mutation producing defective fibrillin-1',
  'COL1A1 or COL1A2 mutation producing defective type I collagen',
  'TGFBR1 or TGFBR2 mutation impairing TGF-β signaling',
  'SERPINA1 PI*ZZ misfolding mutation causing α1-antitrypsin deficiency',
  'HEXA mutation causing β-hexosaminidase A deficiency',
  'SMPD1 mutation causing acid sphingomyelinase deficiency',
  'GBA mutation causing β-glucocerebrosidase deficiency',
  'GLA mutation causing α-galactosidase A deficiency',
  'GAA mutation causing acid α-glucosidase deficiency (Pompe)',
  'Dynein-arm assembly defect from DNAH5 or DNAI1 mutation'
];
export const FALLBACK_TEST_MENDELIAN = [
  'Echocardiography with aortic-root measurement (Z-score)',
  'Serum and tissue β-hexosaminidase A enzyme activity',
  'Bone marrow biopsy with Gaucher cell or foam cell identification',
  'Serum α1-antitrypsin level with PI-type phenotyping',
  'Skin-biopsy electron microscopy with collagen-fibril analysis',
  'Plasma α-galactosidase A activity',
  'Slit-lamp examination with dilation to evaluate for lens subluxation',
  'High-resolution chest CT with mucociliary clearance scintigraphy',
  'Newborn metabolic screen for hexosaminidase A activity'
];
