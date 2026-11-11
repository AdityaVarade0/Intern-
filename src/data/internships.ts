import { Internship, RoleCategory } from '../types';

export const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'ind-001',
    title: 'Software Development Engineer (SDE) Intern — Backend & Payments',
    company: 'Razorpay Payments',
    companyDescription: 'India’s premier payment gateway and neobanking infrastructure powering over 10 million Indian businesses and UPI transactions.',
    location: 'Koramangala, Bengaluru (Hybrid)',
    city: 'Bengaluru',
    workType: 'Hybrid',
    category: 'Software Engineering (SDE)',
    stipend: '₹80,000 / month',
    stipendNumeric: 80000,
    duration: '2-3 Months (Summer 2026)',
    term: 'Summer 2026',
    deadline: 'April 30, 2026',
    educationRequirement: 'B.Tech CSE / IT / ECE',
    applicantsCount: 230,
    ppoConversionRate: '92% PPO Rate (₹26 LPA New Grad CTC)',
    mentor: {
      name: 'Aditi Narang',
      title: 'Principal Architect (ex-Paytm, Flipkart)',
      avatarInitials: 'AN'
    },
    description: 'Work directly on high-throughput payment routing engines, webhooks delivery microservices, and automated reconciliation systems processing millions of daily UPI transactions in Go and Java.',
    responsibilities: [
      'Build resilient RESTful and gRPC microservices with sub-50ms latency requirements.',
      'Optimize database queries on PostgreSQL and Redis caching layers for high concurrent traffic spikes.',
      'Implement automated unit and integration tests complying with RBI payment security standards.',
      'Participate in sprint demos and architectural review boards with senior engineering managers.'
    ],
    requiredSkills: ['Data Structures & Algorithms', 'Go or Java or Node.js', 'PostgreSQL / SQL', 'Git'],
    preferredSkills: ['Kafka', 'Docker', 'Redis', 'Distributed Systems basics'],
    perks: ['Pre-Placement Offer (PPO) Pathway', 'Bengaluru Relocation / Accommodation Assistance', 'Free Gourmet Meals & Snacks', 'M3 MacBook Pro'],
    featured: true,
    postedDate: '2 days ago'
  },
  {
    id: 'ind-002',
    title: 'Applied AI & Generative Model Research Intern',
    company: 'Jio AI Center of Excellence',
    companyDescription: 'Pioneering Indic language foundation models, multi-modal reasoning engines, and edge-AI systems for 450+ million digital citizens.',
    location: 'Hitec City, Hyderabad (or Navi Mumbai)',
    city: 'Hyderabad',
    workType: 'Hybrid',
    category: 'AI & Machine Learning',
    stipend: '₹1,00,000 / month',
    stipendNumeric: 100000,
    duration: '3 Months (Summer 2026)',
    term: 'Summer 2026',
    deadline: 'May 15, 2026',
    educationRequirement: 'Dual Degree / M.Tech',
    applicantsCount: 310,
    ppoConversionRate: '90% PPO Rate (₹32 LPA Full-time)',
    mentor: {
      name: 'Dr. S. K. Venkataraman',
      title: 'Chief AI Research Scientist',
      avatarInitials: 'SV'
    },
    description: 'Train and evaluate Indic multilingual LLMs, fine-tune open-weights models for high-accuracy reasoning in Hindi, Tamil, Telugu, and Marathi, and optimize tokenizers for efficient edge inference.',
    responsibilities: [
      'Experiment with quantization techniques (LoRA, QLoRA) on large transformer models.',
      'Benchmark hallucination detection algorithms across Indian regional linguistic corpora.',
      'Collaborate with speech recognition teams on multi-dialect whisper fine-tuning.',
      'Co-author research publications and present at internal AI symposiums.'
    ],
    requiredSkills: ['Python', 'PyTorch', 'Transformers / Hugging Face', 'Linear Algebra & Statistics'],
    preferredSkills: ['CUDA', 'LangChain / LlamaIndex', 'FastAPI', 'Indic NLP experience'],
    perks: ['NVIDIA H100 Cluster Compute Access', 'Direct Research Paper Authorship', 'Corporate Housing in Hyderabad', 'Full Medical Coverage'],
    featured: true,
    postedDate: 'Yesterday'
  },
  {
    id: 'ind-003',
    title: 'Product Design (UI/UX) Intern — Mobile & Interaction',
    company: 'CRED Design Studio',
    companyDescription: 'Award-winning design-first fintech platform redefining financial transparency, rewards, and delightful micro-interactions for creditworthy members.',
    location: 'Indiranagar, Bengaluru',
    city: 'Bengaluru',
    workType: 'On-site',
    category: 'Product Design (UI/UX)',
    stipend: '₹70,000 / month',
    stipendNumeric: 70000,
    duration: '2-3 Months',
    term: 'Summer 2026',
    deadline: 'May 5, 2026',
    educationRequirement: 'B.Des / M.Des',
    applicantsCount: 145,
    ppoConversionRate: '82% PPO Rate (₹20 LPA Full-time)',
    mentor: {
      name: 'Nikhil Kashyap',
      title: 'Head of Visual Systems & Motion',
      avatarInitials: 'NK'
    },
    description: 'Collaborate with world-class product designers crafting tactile, haptic-rich mobile interfaces, interactive animation prototypes, and design tokens for the CRED Android and iOS apps.',
    responsibilities: [
      'Design high-fidelity user journeys, wireframes, and component variants in Figma.',
      'Conduct usability tests with real Indian power users across Tier-1 and Tier-2 cities.',
      'Prototype smooth 60fps micro-interactions using Principle, Protopie, or Framer.',
      'Collaborate with frontend engineers to ensure pixel-perfect production implementation.'
    ],
    requiredSkills: ['Figma', 'UI/UX Principles', 'Mobile App Prototyping', 'Visual Hierarchy & Typography'],
    preferredSkills: ['Framer or Protopie', 'Motion Design', 'Design Systems Tokens', 'Accessibility'],
    perks: ['Modern Indiranagar Design Studio', 'Curated Design Book Library', 'Apple Ecosystem Hardware', 'Mentorship from India’s Top Designers'],
    featured: true,
    postedDate: '3 days ago'
  },
  {
    id: 'ind-004',
    title: 'Software Development Engineer (SDE) Intern — Distributed Core',
    company: 'Swiggy Labs',
    companyDescription: 'India’s leading convenience delivery platform serving 500+ Indian cities with instant grocery delivery, restaurant dining, and quick commerce.',
    location: 'Bellandur, Bengaluru',
    city: 'Bengaluru',
    workType: 'Hybrid',
    category: 'Software Engineering (SDE)',
    stipend: '₹75,000 / month',
    stipendNumeric: 75000,
    duration: '2-3 Months (Summer 2026)',
    term: 'Summer 2026',
    deadline: 'May 10, 2026',
    educationRequirement: 'B.Tech / B.E. (All Branches)',
    applicantsCount: 290,
    ppoConversionRate: '88% PPO Rate (₹25 LPA Full-time)',
    mentor: {
      name: 'Pradeep Kulkarni',
      title: 'Senior Engineering Manager (Logistics)',
      avatarInitials: 'PK'
    },
    description: 'Build hyper-local routing algorithms, live order batching engines, and high-availability customer-facing APIs handling over 2 million peak orders per day.',
    responsibilities: [
      'Develop backend services in Java/Spring Boot and Golang with high concurrency guarantees.',
      'Build real-time GPS telemetry ingestion queues using Apache Kafka and Apache Spark.',
      'Improve automated build times by 20% using modernized Docker and CI/CD pipelines.',
      'Analyze production logs in Grafana and Datadog to resolve performance bottlenecks.'
    ],
    requiredSkills: ['Data Structures & Algorithms (LeetCode/Codeforces)', 'Java or Golang', 'SQL / Relational DBs', 'Operating Systems & Concurrency'],
    preferredSkills: ['Kafka', 'Docker & Kubernetes', 'AWS (EC2, S3, RDS)', 'Redis'],
    perks: ['Swiggy One VIP Access + Daily Meal Allowance', 'Fast-Track Pre-Placement Offer (PPO)', 'Mentorship Program', 'Cab & Shuttle Facility'],
    featured: false,
    postedDate: '4 days ago'
  },
  {
    id: 'ind-005',
    title: 'Data Science & Quantitative Analytics Intern',
    company: 'Groww Financial',
    companyDescription: 'India’s fastest-growing investing platform empowering over 10 million Indians with mutual funds, stocks, IPOs, and digital gold.',
    location: 'Outer Ring Road, Bengaluru',
    city: 'Bengaluru',
    workType: 'Hybrid',
    category: 'Fintech & Quant Research',
    stipend: '₹65,000 / month',
    stipendNumeric: 65000,
    duration: '3 Months (or 6-Month Semester)',
    term: 'Summer 2026',
    deadline: 'May 20, 2026',
    educationRequirement: 'B.Tech / B.E. (All Branches)',
    applicantsCount: 185,
    ppoConversionRate: '85% PPO Rate (₹22 LPA Full-time)',
    mentor: {
      name: 'Varun Singhania',
      title: 'Director of Quantitative Analytics',
      avatarInitials: 'VS'
    },
    description: 'Analyze order flow anomalies, develop churn prediction models, and build algorithmic portfolio rebalancing simulations for Indian retail equity investors.',
    responsibilities: [
      'Clean and process millions of equity tick records using Python (Pandas, Polars, NumPy).',
      'Engineer features for user risk-profiling and fraud detection in real-time.',
      'Create executive KPI dashboards using SQL and Metabase / Tableau.',
      'Backtest algorithmic asset allocation strategies over 15 years of NSE and BSE data.'
    ],
    requiredSkills: ['Python (Pandas, NumPy, Scikit-learn)', 'Advanced SQL', 'Probability & Statistics', 'Data Visualization'],
    preferredSkills: ['Financial Markets Basics (NSE, BSE, SEBI guidelines)', 'Apache Spark', 'A/B Testing'],
    perks: ['Relocation Allowance to Bengaluru', 'Mentorship from Quant Leaders', 'Health Insurance', 'PPO Opportunity'],
    featured: true,
    postedDate: '3 days ago'
  },
  {
    id: 'ind-006',
    title: 'Mobile Engineering (Android/Kotlin) Intern',
    company: 'PhonePe',
    companyDescription: 'India’s largest UPI payments and digital commerce platform processing 45%+ of all digital transactions across the nation.',
    location: 'Hinjewadi, Pune (or Bengaluru)',
    city: 'Pune',
    workType: 'Hybrid',
    category: 'Software Engineering (SDE)',
    stipend: '₹85,000 / month',
    stipendNumeric: 85000,
    duration: '2-3 Months (Summer 2026)',
    term: 'Summer 2026',
    deadline: 'April 28, 2026',
    educationRequirement: 'B.Tech CSE / IT / ECE',
    applicantsCount: 260,
    ppoConversionRate: '91% PPO Rate (₹28 LPA Full-time)',
    mentor: {
      name: 'Tanvi Shinde',
      title: 'Lead Android Architect',
      avatarInitials: 'TS'
    },
    description: 'Work on one of India’s most critical consumer apps. Implement lightweight offline-first capabilities, Jetpack Compose UI primitives, and ultra-secure biometric authentication flows.',
    responsibilities: [
      'Develop modern Android components using Kotlin, Jetpack Compose, and Coroutines.',
      'Optimize app cold-start launch times across diverse budget Indian smartphones.',
      'Ensure zero crashes and 99.99% transaction reliability in network-constrained environments.',
      'Write comprehensive unit tests with JUnit and MockK.'
    ],
    requiredSkills: ['Kotlin or Java', 'Android SDK Basics / Jetpack Compose', 'Data Structures & Algorithms', 'Git'],
    preferredSkills: ['Coroutines & Flow', 'Dagger Hilt', 'Network Optimization', 'Security / Cryptography'],
    perks: ['Competitive Stipend + Corporate Accommodation', 'Direct Return Offer Review', 'Flexible Work Culture', 'Medical Coverage'],
    featured: false,
    postedDate: '5 days ago'
  },
  {
    id: 'ind-007',
    title: 'Associate Product Manager (APM) Intern',
    company: 'Zomato / Blinkit',
    companyDescription: 'Pioneering 10-minute quick commerce, dining discovery, and supply chain logistics for millions of Indian households.',
    location: 'Cyber City, Gurugram (NCR)',
    city: 'Gurugram',
    workType: 'Hybrid',
    category: 'Product Management (APM)',
    stipend: '₹75,000 / month',
    stipendNumeric: 75000,
    duration: '2-3 Months',
    term: 'Summer 2026',
    deadline: 'May 18, 2026',
    educationRequirement: 'All Students',
    applicantsCount: 210,
    ppoConversionRate: '84% PPO Rate (₹24 LPA Full-time)',
    mentor: {
      name: 'Karan Bedi',
      title: 'VP of Quick Commerce Product',
      avatarInitials: 'KB'
    },
    description: 'Own a key feature track from customer problem discovery to PRD release. Work alongside engineers and operations teams to optimize dark store picking times and delivery partner experiences.',
    responsibilities: [
      'Author structured PRDs with clear user stories and success metrics.',
      'Analyze app funnel telemetry using SQL and Amplitude to reduce checkout drop-offs.',
      'Conduct on-ground interviews with delivery partners and warehouse store managers.',
      'Present capstone launch proposal directly to Zomato leadership.'
    ],
    requiredSkills: ['Structured Problem Solving', 'SQL / Data Querying', 'User Empathy', 'Clear Written Communication'],
    preferredSkills: ['Figma Basics', 'A/B Experimentation', 'Indian E-Commerce Context'],
    perks: ['Gurugram Cyber City Office Access', 'PPO Fast-Track', 'Unlimited Meals & Dining Vouchers', 'Leadership Mentorship'],
    featured: false,
    postedDate: '1 week ago'
  },
  {
    id: 'ind-008',
    title: 'Developer Infrastructure & Open Source Intern',
    company: 'Postman API Lab',
    companyDescription: 'The world’s leading API platform used by 30+ million developers and 500,000 organizations, proudly founded in India.',
    location: 'Indiranagar, Bengaluru (or Remote Pan-India)',
    city: 'Remote (Pan-India)',
    workType: 'Remote (Pan-India)',
    category: 'Software Engineering (SDE)',
    stipend: '₹70,000 / month',
    stipendNumeric: 70000,
    duration: '3 Months (Summer 2026)',
    term: 'Summer 2026',
    deadline: 'May 25, 2026',
    educationRequirement: 'All Students',
    applicantsCount: 195,
    ppoConversionRate: '86% PPO Rate (₹25 LPA Full-time)',
    mentor: {
      name: 'Rishi Bansal',
      title: 'Staff Open Source Engineer',
      avatarInitials: 'RB'
    },
    description: 'Contribute to developer-facing command line tools, TypeScript SDKs, and open-source API specifications. Build high-performance parser utilities and VS Code extensions.',
    responsibilities: [
      'Write clean, accessible TypeScript and Node.js tools with zero external security vulnerabilities.',
      'Optimize CLI execution speed for large OpenAPI and AsyncAPI schema definitions.',
      'Triage GitHub issues and review community open-source pull requests.',
      'Publish developer tutorial guides and technical blog posts.'
    ],
    requiredSkills: ['TypeScript / JavaScript', 'Node.js', 'Git / GitHub', 'REST & GraphQL APIs'],
    preferredSkills: ['Rust basics', 'CLI tooling', 'Open Source Contributions', 'Automated Testing (Vitest/Jest)'],
    perks: ['100% Remote Flexibility Across Any Indian City', 'Home Office Setup Grant (₹35,000)', 'Wellness & Learning Budget', 'PPO Track'],
    featured: true,
    postedDate: '3 days ago'
  }
];

export const CATEGORIES: RoleCategory[] = [
  'Software Engineering (SDE)',
  'AI & Machine Learning',
  'Product Design (UI/UX)',
  'Product Management (APM)',
  'Data Science & Analytics',
  'Cloud & DevOps Engineering',
  'Fintech & Quant Research',
  'Growth & Marketing'
];

export const INDIAN_CITIES = [
  'All Cities',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Gurugram',
  'Mumbai',
  'Chennai',
  'Remote (Pan-India)'
];
