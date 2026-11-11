export interface CourseOption {
  degreeCategory: string; // e.g., "Engineering (B.Tech / B.E.)"
  degrees: {
    name: string;
    branches: string[];
  }[];
}

export const INDIAN_ACADEMIC_COURSES: CourseOption[] = [
  {
    degreeCategory: 'Engineering & Technology (B.Tech / B.E. / M.Tech)',
    degrees: [
      {
        name: 'B.Tech / B.E. (Bachelor of Technology / Engineering)',
        branches: [
          'Computer Science & Engineering (CSE)',
          'Information Technology (IT)',
          'Artificial Intelligence & Machine Learning (AI & ML)',
          'Data Science & Analytics',
          'Electronics & Communication Engineering (ECE)',
          'Electrical & Electronics Engineering (EEE)',
          'Mechanical Engineering',
          'Civil Engineering',
          'Chemical Engineering',
          'Biotechnology & Bioinformatics',
          'Aerospace & Aeronautical Engineering',
          'Robotics & Automation',
          'Production & Industrial Engineering',
          'Other Engineering Branch'
        ]
      },
      {
        name: 'M.Tech / M.E. / Dual Degree (Integrated)',
        branches: [
          'Computer Science / Software Systems',
          'VLSI Design & Embedded Systems',
          'Artificial Intelligence & Robotics',
          'Power Systems & Control',
          'Thermal & Fluid Engineering',
          'Structural Engineering',
          'Data Analytics & Computational Science'
        ]
      }
    ]
  },
  {
    degreeCategory: 'Computer Applications & IT (BCA / MCA)',
    degrees: [
      {
        name: 'BCA (Bachelor of Computer Applications)',
        branches: [
          'General Computer Applications',
          'Cloud Computing & DevOps',
          'Web & Mobile App Development',
          'Data Science & Cyber Security'
        ]
      },
      {
        name: 'MCA (Master of Computer Applications)',
        branches: [
          'Software Engineering & Cloud Applications',
          'Full-Stack & Distributed Development',
          'AI & Big Data Computing'
        ]
      }
    ]
  },
  {
    degreeCategory: 'Design & Architecture (B.Des / M.Des / B.Arch)',
    degrees: [
      {
        name: 'B.Des / M.Des (Design)',
        branches: [
          'Interaction Design (UI/UX)',
          'Communication & Graphic Design',
          'Industrial & Product Design',
          'Animation & Game Design',
          'Fashion & Apparel Design'
        ]
      },
      {
        name: 'B.Arch (Architecture)',
        branches: [
          'Architecture & Urban Planning',
          'Interior Design & Spatial Systems'
        ]
      }
    ]
  },
  {
    degreeCategory: 'Science & Mathematics (B.Sc / M.Sc)',
    degrees: [
      {
        name: 'B.Sc / B.S. (Bachelor of Science)',
        branches: [
          'Mathematics & Computing',
          'Statistics & Data Analytics',
          'Computer Science',
          'Physics / Applied Physics',
          'Chemistry / Life Sciences',
          'Economics & Econometrics'
        ]
      },
      {
        name: 'M.Sc / MS (Master of Science)',
        branches: [
          'Data Science & Computing',
          'Applied Mathematics & Statistics',
          'Economics / Quantitative Finance'
        ]
      }
    ]
  },
  {
    degreeCategory: 'Management & Commerce (BBA / B.Com / MBA)',
    degrees: [
      {
        name: 'BBA / BMS (Business Administration)',
        branches: [
          'Finance & Fintech',
          'Marketing & Digital Growth',
          'Business Analytics & Data',
          'Operations & Supply Chain',
          'General Management'
        ]
      },
      {
        name: 'B.Com / B.Com (Hons)',
        branches: [
          'Accounting & Financial Analytics',
          'Banking & Insurance',
          'Corporate Taxation & Auditing'
        ]
      },
      {
        name: 'MBA / PGDM (Master of Business Administration)',
        branches: [
          'Product Management & IT Systems',
          'Financial Analytics & Investment Banking',
          'Growth Marketing & Strategy',
          'Operations & Logistics Management'
        ]
      }
    ]
  },
  {
    degreeCategory: 'Humanities, Law & Arts (BA / LLB)',
    degrees: [
      {
        name: 'BA (Bachelor of Arts)',
        branches: [
          'Journalism & Mass Communication',
          'English Literature & Content Writing',
          'Psychology & Behavioral Science',
          'Public Policy & Political Science'
        ]
      },
      {
        name: 'B.A. LL.B / B.B.A. LL.B (Law)',
        branches: [
          'Corporate & Tech Law / Intellectual Property',
          'Data Privacy & Cyber Law'
        ]
      }
    ]
  }
];

