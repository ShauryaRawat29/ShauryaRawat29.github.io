// Edit this file to re-label the entire site. Header, Footer, the homepage
// and SEO defaults all read from here instead of hardcoding copy.
export const SITE = {
  name: 'Shaurya Rawat',
  role: 'AI/ML Engineering — Applied ML, RAG & Security Tooling',
  email: 'shauryarawat29@gmail.com',
  phone: '+91-8368817060',
  location: 'Delhi, India',
  tagline: 'I build applied ML systems and the tools that make them usable.',
  description:
    'Portfolio of Shaurya Rawat — B.Tech CSE (IoT) student at Amity University. AI Engineering Intern at Syphyr Pvt. Ltd. Building applied machine learning, RAG pipelines, phishing detection, and security tooling with Python, FastAPI, XGBoost, and modern AI/ML stacks.',
  status: 'AI Engineering Intern @ Syphyr (May–Jul 2026) · open to ML/AI/Data roles',
  social: [
    { label: 'GitHub', href: 'https://github.com/ShauryaRawat29' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/shaurya-rawat-8751922b5' },
    { label: 'Email', href: 'mailto:shauryarawat29@gmail.com' },
  ],
  locale: 'en',
} as const;

export const RESUME_PATH = '/resume/Shaurya-Rawat-Resume.docx';
export const KOREAN_RESUME_PATH = '/resume/Shaurya-Rawat-Korean-Portfolio.docx';

export const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: RESUME_PATH },
] as const;