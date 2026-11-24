import { useEffect } from 'react'
import { PROJECTS } from '../data'
import './CaseStudyPage.css'

const CASE_STUDY_DATA = {
  'creme-and-whisk': {
    eyebrow: 'Brand Identity & Web Engineering',
    title: 'Crème & Whisk',
    lead:
      'A luxury artisanal cake studio and bakery flagship crafted for Crème & Whisk Bakehouse, combining refined French-inspired patisserie prestige with a frictionless direct-to-WhatsApp commerce architecture.',
    client: 'Crème & Whisk Bakehouse',
    services: 'Brand Identity · Custom Web Flagship · Direct WhatsApp Commerce',
    timeline: '4 Weeks',
    status: 'Verified Client Production Build',
    heroImage: '/creme_and_whisk_hero.webp',
    overview:
      'Crème & Whisk is a boutique artisanal bakery dedicated to handcrafted celebration cakes, gourmet Belgian chocolate gateaux, and 100% eggless pastry craftsmanship. Built for customers who celebrate life’s milestones with bespoke luxury, the studio required a digital flagship that conveyed Michelin-grade patisserie artistry and eliminated the chaotic friction of traditional bakery ordering.',
    problem:
      'Prior to this build, bakery inquiries arrived through fragmented channels: unstructured Instagram direct messages, lost WhatsApp chats, and scattered menu photos. Customers repeatedly asked for cake sizes, flavors, and pricing, resulting in hours of manual back-and-forth communication and abandoned purchases. Standard off-the-shelf platforms like Shopify or generic WordPress were ruled out: their rigid multi-step carts and mandatory account creation added friction that alienated local, high-intent party hosts.',
    designPrinciples: [
      {
        num: '01',
        title: 'Velvet Crimson & Warm Ivory Palette',
        desc:
          'Deep burgundy crimson balances decadent dark chocolate richness with warmth, set against an airy butter-cream ivory canvas that lets high-resolution cake photography command the eye.'
      },
      {
        num: '02',
        title: 'Editorial Typographic Hierarchy',
        desc:
          'Sophisticated, high-contrast serif headlines evoke French culinary prestige, paired with clean geometric sans-serif for prices, weights, and dietary specifications to ensure effortless mobile legibility.'
      },
      {
        num: '03',
        title: 'Dietary Certification Badges',
        desc:
          'Dietary trust is critical for family celebrations. Clean, prominent 100% Eggless Certified badges and customer review highlights are integrated into every catalog preview, giving immediate reassurance before checkout.'
      },
      {
        num: '04',
        title: 'Tactile One-Handed Mobile Ergonomics',
        desc:
          'Because the vast majority of bakery traffic arrives from smartphones, the entire layout is engineered with thumb-friendly touch targets, zero layout shifts, and seamless category navigation.'
      }
    ],
    userFlow: [
      {
        step: 'STEP 01',
        title: 'Sensory Visual Discovery',
        desc:
          'The visitor lands directly on the artisanal showcase, viewing high-definition photography of signature Belgian chocolate gateaux and seasonal fruit tarts.'
      },
      {
        step: 'STEP 02',
        title: 'Seamless Catalog Selection',
        desc:
          'The customer filters by celebration cakes, mini cakes, or tea pastries, viewing portion sizes (0.5kg / 1kg), dietary specs, and price tiers without page reloads.'
      },
      {
        step: 'STEP 03',
        title: '1-Tap Direct WhatsApp Checkout',
        desc:
          'Tapping "Order via WhatsApp" automatically compiles the selected cake, custom message, size, and date into a structured message sent directly to the head baker, closing the sale in seconds.'
      }
    ],
    technicalSpecs: [
      { title: 'Framework', desc: 'Custom Next.js & React architecture' },
      { title: 'Asset Pipeline', desc: 'Progressive WebP image delivery with responsive srcset' },
      { title: 'Commerce Gateway', desc: 'Direct WhatsApp deep-link order dispatch without third-party fees' },
      { title: 'Responsive Design', desc: 'Fluid layout containment engineered for all smartphone aspect ratios' },
      { title: 'Certifications', desc: '100% Eggless verified trust badges and customer review integration' }
    ],
    faq: [
      {
        q: 'Why was direct WhatsApp ordering chosen over a standard shopping cart?',
        a:
          'Custom celebration cakes are deeply personal purchases requiring flavor tweaks, custom messages, and precise pickup timings. Standard e-commerce carts impose forms, passwords, and payment gateways that cause checkout abandonment on mobile devices. The 1-tap WhatsApp protocol pre-fills every specification into an active conversation, delivering direct concierge service that makes ordering personal and immediate.'
      },
      {
        q: 'How does the platform ensure fast image loading without lag or blur?',
        a:
          'All pastry imagery is optimized through a progressive WebP asset pipeline with responsive srcset definitions and hardware-accelerated decoding. Large hero imagery streams smoothly without layout shifts even on mobile cellular networks.'
      },
      {
        q: 'How are dietary certifications and trust communicated to new clients?',
        a:
          'Clean 100% Eggless Certified stamps and verified customer review highlights are anchored directly within product cards and navigation, providing immediate reassurance for dietary-conscious hosts.'
      },
      {
        q: 'How easily can the bakery team update seasonal menus and pricing?',
        a:
          'The catalog data architecture is completely modular. The bakery team can add seasonal collections, update festive pricing, and upload fresh photography without technical overhead.'
      }
    ]
  },
  'orbit': {
    eyebrow: 'FinTech · Mobile Product Design',
    title: 'Orbit Money',
    lead:
      'A calm personal-finance companion concept designed to replace anxiety-inducing spreadsheets with a single, readable daily spending ring.',
    client: 'Studio Product Exploration',
    services: 'Mobile Product Strategy · UI/UX Design System · Micro-Haptics',
    timeline: '6 Weeks',
    status: 'Studio Concept Architecture',
    heroImage: null,
    overview:
      'Orbit Money reimagines how everyday people interact with their personal finances. Rather than bombarding users with dense charts, tables, and red alert bars, Orbit distills income, recurring bills, and savings targets into one calm, dynamic dial: the Daily Orbit.',
    problem:
      'Mainstream banking and budgeting applications produce cognitive fatigue. Users open their banking app, feel overwhelmed by endless categorization spreadsheets, and close it out of anxiety. Orbit set out to explore how minimal and calm financial information can be while still keeping users informed.',
    designPrinciples: [
      {
        num: '01',
        title: 'The Single-Glance Orbit Ring',
        desc:
          'A gentle violet gradient dial that breathes throughout the day, providing instant reassurance when spending remains within target limits.'
      },
      {
        num: '02',
        title: 'Calm Spatial Whitespace',
        desc:
          'Generous margins and muted lavender-tinted neutrals that lower visual noise and create an uncluttered, modern environment.'
      },
      {
        num: '03',
        title: 'Tactile Micro-Haptics',
        desc:
          'Every logged expense triggers subtle haptic feedback tuned to feel rewarding, turning daily budgeting into a positive subconscious habit.'
      },
      {
        num: '04',
        title: 'Zero-Knowledge Privacy Architecture',
        desc:
          'No advertising banners, no third-party financial tracking, and zero upsells. The interface exists solely for the user’s peace of mind.'
      }
    ],
    userFlow: [
      {
        step: 'STEP 01',
        title: 'Three-Second Morning Glance',
        desc:
          'The user launches Orbit and immediately views their safe-to-spend balance for the day without scrolling or diving into nested tabs.'
      },
      {
        step: 'STEP 02',
        title: 'One-Swipe Expense Entry',
        desc:
          'Logging a purchase takes a single fluid thumb gesture with smart auto-categorization and instant visual dial adjustment.'
      },
      {
        step: 'STEP 03',
        title: 'Weekly Wealth Horizon',
        desc:
          'A calm forward-looking trajectory projects savings growth without shaming past spending habits.'
      }
    ],
    technicalSpecs: [
      { title: 'Mobile Framework', desc: 'React Native & Expo cross-platform architecture' },
      { title: 'Animation Engine', desc: 'Reanimated 3 gesture physics on native UI threads' },
      { title: 'Storage Engine', desc: 'Local-first encrypted SQLite database architecture' },
      { title: 'Security Model', desc: 'Biometric Secure Enclave authentication layer' }
    ],
    faq: [
      {
        q: 'Why eliminate traditional bar charts and pie graphs?',
        a:
          'Dense financial graphs frequently trigger anxiety and cognitive guilt, leading to rapid app abandonment. Distilling daily finances into one intuitive ring simplifies daily decision-making into a single readable glance.'
      },
      {
        q: 'How does Orbit safeguard personal financial data?',
        a:
          'Orbit is architected around a local-first encrypted model where transaction records reside encrypted on the user device hardware, protected by biometric authentication.'
      }
    ]
  },
  'nord': {
    eyebrow: 'Architecture & Editorial Development',
    title: 'Atelier Nord',
    lead:
      'A digital flagship concept for a Scandinavian architectural practice, designed with masked image reveals and a quiet, gallery-like exhibition rhythm.',
    client: 'Studio Architectural Exploration',
    services: 'Art Direction · Headless Web Architecture · WebGL Shaders',
    timeline: '5 Weeks',
    status: 'Studio Concept Architecture',
    heroImage: null,
    overview:
      'Atelier Nord designs sustainable timber residences, cultural pavilions, and civic spaces across Scandinavia. Their web presence was conceived as an exhibition pavilion—commanded by natural light, physical materials, and silent spaciousness.',
    problem:
      'Most architectural portfolios resemble crowded image grids with tiny captions that flatten the physical depth of built structures. Atelier Nord required a web concept that mirrored walking through a sunlit gallery, where photography has space to breathe and transitions feel like turning the pages of an art monograph.',
    designPrinciples: [
      {
        num: '01',
        title: 'Asymmetrical Swiss Typographic Grid',
        desc:
          'Drawing from European architectural publishing, utilizing generous whitespace and deliberate column shifts to establish an exhibition cadence.'
      },
      {
        num: '02',
        title: 'Organic Timber & Birch Palette',
        desc:
          'Natural birch beige paired with muted pine charcoal echoes physical building materials and Scandinavian topography.'
      },
      {
        num: '03',
        title: 'Curtain WebGL Spatial Reveals',
        desc:
          'Smooth kinetic curtain shaders uncover high-resolution blueprints and interior elevations with authentic physical inertia.'
      }
    ],
    userFlow: [
      {
        step: 'STEP 01',
        title: 'Quiet Monograph Entry',
        desc:
          'Visitors arrive into a quiet, full-bleed hero showcasing the Oslo Forest Pavilion with subtle ambient lighting motion.'
      },
      {
        step: 'STEP 02',
        title: 'Typological Project Index',
        desc:
          'Curators and potential clients filter projects by typology: Residential, Public Pavilions, and Sustainable Spatial Planning.'
      },
      {
        step: 'STEP 03',
        title: 'High-Resolution Spatial Deep-Dive',
        desc:
          'Case studies pair photography with interactive material breakdowns and architectural blueprints.'
      }
    ],
    technicalSpecs: [
      { title: 'Core Framework', desc: 'Next.js 14 App Router with server-side rendering' },
      { title: 'Shader Engine', desc: 'Three.js & GLSL custom transition masks' },
      { title: 'Content Layer', desc: 'Modular headless CMS architecture for project catalogs' },
      { title: 'Scroll Dynamics', desc: 'Lenis inertia momentum scrolling for exhibition flow' }
    ],
    faq: [
      {
        q: 'How are high-resolution architectural photographs delivered smoothly?',
        a:
          'The architecture uses edge-cached progressive image pipelines streaming low-quality blur placeholders first, followed by progressive decompression to eliminate layout shifts.'
      },
      {
        q: 'How does the editorial layout perform on small smartphones?',
        a:
          'The asymmetrical desktop columns reflow into a clean, magazine-style vertical feed with tactile plan inspection for mobile viewing.'
      }
    ]
  },
  'pulse': {
    eyebrow: 'SaaS Platform · UI/UX & Web Application',
    title: 'Pulse Studio',
    lead:
      'A high-performance booking and member management platform concept engineered for boutique fitness studios, turning the weekly schedule into the central interactive hero.',
    client: 'Studio SaaS Exploration',
    services: 'Full-Stack Web Application · Real-Time WebSockets · Stripe Connect',
    timeline: '8 Weeks',
    status: 'Studio Concept Architecture',
    heroImage: null,
    overview:
      'Pulse Studio modernizes operations for boutique cycling, reformer Pilates, and HIIT fitness studios. It explores replacing legacy administrative tools with a unified, real-time timetable where coaches, schedules, and spots are managed effortlessly.',
    problem:
      'Studio managers frequently juggle instructor substitutions, cancellations, and billing across fragmented tools. Members are often frustrated by clunky multi-step booking processes that crash during high-demand class drops.',
    designPrinciples: [
      {
        num: '01',
        title: 'Carbon Graphite & Volt Energy',
        desc:
          'High-contrast carbon graphite balances athletic urgency with modern studio luxury, commanding focus toward active booking slots.'
      },
      {
        num: '02',
        title: 'Timetable as the Hero',
        desc:
          'The entire interface is anchored around an interactive schedule where coach profiles, room capacity, and open spots are visible at a glance.'
      },
      {
        num: '03',
        title: 'Direct Reservation Flow',
        desc:
          'Membership credit and saved payment integration allows members to reserve their preferred spot with minimal steps.'
      }
    ],
    userFlow: [
      {
        step: 'STEP 01',
        title: 'Live Timetable Selection',
        desc:
          'Members open the schedule on their phone and immediately view class times, instructor bios, and open spots.'
      },
      {
        step: 'STEP 02',
        title: 'Interactive Spot Map',
        desc:
          'The user picks their preferred bike or reformer on an interactive 2D room floorplan with real-time spot locking.'
      },
      {
        step: 'STEP 03',
        title: 'One-Tap Reservation',
        desc:
          'Booking confirms with calendar sync and automated waitlist notifications.'
      }
    ],
    technicalSpecs: [
      { title: 'Frontend Architecture', desc: 'Next.js & TypeScript single-page application' },
      { title: 'Concurrency Control', desc: 'Optimistic Redis reservation locks to prevent race conditions' },
      { title: 'Real-Time Sync', desc: 'WebSocket event buses for instant floorplan and timetable updates' },
      { title: 'Payment Processing', desc: 'Stripe Connect infrastructure for automated studio payouts' }
    ],
    faq: [
      {
        q: 'How does Pulse prevent double-bookings during high-demand class releases?',
        a:
          'The platform uses an optimistic Redis reservation lock that temporarily holds the chosen spot while the member confirms checkout, eliminating race conditions.'
      },
      {
        q: 'Can studio instructors manage class check-ins on mobile?',
        a:
          'Coaches have access to a dedicated mobile portal where attendance can be logged with one tap without requiring a desktop computer.'
      }
    ]
  }
}

