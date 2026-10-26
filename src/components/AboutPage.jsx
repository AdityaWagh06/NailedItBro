import { useState, useEffect } from 'react'
import {
  Laptop,
  Smartphone,
  Bot,
  QrCode,
  Gamepad2,
  Palette,
  Users,
  Target,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowDown,
  ExternalLink,
  MessageSquare,
  FileText,
  Code2,
  Rocket,
  Zap,
} from 'lucide-react'

import { scrollToTarget } from '../lib/useSmoothScroll'

import SectionLabel from './SectionLabel'
import SectionHeading from './SectionHeading'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import StatItem from './StatItem'
import BenefitCard from './BenefitCard'
import ServiceItem from './ServiceItem'
import FounderCard from './FounderCard'
import ProcessStep from './ProcessStep'
import PrincipleCard from './PrincipleCard'
import ProjectCard from './ProjectCard'
import TestimonialCard from './TestimonialCard'
import TrustStrip from './TrustStrip'
import FAQItem from './FAQItem'
import CTABand from './CTABand'
import Reveal from './Reveal'
import TiltedLogoCard from './TiltedLogoCard'
import AboutBackgroundCanvas from './AboutBackgroundCanvas'

export default function AboutPage({ onNavigate }) {
  const [heroImgError, setHeroImgError] = useState(false)
  const [activeProcessStep, setActiveProcessStep] = useState(0)
  const [isProcessPaused, setIsProcessPaused] = useState(false)

  // Auto-advance process step animation every 3 seconds unless hovered
  useEffect(() => {
    if (isProcessPaused) return
    const timer = setInterval(() => {
      setActiveProcessStep((prev) => (prev + 1) % 5)
    }, 3000)
    return () => clearInterval(timer)
  }, [isProcessPaused])

  const handleCta = (href) => {
    if (onNavigate) {
      onNavigate(href)
    } else {
      window.location.hash = href
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSpotlightMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  // --- SECTION 4: SERVICES DATA ---
  // --- SECTION 4: SERVICES DATA ---
  const servicesData = [
    {
      icon: Laptop,
      title: 'Websites and Web Apps',
      description: 'Fast, mobile-friendly sites built to turn visitors into enquiries.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Android and iOS apps that are simple to use and smooth to run.',
    },
    {
      icon: Bot,
      title: 'AI Automation',
      description: 'Chatbots and workflows that save your team hours of repetitive work.',
    },
    {
      icon: QrCode,
      title: 'QR Systems',
      description: 'Digital menus, payments, tracking, and customer engagement through QR.',
    },
    {
      icon: Gamepad2,
      title: '3D and Interactive Games',
      description: 'Playable experiences for brands that want to stand out.',
    },
    {
      icon: Palette,
      title: 'Brand Identity and UI/UX',
      description: 'Logos, design systems, and clean interfaces that look professional everywhere.',
    },
  ]

  // --- SECTION 5: WHY CLIENTS CHOOSE US DATA ---
  const benefitsData = [
    {
      icon: Users,
      title: 'You talk to the people doing the work',
      description: 'Every project is led by a founder. Questions get answered the same day.',
    },
    {
      icon: Target,
      title: 'Built for business results',
      description: 'We start by asking what you want: more leads, more orders, less manual work. Then we build toward that.',
    },
    {
      icon: CheckCircle2,
      title: 'Clear communication',
      description: 'A defined scope, a timeline, and regular updates. You always know what’s done and what’s next.',
    },
    {
      icon: Sparkles,
      title: 'Custom, never recycled',
      description: 'Your product is designed around your brand and your customers, so it doesn’t look like everyone else’s.',
    },
    {
      icon: ShieldCheck,
      title: 'One team for everything',
      description: 'Website, app, AI, and branding under one roof.',
    },
  ]

  // --- SECTION 6: PROCESS STEPS ---
  const processStepsData = [
    {
      number: '1',
      title: 'Discuss',
      duration: 'Day 1',
      icon: MessageSquare,
      description: 'We learn your business, goals, and budget on a direct founder call.',
    },
    {
      number: '2',
      title: 'Plan',
      duration: 'Days 2–4',
      icon: FileText,
      description: 'We send the scope, tech stack, timeline, and cost in writing.',
    },
    {
      number: '3',
      title: 'Design',
      duration: 'Week 2',
      icon: Palette,
      description: 'You approve the interactive look and flow in Figma before coding starts.',
    },
    {
      number: '4',
      title: 'Build',
      duration: 'Weeks 3–5',
      icon: Code2,
      description: 'We develop, test on real devices, and share weekly interactive previews.',
    },
    {
      number: '5',
      title: 'Launch & Support',
      duration: 'Launch Day',
      icon: Rocket,
      description: 'We go live, hand over full ownership, and stay available afterwards.',
    },
  ]

  // --- SECTION 7: PRINCIPLES ---
  const principlesData = [
    {
      number: '01',
      title: 'Ownership',
      description: 'We treat every project as if our own name is on it. Because it is.',
    },
    {
      number: '02',
      title: 'Honesty',
      description: 'We tell you what will and won’t work, even when it’s not what you hoped to hear.',
    },
    {
      number: '03',
      title: 'Craft',
      description: 'No generic templates. Every screen is designed and built for your business.',
    },
    {
      number: '04',
      title: 'Speed with care',
      description: 'We move fast, but we test on real devices before anything ships.',
    },
  ]

  // --- SECTION 8: FOUNDERS ---
  const foundersData = [
    {
      name: 'Atharv Doiphode',
      role: 'CO-FOUNDER',
      domain: 'Website and Strategy',
      bio: 'Plans your product and online presence so it has a clear purpose and a clear audience.',
      skills: ['Websites', 'Social Media', 'Product Strategy'],
      photoSrc: '/team/atharv.webp',
      linkedin: 'https://www.linkedin.com/in/atharv-doiphode-07045125a/',
      instagram: 'https://instagram.com/itsjustatharv',
    },
    {
      name: 'Aditya Wagh',
      role: 'CO-FOUNDER',
      domain: 'AI, Wbsite and QR Systems  ',
      bio: 'Builds Websites, QR-powered tools and AI automations that cut manual work.',
      skills: ['QR Systems', 'Artificial Intelligence'],
      photoSrc: '/team/aditya.webp',
      linkedin: 'https://www.linkedin.com/in/aditya-wagh25/',
      instagram: 'https://instagram.com/_adityawagh_7',
    },
    {
      name: 'Mohit Malve',
      role: 'CO-FOUNDER',
      domain: 'AI and Game Development',
      bio: 'Creates intelligent features and interactive 3D experiences.',
      skills: ['Artificial Intelligence', 'Game Development'],
      photoSrc: '/team/mohit.webp',
      linkedin: 'https://www.linkedin.com/in/mohit-malve/',
      instagram: 'https://instagram.com/mohitmalve7',
    },
    {
      name: 'Avdhoot Pimparkar',
      role: 'CO-FOUNDER',
      domain: 'App Development and UI/UX',
      bio: 'Designs and builds mobile apps that are simple to use and smooth to run.',
      skills: ['App Development', 'UI/UX Design'],
      photoSrc: '/team/avdhoot.webp',
      linkedin: 'https://www.linkedin.com/in/avdhootp144/',
      instagram: 'https://instagram.com/avdhoot14_4',
    },
  ]

  // --- SECTION 9: OUR WORK (PROOF) ---
  const projectsData = [
    {
      name: '[Project name]',
      clientType: '[Type of client]',
      result: '[One-line result]',
      screenshot: '/web.png',
      techTags: ['Next.js', 'PostgreSQL', 'Tailwind'],
      link: '#',
      isOwnProduct: true,
      isTodo: true,
    },
    {
      name: '[Project name]',
      clientType: '[Type of client]',
      result: '[One-line result]',
      screenshot: '/pet.png',
      techTags: ['React Native', 'Node.js', 'Stripe'],
      link: '#',
      isOwnProduct: true,
      isTodo: true,
    },
    {
      name: '[Project name]',
      clientType: '[Type of client]',
      result: '[One-line result]',
      screenshot: '/qr.png',
      techTags: ['QR Engine', 'Cloud Functions', 'Analytics'],
      link: '#',
      isOwnProduct: true,
      isTodo: true,
    },
  ]

  // --- SECTION 10: WHO WE HELP PILLS ---
  const audiencePills = [
    'Startups',
    'Local businesses',
    'Restaurants and cafés',
    'Schools and coaching classes',
    'Retail and e-commerce',
    'Event organizers',
  ]

  // --- SECTION 11: FAQ DATA ---
  const faqData = [
    {
      id: 'cost',
      question: 'How much does a project cost?',
      answer: 'It depends on scope. Websites start from [₹X], apps from [₹X]. We share a written quote after the first call.',
    },
    {
      id: 'timeline',
      question: 'How long does it take?',
      answer: '[X-Y] weeks for most websites, [X-Y] weeks for apps.',
    },
    {
      id: 'support',
      question: 'Do you offer support after launch?',
      answer: 'Yes. [X] months of free fixes, then optional monthly support.',
    },
    {
      id: 'ownership',
      question: 'Who owns the code and design?',
      answer: 'You do. Full handover on final payment.',
    },
    {
      id: 'existing',
      question: 'Can you work with our existing website or app?',
      answer: 'Yes. We can redesign, extend, or fix what you already have.',
    },
    {
      id: 'payments',
      question: 'How do payments work?',
      answer: '[e.g. 40% to start, 30% at design approval, 30% on launch.]',
    },
  ]

  return (
    <div className="about-page-layout">
      {/* Living Dynamic Background Canvas */}
      <AboutBackgroundCanvas />

      {/* =====================================================================
          SECTION 1: HERO (EDITORIAL STORY WITH FLOATING MASCOT & WRAPAROUND PARAGRAPHS)
          ===================================================================== */}
      <section className="about-sec about-sec--hero" aria-labelledby="about-hero-heading">
        <div className="container">
          <div className="about-editorial-story">
            <Reveal>
              <SectionLabel text="OUR STORY" />
            </Reveal>

            <Reveal delay={60}>
              <h1 id="about-hero-heading" className="about-hero-h1">
                <span className="about-hero-h1__highlight">About Us —</span>
                Four founders. One team. Zero{' '}
                <em className="serif about-hero-h1__accent">middlemen.</em>
              </h1>
            </Reveal>

            <div className="about-editorial-flow">
              {/* Studio Mascot floated on right so paragraphs wrap around and below it */}
              <div className="about-editorial-aside">
                <Reveal delay={150}>
                  <TiltedLogoCard
                    imageSrc="/mascot_head_nohammer.png"
                    alt="Nailed It Bro Studio Mascot & Logo"
                    badgeText="4 founders, 1 team"
                  />
                </Reveal>
              </div>

              {/* Narrative paragraphs flowing beside and all around below the image */}
              <div className="about-editorial-text">
                <p className="about-lead-p">
                  Nailed It Bro was started by four founders who were tired of watching ambitious businesses get trapped in overpriced agency bureaucracy. We cut out the account executives, middle managers, and vanishing freelance subcontractors to build the kind of dedicated digital studio we always wanted to work with as clients ourselves.
                </p>
                <p>
                  Most traditional agencies operate like sales conveyor belts: a polished pitch team closes the contract, makes grand promises about innovation, and promptly hands the work off to junior associates or outsourced overseas teams you never get to speak with. By the time your feedback trickles through multiple layers of account coordinators and email threads, weeks have passed, nuance is lost, and the invoice has quietly doubled.
                </p>
                <p>
                  We built our studio on the exact opposite principle. At Nailed It Bro, every project is planned, architected, and built directly by the four core founders across user experience design, frontend development, backend engineering, and digital growth. When you join a kickoff call or drop a question in our project channel, the person replying is the exact craftsman writing your React components, animating your micro-interactions, or configuring your cloud database.
                </p>
                <p>
                  Because we keep our overhead lean and our core team tight, we don't need to juggle dozens of generic projects to pay for fancy downtown offices or layers of middle management. We take on a select roster of clients at a time, treating every single product as a flagship benchmark. That means uncomfortably high technical standards, sub-second load times, bespoke codebases crafted from scratch, and zero template shortcuts.
                </p>
                <p>
                  Whether you are an early-stage founder bringing an MVP to life, or an established company replacing a sluggish legacy platform with a high-converting web presence, you work directly with people who care about your launch as much as you do. Four founders. One unified team. Zero middlemen.
                </p>
              </div>

              <div className="about-editorial-footer">
                <Reveal delay={200}>
                  <TrustStrip
                    items={[
                      '4 founders, 1 team',
                      'Zero outsourcing',
                      '100% custom builds',
                      'Open for new projects',
                    ]}
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: NUMBERS STRIP (STUDIO PILLARS)
          ===================================================================== */}
      <section className="about-sec about-sec--numbers" aria-label="Studio commitments">
        <div className="container">
          <Reveal>
            <div className="numbers-card numbers-card--3col">
              <div className="numbers-grid numbers-grid--3col">
                <StatItem
                  targetValue={4}
                  number="4"
                  label="Founders on every project"
                  note="Direct communication"
                />
                <StatItem
                  targetValue={24}
                  prefix="< "
                  suffix="h"
                  number="< 24h"
                  label="First response guaranteed"
                  note="Fast answers, no waiting"
                />
                <StatItem
                  targetValue={100}
                  suffix="%"
                  number="100%"
                  label="Handcrafted & custom"
                  note="No generic templates"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: WHO WE ARE
          ===================================================================== */}
      <section className="about-sec about-sec--who" id="story" aria-labelledby="who-we-are-heading">
        <div className="container">
          <div className="who-we-are-grid">
            {/* Left Column: Story Text */}
            <div className="who-we-are-story">
              <Reveal>
                <SectionLabel text="OUR STORY" />
                <h2 id="who-we-are-heading" className="section-h2">
                  Built by four founders who got tired of{' '}
                  <em className="serif section-h2__accent">overpriced</em> digital work.
                </h2>
              </Reveal>

              <Reveal delay={60}>
                <div className="who-we-are-paras">
                  <p>
                    We started Nailed It Bro because small and mid-sized businesses kept paying too much for slow, template-looking websites and apps.
                  </p>
                  <p>
                    So we built a studio where the people you speak to on day one are the same people who design, code, and launch your product. No handoffs, no 'let me check with the team,' no surprises.
                  </p>
                  <p>
                    We are a young, hungry team. That means we care about every project, answer fast, and treat your business like our own.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right Column: "What we build" Card */}
            <div className="who-we-are-card-wrap">
              <Reveal delay={120}>
                <div className="what-we-build-card">
                  <h3 className="what-we-build-card__title">What we build</h3>
                  <ul className="what-we-build-list">
                    <li>
                      <Check size={18} className="list-check-icon" aria-hidden="true" />
                      <span>Websites and web platforms engineered to convert visitors</span>
                    </li>
                    <li>
                      <Check size={18} className="list-check-icon" aria-hidden="true" />
                      <span>Custom Android & iOS mobile apps that are fast and intuitive</span>
                    </li>
                    <li>
                      <Check size={18} className="list-check-icon" aria-hidden="true" />
                      <span>AI automations and smart workflows that save valuable hours</span>
                    </li>
                    <li>
                      <Check size={18} className="list-check-icon" aria-hidden="true" />
                      <span>Dynamic QR systems for payments, ordering, and engagement</span>
                    </li>
                    <li>
                      <Check size={18} className="list-check-icon" aria-hidden="true" />
                      <span>Clean brand identities, logos, and professional interfaces</span>
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: WHAT WE DO (SERVICES)
          ===================================================================== */}
      <section className="about-sec about-sec--services" id="services" aria-labelledby="services-heading">
        <div className="container">
          <Reveal>
            <SectionLabel text="WHAT WE DO" />
            <SectionHeading
              prefix="Everything your business needs to"
              accent="go digital."
              subtext="One team for your website, app, automation, and brand. No juggling five vendors."
            />
          </Reveal>

          <div className="services-3x2-grid">
            {servicesData.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 50}>
                <ServiceItem
                  icon={svc.icon}
                  title={svc.title}
                  description={svc.description}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: WHY CLIENTS CHOOSE US
          ===================================================================== */}
      <section className="about-sec about-sec--why" aria-labelledby="why-us-heading">
        <div className="container">
          <Reveal>
            <SectionLabel text="WHY US" />
            <SectionHeading
              prefix="What you get when you work with"
              accent="us."
            />
          </Reveal>

          <div className="benefits-stagger-grid">
            {/* Top row: 3 cards */}
            <div className="benefits-row-top">
              {benefitsData.slice(0, 3).map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <BenefitCard
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </Reveal>
              ))}
            </div>

            {/* Bottom row: 2 benefit cards + 6th Result CTA card with animated smiley */}
            <div className="benefits-row-bottom">
              {benefitsData.slice(3, 5).map((item, i) => (
                <Reveal key={item.title} delay={180 + i * 60}>
                  <BenefitCard
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </Reveal>
              ))}

              {/* Card 6: The Eye-Catching Result CTA Card with Organic Notch & Animated Smiley */}
              <Reveal delay={300}>
                <div
                  className="benefit-card benefit-card--result-cta"
                  onClick={() => handleCta('#contact')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCta('#contact')}
                  aria-label="Contact us to get results"
                >
                  <div className="result-cta__content">
                    <h3 className="result-cta__title">
                      Want <span className="result-cta__accent">to get results!</span>
                    </h3>
                    <button
                      type="button"
                      className="result-cta__btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCta('#contact')
                      }}
                    >
                      <span>Contact us</span>
                      <span className="result-cta__btn-arrow" aria-hidden="true">→</span>
                    </button>
                  </div>

                  {/* Organic corner notch with animated smiley emoji */}
                  <div className="result-cta__notch" title="Let's nail it!">
                    <span className="result-cta__emoji" role="img" aria-label="Cool smiley emoji">
                      😎
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: HOW WE WORK (PROCESS)
          ===================================================================== */}
      <section className="about-sec about-sec--process" id="process" aria-labelledby="process-heading">
        <div className="container">
          <Reveal>
            <SectionLabel text="OUR PROCESS" />
            <SectionHeading
              prefix="From first call to launch,"
              accent="simply."
            />
          </Reveal>

          <div className="process-timeline-wrap">
            {processStepsData.map((step, idx) => (
              <Reveal key={step.number} delay={idx * 60}>
                <ProcessStep
                  number={step.number}
                  title={step.title}
                  duration={step.duration}
                  icon={step.icon}
                  description={step.description}
                  isActive={idx === activeProcessStep}
                  isCompleted={idx < activeProcessStep}
                  isLast={idx === processStepsData.length - 1}
                  onClick={() => setActiveProcessStep(idx)}
                  onMouseEnter={() => {
                    setActiveProcessStep(idx)
                    setIsProcessPaused(true)
                  }}
                  onMouseLeave={() => setIsProcessPaused(false)}
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={250}>
            <div className="process-timeline-note">
              <span className="process-timeline-note__text">
                Typical delivery timeline: <strong>2–4 weeks</strong> for business websites,{' '}
                <strong>6–10 weeks</strong> for custom mobile & web apps.
              </span>
              <span className="process-timeline-badge">✦ Fixed-scope guarantee</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          SECTION 7: OUR PRINCIPLES
          ===================================================================== */}
      <section className="about-sec about-sec--principles" aria-labelledby="principles-heading">
        <div className="container">
          <div className="principles-layout">
            {/* Left Column: Pull Quote */}
            <div className="principles-quote-col">
              <Reveal>
                <div className="principles-quote-box">
                  <div className="principles-quote-top">
                    <SectionLabel text="WHAT WE BELIEVE" />
                    <blockquote className="principles-pull-quote">
                      “Good enough is the enemy of greatness. We refine every interaction until it feels purposeful, and undeniably{' '}
                      <em className="serif principles-pull-quote__accent">nailed.</em>”
                    </blockquote>
                  </div>
                  <div className="principles-quote-footer">
                    <span className="principles-quote-author">— The Nailed It Bro Creed</span>
                    <span className="principles-quote-sub">How we build every product</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: 2x2 Principles Grid */}
            <div className="principles-cards-col">
              <div className="principles-2x2-grid">
                {principlesData.map((pr, i) => (
                  <Reveal key={pr.number} delay={i * 60}>
                    <PrincipleCard
                      number={pr.number}
                      title={pr.title}
                      description={pr.description}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 8: MEET THE FOUNDERS
          ===================================================================== */}
      <section className="about-sec about-sec--founders" id="team" aria-labelledby="founders-heading">
        <div className="container">
          <Reveal>
            <SectionLabel text="THE FOUNDERS" />
            <SectionHeading
              prefix="Meet the people who will build your"
              accent="project."
              subtext="Four founders, each leading a different part of your product."
            />
          </Reveal>

          <div className="founders-cards-row">
            {foundersData.map((f, i) => (
              <Reveal key={f.name} delay={i * 60} className="founder-card-reveal-col">
                <FounderCard
                  name={f.name}
                  role={f.role}
                  domain={f.domain}
                  bio={f.bio}
                  skills={f.skills}
                  photoSrc={f.photoSrc}
                  linkedin={f.linkedin}
                  instagram={f.instagram}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 9: OUR WORK (PROOF)
          ===================================================================== */}
      <section className="about-sec about-sec--work" id="work" aria-labelledby="work-heading">
        <div className="container">
          <Reveal>
            <SectionLabel text="OUR WORK" />
            <SectionHeading
              prefix="Things we've"
              accent="built."
            />
          </Reveal>

          <div className="work-cards-grid">
            {projectsData.map((proj, i) => (
              <Reveal key={i} delay={i * 60}>
                <ProjectCard
                  screenshot={proj.screenshot}
                  name={proj.name}
                  clientType={proj.clientType}
                  result={proj.result}
                  techTags={proj.techTags}
                  link={proj.link}
                  isOwnProduct={proj.isOwnProduct}
                  isTodo={proj.isTodo}
                />
              </Reveal>
            ))}
          </div>

          {/* TestimonialCard: Rendered only when real client data exists; currently empty/commented out as per instructions */}
          {/*
          <TestimonialCard
            quote="[REAL CLIENT TESTIMONIAL QUOTE]"
            name="[CLIENT NAME]"
            business="[CLIENT BUSINESS]"
          />
          */}
        </div>
      </section>

      {/* =====================================================================
          SECTION 10: WHO WE HELP
          ===================================================================== */}
      <section className="about-sec about-sec--who-help" aria-labelledby="who-help-heading">
        <div className="container">
          <Reveal>
            <div className="who-help-center-header">
              <SectionLabel text="WHO WE HELP" />
              <h2 id="who-help-heading" className="section-h2 who-help-title">
                Built for businesses like <em className="serif section-h2__accent">yours.</em>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="who-help-pills-row" aria-label="Businesses and industries we build for">
              {audiencePills.map((pill) => (
                <span key={pill} className="audience-pill-item">
                  {pill}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          SECTION 11: FAQ
          ===================================================================== */}
      <section className="about-sec about-sec--faq" id="faq" aria-labelledby="faq-heading">
        <div className="container">
          <Reveal>
            <div className="faq-center-header">
              <SectionLabel text="QUESTIONS" />
              <h2 id="faq-heading" className="section-h2 faq-title">
                Before you <em className="serif section-h2__accent">ask.</em>
              </h2>
            </div>
          </Reveal>

          <div className="faq-accordion-container">
            {faqData.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 40}>
                <FAQItem
                  id={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={i === 0}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 12: FOLLOW US (SOCIALS)
          ===================================================================== */}
      <section className="about-sec about-sec--follow" aria-labelledby="follow-studio-heading">
        <div className="container">
          {/* Top Scrolling Text Ticker Ribbon */}
          <Reveal>
            <div className="follow-ticker-ribbon" aria-hidden="true">
              <div className="follow-ticker-track">
                <span>✦ BEHIND THE SCENES</span>
                <span>✦ UI/UX EXPERIMENTS</span>
                <span>✦ PRODUCT LAUNCHES</span>
                <span>✦ CODE BREAKDOWNS</span>
                <span>✦ STUDIO CULTURE</span>
                <span>✦ BUILT IN PUBLIC</span>
                <span>✦ BEHIND THE SCENES</span>
                <span>✦ UI/UX EXPERIMENTS</span>
                <span>✦ PRODUCT LAUNCHES</span>
                <span>✦ CODE BREAKDOWNS</span>
                <span>✦ STUDIO CULTURE</span>
                <span>✦ BUILT IN PUBLIC</span>
              </div>
            </div>
          </Reveal>

          {/* Section Header */}
          <Reveal delay={60}>
            <div className="follow-studio-header">
              <SectionLabel text="FOLLOW THE STUDIO" />
              <SectionHeading
                prefix="Behind the scenes of our"
                accent="craft."
                subtext="Live project breakdowns, design drops, and how we turn complex ideas into shipped products. Follow along on our official verified channels."
              />
            </div>
          </Reveal>

          {/* 3 Rich Interactive Studio Cards */}
          <div className="follow-studio-cards-grid">
            {/* 1. LinkedIn */}
            <Reveal delay={100} className="follow-card-col">
              <a
                href="https://linkedin.com/company/naileditbro"
                target="_blank"
                rel="noopener noreferrer"
                className="studio-channel-card studio-channel-card--li"
                aria-label="Follow Nailed It Bro on LinkedIn"
              >
                <div className="studio-channel-card__top">
                  <div className="studio-channel-icon-wrap studio-channel-icon-wrap--li">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53c0-.85-.68-1.54-1.53-1.54a1.54 1.54 0 0 0-1.54 1.54c0 .85.69 1.53 1.54 1.53m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                    </svg>
                  </div>
                  <div className="studio-channel-card__badges">
                    <span className="studio-verified-pill">
                      <span className="verified-dot" aria-hidden="true" />
                      OFFICIAL
                    </span>
                    <div className="studio-arrow-badge" aria-hidden="true">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                <div className="studio-channel-card__body">
                  <span className="studio-channel-tag">Engineering & Tech</span>
                  <h3 className="studio-channel-name">LinkedIn</h3>
                  <span className="studio-channel-handle">Nailed It Bro · Company</span>
                  <p className="studio-channel-desc">
                    Industry insights, architectural benchmarks, client case studies, and engineering updates from the team.
                  </p>
                </div>

                <div className="studio-channel-card__footer">
                  <span className="studio-channel-cta">Follow on LinkedIn</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </div>
              </a>
            </Reveal>

            {/* 2. Instagram */}
            <Reveal delay={160} className="follow-card-col">
              <a
                href="https://instagram.com/nailedit.bro"
                target="_blank"
                rel="noopener noreferrer"
                className="studio-channel-card studio-channel-card--ig"
                aria-label="Follow Nailed It Bro on Instagram"
              >
                <div className="studio-channel-card__top">
                  <div className="studio-channel-icon-wrap studio-channel-icon-wrap--ig">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div className="studio-channel-card__badges">
                    <span className="studio-verified-pill">
                      <span className="verified-dot" aria-hidden="true" />
                      OFFICIAL
                    </span>
                    <div className="studio-arrow-badge" aria-hidden="true">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                <div className="studio-channel-card__body">
                  <span className="studio-channel-tag">Visuals & Motion</span>
                  <h3 className="studio-channel-name">Instagram</h3>
                  <span className="studio-channel-handle">@nailedit.bro</span>
                  <p className="studio-channel-desc">
                    Visual design drops, interactive UI showcases, behind-the-scenes stories, and studio culture highlights.
                  </p>
                </div>

                <div className="studio-channel-card__footer">
                  <span className="studio-channel-cta">Follow on Instagram</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </div>
              </a>
            </Reveal>

            {/* 3. Facebook */}
            <Reveal delay={220} className="follow-card-col">
              <a
                href="https://www.facebook.com/share/1FFA1GSven/"
                target="_blank"
                rel="noopener noreferrer"
                className="studio-channel-card studio-channel-card--fb"
                aria-label="Connect with Nailed It Bro on Facebook"
              >
                <div className="studio-channel-card__top">
                  <div className="studio-channel-icon-wrap studio-channel-icon-wrap--fb">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                  <div className="studio-channel-card__badges">
                    <span className="studio-verified-pill">
                      <span className="verified-dot" aria-hidden="true" />
                      OFFICIAL
                    </span>
                    <div className="studio-arrow-badge" aria-hidden="true">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                <div className="studio-channel-card__body">
                  <span className="studio-channel-tag">Community & Events</span>
                  <h3 className="studio-channel-name">Facebook</h3>
                  <span className="studio-channel-handle">Nailed It Bro · Page</span>
                  <p className="studio-channel-desc">
                    Company announcements, client success stories, community discussions, and digital innovation updates.
                  </p>
                </div>

                <div className="studio-channel-card__footer">
                  <span className="studio-channel-cta">Follow on Facebook</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 13: FINAL CTA BAND
          ===================================================================== */}
      <Reveal>
        <CTABand onConsultClick={handleCta} />
      </Reveal>
    </div>
  )
}
