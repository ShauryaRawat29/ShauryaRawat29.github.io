// Edit this file to re-label the entire site. Header, Footer, the homepage
// and SEO defaults all read from here instead of hardcoding copy.
export const SITE = {
  name: 'Shaurya Rawat',
  role: 'Machine Learning, Data & AI Engineering',
  email: 'shauryarawat29@gmail.com',
  tagline: 'I build applied ML systems and the tools that make them usable.',
  description:
    'Portfolio of Shaurya Rawat — B.Tech CSE (IoT) student at Amity University building applied machine learning, RAG, and security tooling with Python, FastAPI, and modern AI/ML stacks.',
  status: 'AI Intern @ Syphyr · open to ML/Data/AI roles',
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