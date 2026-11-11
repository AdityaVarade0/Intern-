import { StudentProfile } from '../types';

export const SAMPLE_PROFILES: { label: string; profile: StudentProfile }[] = [
  {
    label: 'Aditya Sharma (B.Tech CSE · BITS Pilani · SDE & AI)',
    profile: {
      fullName: 'Aditya Sharma',
      email: 'aditya.sharma@pilani.bits-pilani.ac.in',
      phone: '+91 98201 44521',
      university: 'BITS Pilani',
      degree: 'B.Tech in Computer Science and Engineering',
      major: 'Computer Science & Engineering',
      graduationYear: '2027',
      cgpa: '8.84 / 10 CGPA',
      currentCity: 'Bengaluru / Pilani',
      workPreference: 'Any',
      targetRoles: ['Software Engineering (SDE)', 'AI & Machine Learning'],
      skills: ['TypeScript', 'React', 'Java', 'Python', 'C++', 'Node.js', 'PostgreSQL', 'Data Structures & Algorithms', 'Git', 'Docker basics'],
      bio: 'Pre-final year B.Tech student passionate about building scalable web applications and high-throughput backend services. Solved 400+ LeetCode problems (Knight rating 1890) and active open-source contributor.',
      projects: [
        {
          title: 'SplitPay UPI — Peer Expense & Splitter',
          description: 'Full-stack web application with React 19, Node.js, and PostgreSQL for real-time group expense splitting with automated UPI QR code generation and SMS reminders.',
          technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'UPI Deep-linking'],
          link: 'https://github.com/adityasharma/splitpay-upi'
        },
        {
          title: 'IndicOCR Document Parser',
          description: 'Built a lightweight document OCR parser fine-tuned on Hindi and English invoice templates with 94.2% entity extraction accuracy using PyTorch and FastAPI.',
          technologies: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'OpenCV']
        }
      ],
      experience: [
        {
          role: 'Backend Engineering Intern',
          company: 'Happenstance Mobility (Bengaluru)',
          duration: 'May 2025 – July 2025',
          highlights: 'Optimized driver location telemetry microservices using Redis caching and PostgreSQL indices, reducing peak API p99 latency from 180ms to 42ms.'
        }
      ],
      hackathonsOrAwards: [
        'Winner — Smart India Hackathon (SIH 2024)',
        'Rank 48 out of 3,200 teams in Devfolio InOut 9.0'
      ],
      resumeText: `ADITYA SHARMA
Bengaluru, India | aditya.sharma@pilani.bits-pilani.ac.in | +91 98201 44521 | github.com/adityasharma | leetcode.com/aditya_codes

EDUCATION
BITS Pilani — Bachelor of Technology (B.Tech) in Computer Science & Engineering (2023 - 2027)
CGPA: 8.84 / 10.0 | Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Object-Oriented Programming, Computer Networks.

TECHNICAL PROFICIENCIES
Languages: C++, Java, TypeScript, Python, SQL, Go (basic)
Frameworks & Libraries: React, Node.js, Express, Spring Boot, PyTorch, Tailwind CSS
Databases & Cloud: PostgreSQL, MySQL, Redis, MongoDB, Docker, Git, AWS (S3, EC2)
Competitive Programming: LeetCode Knight (Rating 1890+, 400+ solved), Codeforces Specialist (Rating 1450)

KEY PROJECTS
SplitPay UPI: Developed a full-stack expense-splitting web app with deep-linked UPI QR codes. Implemented graph-based debt simplification reducing transaction edges by 45%.
IndicOCR Parser: Fine-tuned multi-lingual layout transformer on bilingual Indian tax receipts; served inference via FastAPI with sub-100ms response.

EXPERIENCE
Backend Engineering Intern — Happenstance Mobility, Bengaluru (May - July 2025)
- Designed resilient Redis caching pipeline for vehicle tracking, supporting 15,000 requests/minute.
- Built automated regression suites with JUnit and Mockito achieving 88% test coverage.`
    }
  },
  {
    label: 'Pooja Iyer (B.Des · IDC IIT Bombay · UI/UX Design)',
    profile: {
      fullName: 'Pooja Iyer',
      email: 'pooja.iyer@iitb.ac.in',
      phone: '+91 99302 77103',
      university: 'IDC School of Design, IIT Bombay',
      degree: 'B.Des in Interaction Design',
      major: 'Interaction Design & Human-Computer Interaction',
      graduationYear: '2026',
      cgpa: '9.15 / 10 CGPA',
      currentCity: 'Mumbai, Maharashtra',
      workPreference: 'Hybrid',
      targetRoles: ['Product Design (UI/UX)', 'Product Management (APM)'],
      skills: ['Figma', 'User Research', 'Design Systems', 'Interactive Prototyping', 'Vernacular Hindi/Tamil UI', 'Wireframing', 'Usability Testing', 'Information Architecture'],
      bio: 'Final-year interaction design student passionate about crafting respectful, high-utility digital products for the next 500 million Indian smartphone users. Focused on vernacular design, tactile micro-interactions, and accessible typography.',
      projects: [
        {
          title: 'GraminPay — Vernacular Voice & Touch Banking',
          description: 'Designed a voice-first simplified micro-banking mobile interface for rural Indian cooperative bank account holders across Maharashtra and Tamil Nadu.',
          technologies: ['Figma', 'Voice UI', 'User Research', 'Field Usability Testing', 'Prototyping'],
          link: 'https://www.poojaiyer.design/graminpay'
        },
        {
          title: 'IndicDesign Token Kit',
          description: 'A multi-language typography and color token system ensuring WCAG AAA legibility for Devanagari, Gurmukhi, and Tamil scripts.',
          technologies: ['Figma Variables', 'Design Tokens', 'Typography Specs']
        }
      ],
      experience: [
        {
          role: 'Product Design Intern',
          company: 'FinSetu Bharat (Bengaluru)',
          duration: 'May 2025 – July 2025',
          highlights: 'Redesigned merchant onboarding KYC flow, reducing drop-off rates from 34% to 19% across 12,000 Kirana store onboardings.'
        }
      ],
      hackathonsOrAwards: [
        'National Design Excellence Award (CII India Design Summit 2024)',
        'Best UX Research Paper — IndiaHCI Conference'
      ],
      resumeText: `POOJA IYER
Mumbai / Bengaluru | pooja.iyer@iitb.ac.in | +91 99302 77103 | portfolio: poojaiyer.design

EDUCATION
Industrial Design Centre (IDC), IIT Bombay — Bachelor of Design (B.Des) in Interaction Design | CGPA: 9.15 / 10 (2022 - 2026)

DESIGN & RESEARCH SKILLS
Figma, FigJam, Protopie, Framer, User Empathy Interviews, Card Sorting, Usability Testing, Vernacular UI, WCAG 2.1 AA Accessibility, Design Systems, Information Architecture.`
    }
  },
  {
    label: 'Rohan Mehta (Dual Degree · IIT Delhi · Quant & Data)',
    profile: {
      fullName: 'Rohan Mehta',
      email: 'rohan.mehta@cse.iitd.ac.in',
      phone: '+91 97110 55420',
      university: 'IIT Delhi',
      degree: 'B.Tech + M.Tech Dual Degree in Mathematics and Computing',
      major: 'Mathematics, Computing & Data Science',
      graduationYear: '2027',
      cgpa: '9.02 / 10 CGPA',
      currentCity: 'New Delhi / Gurugram',
      workPreference: 'Hybrid',
      targetRoles: ['Fintech & Quant Research', 'Data Science & Analytics', 'Software Engineering (SDE)'],
      skills: ['Python (NumPy, Pandas, SciPy)', 'C++', 'SQL', 'Financial Mathematics', 'Stochastic Calculus', 'Time Series Modeling', 'Machine Learning', 'Tableau'],
      bio: 'Mathematics and Computing dual-degree student with strong fundamentals in statistical modeling, algorithmic execution, and high-performance computing. Seeking quantitative research or algorithmic trading internships.',
      projects: [
        {
          title: 'NSE Tick Analytics & Arbitrage Simulator',
          description: 'High-frequency order-book simulator in C++ and Python testing triangular arbitrage and statistical pairs trading across NIFTY 50 equities.',
          technologies: ['C++', 'Python', 'Pandas', 'Order Book Reconstruction', 'Backtesting']
        }
      ],
      experience: [
        {
          role: 'Quantitative Research Intern',
          company: 'AlphaMetrics Capital (Gurugram)',
          duration: 'May 2025 – July 2025',
          highlights: 'Built automated factor risk decomposition pipeline analyzing volatility smiles across NIFTY index options contracts.'
        }
      ],
      hackathonsOrAwards: [
        'JEE Advanced Rank: All India Rank (AIR) 246',
        'KVPY Fellowship Scholar'
      ],
      resumeText: `ROHAN MEHTA
New Delhi, India | rohan.mehta@cse.iitd.ac.in | +91 97110 55420

EDUCATION
Indian Institute of Technology (IIT) Delhi — Integrated B.Tech + M.Tech in Mathematics & Computing (2022 - 2027) | CGPA: 9.02 / 10.0
JEE Advanced AIR 246 (out of 180,000+ candidates)

TECHNICAL & QUANT SKILLS
Languages: C++, Python, SQL, R, MATLAB
Mathematical Modeling: Linear Algebra, Probability & Random Processes, Stochastic Calculus, Numerical Optimization, Time Series Econometrics.`
    }
  }
];
