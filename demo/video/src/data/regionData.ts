export const regionRevenue = [
  { label: 'Northeast', value: 50000000, branches: 69, highlight: true },
  { label: 'Southeast', value: 6000000, branches: 32, highlight: false },
  { label: 'Other', value: 450000, branches: 3, highlight: false },
];

export const formatRevenue = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};
