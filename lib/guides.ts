export interface Question {
  id: string
  title: string
  content: string
}

export interface Guide {
  slug: string
  title: string
  emoji: string
  description: string
  questionCount: number
  topics: string[]
  questions: Question[]
}

// Hardcoded guides for static generation
export const guides: Guide[] = [
  {
    slug: 'ea-sre-3',
    title: 'EA SRE 3 Visual Interview Prep',
    emoji: '🚀',
    description: '185+ questions covering AWS, gaming, and SRE topics',
    questionCount: 185,
    topics: ['AWS', 'Gaming', 'SRE', 'Load Balancing', 'Chaos Engineering'],
    questions: [],
  },
  {
    slug: 'terraform',
    title: 'Terraform Visual Interview Prep',
    emoji: '🏗️',
    description: '150+ questions covering Terraform fundamentals to expert',
    questionCount: 150,
    topics: ['IaC', 'State Management', 'Modules', 'Providers', 'Enterprise'],
    questions: [],
  },
  {
    slug: 'kubernetes',
    title: 'Kubernetes Visual Interview Prep',
    emoji: '☸️',
    description: '150+ questions covering K8s basics to advanced',
    questionCount: 150,
    topics: ['Containers', 'Orchestration', 'Networking', 'Storage', 'Security'],
    questions: [],
  },
  {
    slug: 'networking',
    title: 'Networking Visual Interview Prep',
    emoji: '🌐',
    description: 'Network fundamentals and advanced concepts',
    questionCount: 120,
    topics: ['TCP/IP', 'DNS', 'Load Balancing', 'Security', 'Protocols'],
    questions: [],
  },
  {
    slug: 'observability',
    title: 'Observability Visual Interview Prep',
    emoji: '📊',
    description: 'Monitoring, logging, and tracing concepts',
    questionCount: 100,
    topics: ['Monitoring', 'Logging', 'Tracing', 'Metrics', 'Alerting'],
    questions: [],
  },
  {
    slug: 'operating-system',
    title: 'Operating System Visual Interview Prep',
    emoji: '💻',
    description: 'OS concepts and system design',
    questionCount: 130,
    topics: ['Processes', 'Memory', 'Scheduling', 'File Systems', 'Concurrency'],
    questions: [],
  },
  {
    slug: 'python-devops',
    title: 'Python DevOps Visual Interview Prep',
    emoji: '🐍',
    description: 'Python for DevOps and automation',
    questionCount: 110,
    topics: ['Scripting', 'Automation', 'Libraries', 'Best Practices', 'Testing'],
    questions: [],
  },
  {
    slug: 'system-design',
    title: 'System Design Visual Interview Prep',
    emoji: '🎨',
    description: 'System design patterns and architecture',
    questionCount: 140,
    topics: ['Architecture', 'Scalability', 'Reliability', 'Patterns', 'Trade-offs'],
    questions: [],
  },
]

export function getAllGuides(): Guide[] {
  return guides
}

export function getGuideBySlug(slug: string): Guide | null {
  return guides.find(g => g.slug === slug) || null
}
