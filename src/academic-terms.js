/** Policy-aware academic-term helpers shared by the app and regression tests. */
export function getAcademicTermOptionsForPolicy(schoolYear, resolvePolicy, defaultSchoolYear = '2026-2027') {
  const year = String(schoolYear || defaultSchoolYear);
  if (typeof resolvePolicy === 'function') {
    try {
      const policy = resolvePolicy(year);
      if (policy && Array.isArray(policy.terms) && policy.terms.length) return policy.terms.slice();
    } catch (_) { /* use deterministic fallback below */ }
  }
  return year >= '2026-2027'
    ? ['Term 1', 'Term 2', 'Term 3']
    : ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];
}

export function normalizeAcademicTermForPolicy(value, schoolYear, resolvePolicy, defaultSchoolYear = '2026-2027') {
  const options = getAcademicTermOptionsForPolicy(schoolYear, resolvePolicy, defaultSchoolYear);
  const raw = String(value == null ? '' : value).trim();
  if (options.includes(raw)) return raw;
  const numeric = raw.match(/(?:term|quarter)\s*([1-4])/i);
  const words = raw.match(/\b(first|second|third|fourth)\s+quarter\b/i);
  const index = numeric ? Number(numeric[1]) : words
    ? ({ first: 1, second: 2, third: 3, fourth: 4 }[words[1].toLowerCase()]) : 0;
  if (index >= 1) return options[Math.min(index, options.length) - 1];
  return options[0];
}