export const SUGGESTED_SKILLS_BY_BRANCH: Record<string, string[]> = {
  'Computer Science & Engineering (CSE)': [
    'Data Structures & Algorithms', 'Java', 'Python', 'C++', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'Docker'
  ],
  'Information Technology (IT)': [
    'Web Development', 'React', 'JavaScript', 'Python', 'SQL', 'Cloud (AWS/GCP)', 'API Integration', 'Linux'
  ],
  'Artificial Intelligence & Machine Learning (AI & ML)': [
    'Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'NLP', 'Computer Vision', 'Pandas & NumPy', 'FastAPI'
  ],
  'Electronics & Communication Engineering (ECE)': [
    'Embedded C/C++', 'Microcontrollers (ARM/ESP32)', 'IoT Protocols (MQTT)', 'MATLAB', 'VLSI/Verilog basics', 'Circuit Design'
  ],
  'Mechanical Engineering': [
    'AutoCAD', 'SolidWorks', 'ANSYS FEA', 'MATLAB', 'Python for Engineers', 'GD&T', 'Manufacturing Processes', 'Robotics Basics'
  ],
  'Civil Engineering': [
    'AutoCAD Civil 3D', 'STAAD.Pro', 'Revit BIM', 'Structural Analysis', 'Project Estimation', 'Surveying (GIS)'
  ],
  'Interaction Design (UI/UX)': [
    'Figma', 'User Research', 'Wireframing', 'Interactive Prototyping', 'Design Systems', 'Usability Testing', 'Information Architecture'
  ],
  'Finance & Fintech': [
    'Financial Modeling', 'Excel (Advanced/VBA)', 'Python for Finance', 'SQL', 'Valuation & DCF', 'PowerBI', 'Risk Management'
  ],
  'Default': [
    'Problem Solving', 'Data Analysis', 'Python', 'SQL', 'Communication', 'Project Management', 'Excel', 'Critical Thinking'
  ]
};

export const COMMON_INDIAN_UNIVERSITIES = [
  'BITS Pilani (Pilani, Goa, Hyderabad)',
  'IIT Bombay',
  'IIT Delhi',
  'IIT Madras',
  'IIT Kharagpur',
  'IIT Roorkee',
  'IIT Guwahati',
  'IIT Hyderabad',
  'IIIT Hyderabad',
  'IIIT Bangalore',
  'NIT Trichy',
  'NIT Surathkal',
  'NIT Warangal',
  'Delhi Technological University (DTU)',
  'Netaji Subhas University of Technology (NSUT)',
  'COEP Technological University, Pune',
  'Vellore Institute of Technology (VIT)',
  'Manipal Institute of Technology (MIT)',
  'Thapar Institute of Engineering & Technology',
  'RV College of Engineering (RVCE), Bengaluru',
  'BMS College of Engineering, Bengaluru',
  'PSG College of Technology, Coimbatore',
  'Jadavpur University, Kolkata',
  'Anna University, Chennai',
  'Mumbai University (VJTI / SPIT)',
  'Savitribai Phule Pune University (SPPU)',
  'Delhi University (DU)',
  'National Institute of Design (NID)',
  'IDC School of Design, IIT Bombay',
  'Symbiosis Institute of Design / Technology, Pune',
  'SRM Institute of Science and Technology',
  'Other University / Institute in India'
];
