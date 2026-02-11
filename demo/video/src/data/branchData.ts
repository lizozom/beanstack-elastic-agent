export const underperformingBranches = [
  {
    name: 'BeanStack Davis Philadelphia',
    revenue: '$280K',
    satisfaction: '3.1',
    equipmentIssues: '12',
    keyIssue: 'Equipment failures',
  },
  {
    name: 'BeanStack Angel New York',
    revenue: '$310K',
    satisfaction: '3.4',
    equipmentIssues: '9',
    keyIssue: 'Chronic equipment problems',
  },
  {
    name: 'BeanStack Downtown Charlotte',
    revenue: '$295K',
    satisfaction: '3.2',
    equipmentIssues: '8',
    keyIssue: 'Maintenance issues',
  },
];

export const reportFragments = {
  tikTok: {
    from: 'brian.ramirez@beanstack.com',
    subject: 'Weekly Report — Sep 14',
    body: 'Wild week. One of the baristas went viral on TikTok — latte art video hit 2M views. By Wednesday we had tourists lining up before open. Revenue is through the roof but we need more staff ASAP.',
    highlight: 'viral on TikTok',
  },
  financial: {
    from: 'Q3 2025 Financial Report',
    subject: 'BeanStack Uptown New York',
    body: 'Revenue: $960K (+42% QoQ). Transaction count: 24,100. Customer satisfaction: 4.8. Notes: Significant foot traffic increase driven by social media exposure.',
    highlight: '$960K',
  },
  fire: {
    from: 'sarah.chen@beanstack.com',
    subject: 'Emergency — Equipment Fire #3',
    body: 'Third equipment fire this year. Espresso machine #1 caught fire during morning rush. Fire dept called. Branch closed for 2 days. Insurance claim filed. We desperately need full equipment replacement.',
    highlight: '3 equipment fires',
  },
  walkout: {
    from: 'james.wright@beanstack.com',
    subject: 'Staff Situation — Urgent',
    body: 'Half the team walked out today after the AC broke down again. It\'s been 95+ degrees inside for a week. Three customers complained to corporate. We\'re running on a skeleton crew.',
    highlight: 'staff walkout',
  },
};

export const workflowSteps = {
  sendEmail: [
    { icon: '🔍', label: 'Looking up branch staff...', detail: '' },
    { icon: '👤', label: 'Found: Brian Ramirez (Manager)', detail: '' },
    { icon: '✉️', label: 'Composing email...', detail: '' },
    { icon: '📤', label: 'Sending to brian.ramirez@beanstack.com', detail: '' },
    { icon: '✅', label: 'Email sent successfully', detail: '' },
    { icon: '💾', label: 'Logged to Elasticsearch', detail: '' },
  ],
  escalation: [
    { icon: '🔍', label: 'Looking up BeanStack Davis Philadelphia...', detail: '' },
    { icon: '📝', label: 'Composing case description from reports & financials...', detail: '' },
    { icon: '📋', label: 'Creating Kibana case: #ESC-2025-0847', detail: '' },
    { icon: '✉️', label: 'Emailing manager: sarah.chen@beanstack.com', detail: '' },
    { icon: '💾', label: 'Writing audit log entry...', detail: '' },
    { icon: '✅', label: 'All actions completed', detail: '' },
  ],
};

// Pins concentrated in Northeast and Southeast, fewer elsewhere
export const mapPins = [
  // === NORTHEAST (dense cluster — ~18 pins) ===
  { lat: 40.7128, lon: -74.006, label: 'NYC Downtown' },
  { lat: 40.758, lon: -73.985, label: 'NYC Midtown' },
  { lat: 40.7831, lon: -73.9712, label: 'NYC Upper East' },
  { lat: 40.6892, lon: -73.9857, label: 'NYC Brooklyn' },
  { lat: 40.7282, lon: -73.7949, label: 'NYC Queens' },
  { lat: 42.3601, lon: -71.0589, label: 'Boston' },
  { lat: 42.3751, lon: -71.1056, label: 'Boston Cambridge' },
  { lat: 39.9526, lon: -75.1652, label: 'Philadelphia' },
  { lat: 39.9848, lon: -75.1279, label: 'Philadelphia North' },
  { lat: 38.9072, lon: -77.0369, label: 'DC' },
  { lat: 40.2732, lon: -76.8867, label: 'Harrisburg' },
  { lat: 42.1015, lon: -72.5898, label: 'Springfield MA' },
  { lat: 43.6591, lon: -70.2568, label: 'Portland ME' },
  { lat: 41.3083, lon: -72.9279, label: 'New Haven' },
  { lat: 38.8816, lon: -77.0910, label: 'DC Arlington' },
  { lat: 40.4406, lon: -79.9959, label: 'Pittsburgh' },
  { lat: 41.7658, lon: -72.6734, label: 'Hartford' },

  // === SOUTHEAST (dense cluster — ~16 pins) ===
  { lat: 33.749, lon: -84.388, label: 'Atlanta' },
  { lat: 33.789, lon: -84.326, label: 'Atlanta Buckhead' },
  { lat: 25.7617, lon: -80.1918, label: 'Miami' },
  { lat: 26.1224, lon: -80.1373, label: 'Fort Lauderdale' },
  { lat: 28.5383, lon: -81.3792, label: 'Orlando' },
  { lat: 27.9506, lon: -82.4572, label: 'Tampa' },
  { lat: 30.3322, lon: -81.6557, label: 'Jacksonville' },
  { lat: 35.2271, lon: -80.8431, label: 'Charlotte' },
  { lat: 35.7796, lon: -78.6382, label: 'Raleigh' },
  { lat: 36.1627, lon: -86.7816, label: 'Nashville' },
  { lat: 36.1745, lon: -86.7680, label: 'Nashville East' },
  { lat: 32.7767, lon: -96.797, label: 'Dallas' },
  { lat: 29.7604, lon: -95.3698, label: 'Houston' },
  { lat: 30.2672, lon: -97.7431, label: 'Austin' },
  { lat: 32.3547, lon: -86.2662, label: 'Montgomery' },
  { lat: 34.7465, lon: -92.2896, label: 'Little Rock' },

  // === MIDWEST (sparse — ~6 pins) ===
  { lat: 41.8781, lon: -87.6298, label: 'Chicago' },
  { lat: 42.3314, lon: -83.0458, label: 'Detroit' },
  { lat: 44.9778, lon: -93.265, label: 'Minneapolis' },
  { lat: 39.7684, lon: -86.1581, label: 'Indianapolis' },
  { lat: 38.2527, lon: -85.7585, label: 'Louisville' },
  { lat: 43.0389, lon: -87.9065, label: 'Milwaukee' },

  // === WEST (sparse — ~6 pins) ===
  { lat: 34.0522, lon: -118.2437, label: 'LA' },
  { lat: 37.7749, lon: -122.4194, label: 'SF' },
  { lat: 47.6062, lon: -122.3321, label: 'Seattle' },
  { lat: 45.5152, lon: -122.6784, label: 'Portland' },
  { lat: 39.7392, lon: -104.9903, label: 'Denver' },
  { lat: 33.4484, lon: -112.074, label: 'Phoenix' },
];
