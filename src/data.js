export const NAV = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
]

export const EMAIL = 'contact@naileditbro.com'

export const SERVICES = [
  {
    id: 'brand',
    no: '01',
    title: 'Brand Identity',
    short: 'Strategy, naming, logos and visual systems.',
    body: 'We shape how your business looks, sounds and feels. Positioning workshops, logo design, typography, colour and a brand book your team can actually use.',
    deliverables: ['Brand strategy', 'Logo & identity', 'Guidelines'],
    tone: '#FF5E14',
  },
  {
    id: 'web',
    no: '02',
    title: 'Website Design & Development',
    short: 'Editorial, fast, conversion-minded websites.',
    body: 'Custom-designed marketing sites built on modern stacks, with motion that earns its place, a CMS your team can edit and performance budgets we hold ourselves to.',
    deliverables: ['UX & art direction', 'Front-end build', 'CMS'],
    tone: '#FF7533',
  },
  {
    id: 'apps',
    no: '03',
    title: 'Mobile App Development',
    short: 'Native-feeling iOS and Android apps.',
    body: 'From first prototype to store launch. Cross-platform builds with thoughtful interaction design, offline support and analytics baked in from day one.',
    deliverables: ['Prototyping', 'iOS & Android', 'Launch support'],
    tone: '#FF884D',
  },
  {
    id: 'product',
    no: '04',
    title: 'UI/UX & Product Design',
    short: 'Research-led interfaces people enjoy.',
    body: 'User research, flows, wireframes and design systems for SaaS and digital products. We test early so the expensive decisions are the right ones.',
    deliverables: ['Research', 'Design systems', 'Usability testing'],
    tone: '#FF9E66',
  },
  {
    id: 'commerce',
    no: '05',
    title: 'E-commerce',
    short: 'Storefronts that make buying effortless.',
    body: 'Shopify and headless commerce builds with considered product pages, frictionless checkout and merchandising tools that scale with your catalogue.',
    deliverables: ['Shopify & headless', 'Checkout UX', 'Integrations'],
    tone: '#FF5E14',
  },
  {
    id: 'growth',
    no: '06',
    title: 'SEO & Digital Growth',
    short: 'Get found, then keep improving.',
    body: 'Technical SEO, content structure, Core Web Vitals and analytics so every launch keeps compounding after go-live.',
    deliverables: ['Technical SEO', 'Analytics', 'CRO'],
    tone: '#FFAA77',
  },
]

// Concept projects: studio explorations, not client work.
export const PROJECTS = [
  {
    slug: 'halden',
    name: 'Halden Coffee',
    kind: 'Brand & E-commerce',
    year: 'Concept',
    blurb: 'A roastery identity and storefront built around warm editorial photography and a one-tap subscription flow.',
    palette: { bg: '#2B211B', ink: '#F2E6D6', accent: '#C9844E', soft: '#4A382C' },
    layout: 'shop',
    challenge: 'Specialty coffee sites tend to look interchangeable. The goal was a brand that felt crafted, with a shop that makes subscribing simpler than buying once.',
    approach: ['Editorial wordmark and packaging system', 'Product pages that lead with taste notes', 'Subscription builder in three steps'],
  },
  {
    slug: 'orbit',
    name: 'Orbit Money',
    kind: 'Mobile App · Product Design',
    year: 'Concept',
    blurb: 'A calm personal-finance app that turns spending into a single, readable daily ring instead of a wall of charts.',
    palette: { bg: '#E7E4F0', ink: '#1C1A26', accent: '#6E5BD8', soft: '#CFC9E6' },
    layout: 'app',
    challenge: 'Finance apps overwhelm people with data. We explored how little information you need to feel in control.',
    approach: ['One daily "orbit" ring as the primary view', 'Gentle, haptic micro-interactions', 'Accessible colour system for charts'],
  },
  {
    slug: 'nord',
    name: 'Atelier Nord',
    kind: 'Website · Art Direction',
    year: 'Concept',
    blurb: 'A portfolio site for an architecture practice, with masked image transitions and a slow, gallery-like rhythm.',
    palette: { bg: '#D9D4CA', ink: '#1A1A18', accent: '#3E4A3D', soft: '#BDB6A8' },
    layout: 'editorial',
    challenge: 'Architects want their work to breathe. The site needed to feel like walking through a quiet gallery.',
    approach: ['Large-format masked image reveals', 'Typographic project index', 'Lightweight CMS for new projects'],
  },
  {
    slug: 'pulse',
    name: 'Pulse Studio',
    kind: 'Web App · UI/UX',
    year: 'Concept',
    blurb: 'A booking dashboard for boutique fitness studios that makes the schedule the hero of the interface.',
    palette: { bg: '#1D2124', ink: '#EEF0EC', accent: '#D7F25C', soft: '#30363A' },
    layout: 'dashboard',
    challenge: 'Studio owners juggle classes, coaches and payments across several tools. One clear schedule view had to replace them.',
    approach: ['Drag-to-reschedule calendar', 'Live class capacity indicators', 'Member app with one-tap booking'],
  },
]

export const PROCESS = [
  { no: '01', title: 'Discover', body: 'Workshops, research and a clear brief. We agree on goals, audience and what success looks like before any pixels move.' },
  { no: '02', title: 'Design', body: 'Art direction, wireframes and interactive prototypes. You see real screens early and often.' },
  { no: '03', title: 'Build', body: 'Clean, accessible, fast code. Weekly previews, no surprises, and motion tuned on real devices.' },
  { no: '04', title: 'Launch & grow', body: 'QA, launch, training and ongoing support. We measure, learn and keep improving.' },
]

export const MARQUEE = ['Websites', 'Mobile Apps', 'Social Media', 'QR Solutions', 'Business Automation', 'UI/UX Design', 'Modern Tech']
