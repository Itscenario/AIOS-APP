export const formatProfileName = (name: string): string => {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  const title = cleaned.match(/^(Dr\.?|Prof\.?)\s+/i)?.[1];
  if (!title) return cleaned;
  const personName = cleaned.replace(/\b(?:Dr|Prof)\.?\b\.?/gi, '').trim().replace(/\s+/g, ' ');
  const prefix = /^dr/i.test(title) ? 'Dr.' : 'Prof.';
  return [prefix, personName].filter(Boolean).join(' ');
};
