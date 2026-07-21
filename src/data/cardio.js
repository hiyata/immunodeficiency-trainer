// =========================================================================
// Cardiac action potential sandbox — reference data
// =========================================================================

export const BASELINE_PARAMS = {
  INa: 100, ICaL: 100, Ito: 100, IKr: 100, IKs: 100,
  IK1: 100, If: 100, ICaT: 100, IK_ACh: 100, NaKATPase: 100
};

export const CHANNEL_LABELS = {
  INa: 'I_Na (fast Na⁺)',
  ICaL: 'I_CaL (L-type Ca²⁺)',
  Ito: 'I_to (transient outward K⁺)',
  IKr: 'I_Kr (rapid delayed rectifier K⁺)',
  IKs: 'I_Ks (slow delayed rectifier K⁺)',
  IK1: 'I_K1 (inward rectifier K⁺)',
  If: 'I_f (funny)',
  ICaT: 'I_CaT (T-type Ca²⁺)',
  IK_ACh: 'I_K,ACh',
  NaKATPase: 'Na⁺/K⁺-ATPase'
};

export const CHANNEL_ROLES = {
  INa: 'fast Na⁺ upstroke (Phase 0)',
  ICaL: 'L-type Ca²⁺; plateau & nodal upstroke',
  Ito: 'transient outward K⁺; phase-1 notch',
  IKr: 'rapid delayed rectifier K⁺; repolarization',
  IKs: 'slow delayed rectifier K⁺; repolarization',
  IK1: 'inward rectifier K⁺; resting potential',
  If: 'funny current; pacemaker slope',
  ICaT: 'T-type Ca²⁺; pacemaker slope',
  IK_ACh: 'ACh-gated K⁺; vagal tone',
  NaKATPase: 'Na⁺/K⁺ pump; resting stability'
};

export const SIMILAR_CHANNEL_GROUPS = [['IKr', 'IKs'], ['ICaL', 'ICaT'], ['If', 'ICaT']];

export const CELL_TYPES = [
  { id: 'ventricular', name: 'Ventricular Myocyte', uses: { INa: 1, ICaL: 1, Ito: 1, IKr: 1, IKs: 1, IK1: 1, If: 0, ICaT: 0, IK_ACh: 0, NaKATPase: 1 } },
  { id: 'atrial', name: 'Atrial Myocyte', uses: { INa: 1, ICaL: 1, Ito: 1, IKr: 1, IKs: 1, IK1: 1, If: 0, ICaT: 0, IK_ACh: 1, NaKATPase: 1 } },
  { id: 'sa', name: 'SA Node (Pacemaker)', uses: { INa: 0, ICaL: 1, Ito: 0, IKr: 1, IKs: 1, IK1: 1, If: 1, ICaT: 1, IK_ACh: 1, NaKATPase: 1 } },
  { id: 'purkinje', name: 'Purkinje Cell', uses: { INa: 1, ICaL: 1, Ito: 1, IKr: 1, IKs: 1, IK1: 1, If: 1, ICaT: 1, IK_ACh: 0, NaKATPase: 1 } },
];

export const DRUG_PRESETS = {
  'None': {},
  // Sympathomimetics / beta-agonists
  'Isoproterenol (β agonist)': { ICaL: 130, IKs: 120, If: 125 },
  'Dobutamine (β₁ agonist)': { ICaL: 125, IKs: 115, If: 115 },
  // Beta-blockers (rate/inotropy down)
  'Propranolol (β blocker)': { ICaL: 80, IKs: 90, If: 90 },
  'Atenolol (β₁ blocker)': { ICaL: 85, IKs: 90, If: 90 },
  'Metoprolol (β₁ blocker)': { ICaL: 85, IKs: 90, If: 90 },
  'Esmolol (β₁ blocker, short)': { ICaL: 85, IKs: 90, If: 90 },
  // Parasympathetic modifiers / nodal agents
  'Adenosine (A₁ agonist)': { IK_ACh: 150, If: 85, ICaL: 90 },
  'Atropine (M₂ antagonist)': { IK_ACh: 70, If: 110 },
  'Scopolamine (M₂ antagonist)': { IK_ACh: 70, If: 110 },
  'Physostigmine (AChE inhibitor)': { IK_ACh: 130, If: 90 },
  // HCN / If
  'Ivabradine (If blocker)': { If: 40 },
  // Calcium channel blockers (Class IV)
  'Verapamil (L-type CCB)': { ICaL: 50 },
  'Diltiazem (L-type CCB)': { ICaL: 60 },
  'Nifedipine (dihydropyridine CCB)': { ICaL: 60 },
  'Amlodipine (dihydropyridine CCB)': { ICaL: 60 },
  // Na+ channel blockers (Class I)
  'Lidocaine (Class IB)': { INa: 60 },
  'Mexiletine (Class IB)': { INa: 60 },
  'Procainamide (Class IA)': { INa: 70, IKr: 85 },
  'Disopyramide (Class IA)': { INa: 70, IKr: 90 },
  'Quinidine (Class IA)': { INa: 70, IKr: 85 },
  'Flecainide (Class IC)': { INa: 50 },
  // Late INa / multichannel
  'Ranolazine (late INa)': { INa: 70 },
  'Amiodarone (multi-channel)': { INa: 70, ICaL: 70, IKr: 70, IKs: 85 },
  // K+ channel blockers (Class III)
  'Ibutilide (IKr blocker)': { IKr: 60 },
  'Dofetilide (IKr blocker)': { IKr: 50 },
  // Inotropes affecting Ca2+ handling
  'Milrinone (PDE3 inhibitor)': { ICaL: 120, IKs: 110, If: 110 },
  'Digoxin (cardiac glycoside)': { NaKATPase: 40 },
  // Peripheral sympatholytics
  'Reserpine (VMAT inhibitor)': { ICaL: 95, IKs: 95, If: 95 },
  'Guanethidine (adrenergic depletor)': { ICaL: 95, IKs: 95, If: 95 },
};

export const ENV_PRESETS = {
  'None': {},
  'Hypokalemia': { IK1: 120, IKr: 90, IKs: 95 },
  'Hyperkalemia': { IK1: 60, INa: 80 },
  'Ischemia': { NaKATPase: 50, IK1: 70, IKr: 120 },
};

export const PHASE_GROUPS = [
  { label: 'Phase 0 (Upstroke)', keys: ['INa', 'ICaL'] },
  { label: 'Phase 1 (Notch)', keys: ['Ito'] },
  { label: 'Phase 2 (Plateau)', keys: ['ICaL', 'IKr', 'IKs'] },
  { label: 'Phase 3 (Repolarization)', keys: ['IKr', 'IKs'] },
  { label: 'Phase 4 (Rest/Diastolic)', keys: ['IK1', 'If', 'ICaT', 'IK_ACh', 'NaKATPase'] },
];