export default function CaseStudyPage({ slug, onNavigate }) {
  const currentSlug = slug || 'creme-and-whisk'
  const project = PROJECTS.find((p) => p.slug === currentSlug) || PROJECTS[0]
  const data = CASE_STUDY_DATA[project.slug] || CASE_STUDY_DATA['creme-and-whisk']

  // Find next project in circular order
  const studies = PROJECTS.filter((p) => p.caseStudy !== false)
  const currentIndex = studies.findIndex((p) => p.slug === project.slug)
  const nextProject = studies[(currentIndex + 1) % studies.length]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  const handleBackToStudio = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('#work')
    } else {
      window.location.hash = '#work'
    }
  }

  const handleNextProject = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(`#case-study/${nextProject.slug}`)
    } else {
      window.location.hash = `#case-study/${nextProject.slug}`
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <article className="cs-page">
      {/* 1. Singular Minimalist Studio Header */}
      <header className="cs-header">
        <div className="cs-header__inner">
          <div className="cs-header__left">
            <a href="#work" onClick={handleBackToStudio} className="cs-header__brand">
              <img src="/logo.jpeg" alt="Nailed It Bro" className="cs-header__logo" width="32" height="32" />
              <span>Nailed It Bro</span>
            </a>
            <span className="cs-header__sep" aria-hidden="true" />
            <a href="#work" onClick={handleBackToStudio} className="cs-header__back">
              <span>← All Projects</span>
            </a>
          </div>

          <div className="cs-header__right">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-header__live-link"
              >
                <span>Live Website</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                if (onNavigate) onNavigate('#contact')
                else window.location.hash = '#contact'
              }}
              className="cs-header__cta"
            >
              <span>Get in touch</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Spacious Editorial Hero */}
      <section className="cs-hero">
        <p className="cs-hero__eyebrow">{data.eyebrow}</p>
        <h1 className="cs-hero__title">{data.title}</h1>
        <p className="cs-hero__lead">{data.lead}</p>
      </section>

      {/* 3. Minimalist Metadata Table Strip */}
      <section className="cs-meta-strip">
        <div className="cs-meta-strip__grid">
          <div className="cs-meta-col">
            <span className="cs-meta-label">Client</span>
            <span className="cs-meta-val">{data.client}</span>
          </div>
          <div className="cs-meta-col">
            <span className="cs-meta-label">Services</span>
            <span className="cs-meta-val">{data.services}</span>
          </div>
          <div className="cs-meta-col">
            <span className="cs-meta-label">Timeline</span>
            <span className="cs-meta-val">{data.timeline}</span>
          </div>
          <div className="cs-meta-col">
            <span className="cs-meta-label">Status</span>
            <span className="cs-meta-val cs-meta-val--accent">{data.status}</span>
          </div>
        </div>
      </section>

      {/* 4. Cinematic Showcase Stage */}
      <section className="cs-showcase">
        <div className="cs-showcase__frame">
          {data.heroImage ? (
            <img
              src={data.heroImage}
              alt={`${data.title} Showcase`}
              className="cs-showcase__img"
              loading="eager"
            />
          ) : (
            <div
              style={{
                background: `linear-gradient(145deg, ${project.palette.bg} 0%, #100F15 100%)`,
                padding: 'clamp(48px, 10vh, 96px) clamp(24px, 5vw, 48px)',
                textAlign: 'center',
                color: '#FFFFFF',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <span style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: project.palette.accent }}>
                System Architecture
              </span>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', margin: 0, fontWeight: 800 }}>
                {data.title}
              </h2>
              <p style={{ maxWidth: '52ch', margin: 0, opacity: 0.8, fontSize: '16px', lineHeight: 1.6 }}>
                {data.lead}
              </p>
            </div>
          )}

          <div className="cs-showcase__caption-bar">
            <p className="cs-showcase__caption">
              {data.title} &mdash; {data.services}
            </p>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-showcase__launch-btn"
              >
                <span>Launch Live Website</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 5. Spacious Editorial Article Narrative */}
      <main className="cs-article">
        {/* Section 01: Context & The Problem */}
        <section className="cs-section">
          <div className="cs-section__sidebar">
            <span className="cs-section__num">01 / CONTEXT</span>
            <h2 className="cs-section__heading">The Brief &amp; Problem</h2>
          </div>
          <div className="cs-section__content">
            <p>{data.overview}</p>
            <p><strong>The Core Challenge:</strong> {data.problem}</p>
          </div>
        </section>

        {/* Section 02: Design Strategy & Visual Philosophy */}
        <section className="cs-section">
          <div className="cs-section__sidebar">
            <span className="cs-section__num">02 / ARCHITECTURE</span>
            <h2 className="cs-section__heading">Design Strategy</h2>
          </div>
          <div className="cs-section__content">
            <p>
              Every visual and spatial choice was engineered with commercial intent. Rather than defaulting to generic website templates, the aesthetic directly answers customer objections and guides attention toward high-intent engagement.
            </p>
            <div className="cs-pillars">
              {data.designPrinciples.map((pillar) => (
                <div key={pillar.num} className="cs-pillar">
                  <span className="cs-pillar__num">{pillar.num}</span>
                  <div className="cs-pillar__body">
                    <h3 className="cs-pillar__title">{pillar.title}</h3>
                    <p className="cs-pillar__desc">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 03: User Journey & Flow */}
        <section className="cs-section">
          <div className="cs-section__sidebar">
            <span className="cs-section__num">03 / EXPERIENCE</span>
            <h2 className="cs-section__heading">User Experience Flow</h2>
          </div>
          <div className="cs-section__content">
            <p>
              How customers naturally navigate the platform from their first sensory impression through to completing a verified conversion:
            </p>
            <div className="cs-steps">
              {data.userFlow.map((step) => (
                <div key={step.step} className="cs-step">
                  <span className="cs-step__badge">{step.step}</span>
                  <div className="cs-step__body">
                    <h3 className="cs-step__title">{step.title}</h3>
                    <p className="cs-step__desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 04: Technical Specifications & Deliverables */}
        <section className="cs-section">
          <div className="cs-section__sidebar">
            <span className="cs-section__num">04 / SPECIFICATIONS</span>
            <h2 className="cs-section__heading">Technical Architecture</h2>
          </div>
          <div className="cs-section__content">
            <p>
              Verified technical architecture and deliverables implemented for this build:
            </p>
            <div className="cs-specs-list">
              {data.technicalSpecs.map((spec, idx) => (
                <div key={idx} className="cs-spec-row">
                  <span className="cs-spec-dot">✦</span>
                  <div className="cs-spec-text">
                    <strong>{spec.title}:</strong> {spec.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 05: Questions & Answers (FAQ) */}
        <section className="cs-section">
          <div className="cs-section__sidebar">
            <span className="cs-section__num">05 / ANALYSIS</span>
            <h2 className="cs-section__heading">Design &amp; Use Q&amp;A</h2>
          </div>
          <div className="cs-section__content">
            <p>
              Detailed explanations covering the rationale behind key design decisions, daily commercial usage, and operational maintenance:
            </p>
            <div className="cs-faq-list">
              {data.faq.map((item, idx) => (
                <div key={idx} className="cs-faq-item">
                  <h3 className="cs-faq-question">{item.q}</h3>
                  <p className="cs-faq-answer">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 6. Next Project Transition */}
      <section className="cs-next-nav">
        <a href={`#case-study/${nextProject.slug}`} onClick={handleNextProject} className="cs-next-nav__link">
          <span className="cs-next-nav__label">Next Case Study</span>
          <h2 className="cs-next-nav__title">
            <span>{nextProject.name}</span>
            <span className="cs-next-nav__arrow" aria-hidden="true">&rarr;</span>
          </h2>
        </a>
      </section>
    </article>
  )
}
