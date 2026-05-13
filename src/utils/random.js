// =============================================================================
// random.js — Utility functions for randomization
// Exports: rand, randInt, randFloat, pick, weighted, caseId, shuffle
// =============================================================================

export const rand = (a) => a[Math.floor(Math.random()*a.length)];
export const randInt = (lo, hi) => Math.floor(Math.random()*(hi-lo+1))+lo;
export const randFloat = (lo, hi, dp=1) => +(Math.random()*(hi-lo)+lo).toFixed(dp);
export const pick = (arr, n) => { const c=[...arr]; const out=[]; for(let i=0;i<n && c.length;i++){ out.push(c.splice(Math.floor(Math.random()*c.length),1)[0]); } return out; };
export const weighted = (items, weights) => { const total = weights.reduce((a,b)=>a+b,0); let r = Math.random()*total; for (let i=0;i<items.length;i++){ r -= weights[i]; if (r<=0) return items[i]; } return items[items.length-1]; };
export const caseId = () => `${rand(['MR','EMR','PT'])}-${randInt(10000,99999)}`;
export const shuffle = (arr) => { const a=[...arr]; for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
