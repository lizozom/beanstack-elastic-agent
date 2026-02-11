export type ToolType = 'esql' | 'search' | 'workflow' | 'builtin';

export interface ToolRef {
  name: string;
  type: ToolType;
  label?: string;
}

export interface Conversation {
  prompt: string;
  tools: ToolRef[];
  response: string;
  highlights?: string[];
}

export const conversations: Record<string, Conversation> = {
  scene1: {
    prompt: 'Compare the performance of our branches by region in 2025',
    tools: [
      { name: 'revenue_by_region', type: 'esql', label: 'ES|QL' },
      { name: 'search_financial_reports', type: 'search', label: 'Index Search' },
    ],
    response:
      'Based on the analysis across all regions, the Northeast leads with $12.4M in revenue across 26 branches, followed by the West at $11.6M. BeanStack Uptown New York stands out significantly — $960K in Q3 alone, far above the regional average.',
  },
  scene2: {
    prompt: 'Why is BeanStack Uptown New York leading? What happened there?',
    tools: [
      { name: 'search_reports', type: 'search', label: 'Semantic Search' },
    ],
    response:
      'The performance spike at BeanStack Uptown New York traces back to a viral TikTok moment in September. A barista\'s latte art video went viral, attracting influencers and tourists. Foot traffic increased 3x and hasn\'t dropped since. Revenue hit $960K in Q3 2025 — the highest single-branch quarter in the chain.',
    highlights: ['viral on TikTok', '$960K'],
  },
  scene3: {
    prompt: 'Send him an email asking to schedule a meeting — mention a possible raise!',
    tools: [
      { name: 'staff_by_branch', type: 'esql', label: 'Lookup' },
      { name: 'send_manager_message', type: 'workflow', label: 'Workflow' },
    ],
    response:
      'Done! I\'ve sent an email to Brian Ramirez, Manager at BeanStack Uptown New York, requesting a meeting and mentioning the possibility of a raise based on the branch\'s outstanding performance.',
  },
  scene4: {
    prompt: 'Are there branches that consistently underperform? Why?',
    tools: [
      { name: 'underperforming_branches', type: 'esql', label: 'ES|QL' },
      { name: 'search_reports', type: 'search', label: 'Semantic Search' },
    ],
    response:
      'Three branches show persistent underperformance across revenue, customer satisfaction, and equipment metrics. The root causes vary — BeanStack Davis Philadelphia has had 3 equipment fires in 6 months, BeanStack Angel New York has chronic grinder malfunctions, and BeanStack Downtown Charlotte experienced a staff walkout after repeated AC failures.',
  },
  scene5: {
    prompt: 'Open a case about BeanStack Davis Philadelphia equipment failures and let the manager know we\'re on it',
    tools: [
      { name: 'escalation', type: 'workflow', label: 'Workflow' },
    ],
    response:
      'Escalation complete. Created Kibana case #ESC-2025-0847 with a description compiled from recent reports and financial data. Sent notification email to Sarah Chen (Manager, BeanStack Davis Philadelphia). All actions logged to the audit trail.',
  },
};
