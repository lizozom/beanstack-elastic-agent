export const regionRevenue = [
  { label: 'Northeast', value: 12400000, branches: 26, highlight: true },
  { label: 'West', value: 11600000, branches: 29, highlight: false },
  { label: 'Southwest', value: 9100000, branches: 24, highlight: false },
  { label: 'Southeast', value: 7800000, branches: 17, highlight: false },
  { label: 'Midwest', value: 6200000, branches: 16, highlight: false },
];

export const formatRevenue = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};
