import { useCallback, useEffect, useRef, useState } from 'react'
import { BUBU } from '../data'
import { createBubu } from '../lib/bubu'
import { prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import './Bubu.css'

const INK = '#3b2b28'
const EAR = '#2e2421'
const FUR = '#fffdfb'
const HEART = 'M0 0 c-3 -5 -10 -2 -7 4 l7 6 l7 -6 c3 -6 -4 -9 -7 -4 Z'
const STAR = 'M0 0 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 Z'

function answer(q) {
  const s = q.toLowerCase().trim()
  return BUBU.faq.find((f) => f.keys.test(s)) ?? BUBU.fallback
}

/** Bubu: the roaming panda mascot with a small FAQ chat. */
export default function Bubu() {
  const refs = { pet: useRef(null), lean: useRef(null), flip: useRef(null), mascot: useRef(null), pupils: useRef(null), hint: useRef(null) }
  const engine = useRef(null)
  const msgsRef = useRef(null)
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [typing, setTyping] = useState(false)
  const [chips, setChips] = useState(BUBU.suggestions)
  const [draft, setDraft] = useState('')
  const openRef = useRef(open)
  openRef.current = open

  useEffect(() => {
    const els = Object.fromEntries(Object.entries(refs).map(([k, r]) => [k, r.current]))
    engine.current = createBubu(els, {
      reduced: prefersReducedMotion(),
      onTap: () => {
        if (!openRef.current) { engine.current.setMood('happy', 1400); engine.current.jump(8); setOpen(true) }
        else engine.current.react()
      },
    })
    return () => engine.current.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const say = useCallback((reply) => {
    setTyping(true)
    engine.current?.setMood('curious')
    const wait = 600 + Math.min(1100, reply.text.length * 10)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', text: reply.text, link: reply.link }])
      setChips(reply.suggest ?? BUBU.suggestions)
      const e = engine.current
      if (!e) return
      if (reply.action === 'dance') e.dance()
      else if (reply.action === 'wave') e.wave()
      else e.setMood(reply.mood ?? 'happy', 1400)
    }, wait)
  }, [])

  useEffect(() => {
    engine.current?.setOpen(open)
    if (open && msgs.length === 0) say({ text: BUBU.greeting, action: 'wave' })
    if (open && window.matchMedia('(pointer: fine)').matches) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350)
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    const el = msgsRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, typing])

  function close() {
    setOpen(false)
    engine.current?.setMood('shy', 1200)
    refs.mascot.current?.focus({ preventScroll: true })
  }

  function ask(q) {
    const text = q.trim()
    if (!text || typing) return
    setMsgs((m) => [...m, { from: 'me', text }])
    say(answer(text))
  }

  return (
    <>
      <div className={`bubu-chat${open ? '' : ' is-closed'}`} id="bubu-chat" role="dialog" aria-label="Chat with Bubu" inert={!open}>
        <div className="bubu-chat__head">
          <span className="bubu-chat__dot" aria-hidden="true" />
          <div><b>Bubu</b><small>Nailed It Bro helper</small></div>
          <button type="button" className="bubu-chat__close" onClick={close} aria-label="Close chat">×</button>
        </div>
        <div className="bubu-chat__msgs" ref={msgsRef} data-lenis-prevent aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`bubu-msg bubu-msg--${m.from}`}>
              {m.text}
              {m.link && (
                <a href={m.link.href} className="bubu-msg__link" onClick={(e) => { e.preventDefault(); scrollToTarget(m.link.href) }}>
                  {m.link.label} <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          ))}
          {typing && <div className="bubu-msg bubu-msg--bot" aria-label="Bubu is typing"><span className="bubu-typing"><i /><i /><i /></span></div>}
        </div>
        <div className="bubu-chat__chips">
          {chips.map((c) => <button type="button" key={c} onClick={() => ask(c)}>{c}</button>)}
        </div>
        <form className="bubu-chat__send" onSubmit={(e) => { e.preventDefault(); ask(draft); setDraft('') }}>
          <input ref={inputRef} id="bubu-input" type="text" placeholder="Ask Bubu…" autoComplete="off" aria-label="Message" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit">Send</button>
        </form>
      </div>

      <div className="bubu" ref={refs.pet}>
        <div className="bubu__hint" ref={refs.hint}>Hi! Tap me or drag me</div>
        <div className="bubu__lean" ref={refs.lean}>
          <div className="bubu__flip" ref={refs.flip}>
            <button className="bubu__body" ref={refs.mascot} type="button" data-mood="normal" aria-label="Bubu, the Nailed It Bro helper. Tap to chat." aria-expanded={open} aria-controls="bubu-chat">
              <div className="bubu__bob">
                <svg viewBox="0 0 200 224" aria-hidden="true">
                  <circle className="ear" cx="44" cy="50" r="22" fill={EAR} />
                  <circle className="ear" cx="156" cy="50" r="22" fill={EAR} />

                  <ellipse className="foot foot-l" cx="78" cy="204" rx="16" ry="10" fill={FUR} stroke={INK} strokeWidth="3.5" />
                  <ellipse className="foot foot-r" cx="122" cy="204" rx="16" ry="10" fill={FUR} stroke={INK} strokeWidth="3.5" />

                  <path d="M100 32 C152 32 184 64 184 106 C184 132 170 148 150 156 C153 178 150 194 140 204 L60 204 C50 194 47 178 50 156 C30 148 16 132 16 106 C16 64 48 32 100 32 Z" fill={FUR} stroke={INK} strokeWidth="3.5" />

                  <ellipse className="arm arm-l" cx="52" cy="174" rx="10" ry="16" fill={FUR} stroke={INK} strokeWidth="3.5" />
                  <ellipse className="arm arm-r" cx="148" cy="174" rx="10" ry="16" fill={FUR} stroke={INK} strokeWidth="3.5" />

                  <rect className="brow brow-l" x="63" y="94" width="16" height="4" rx="2" fill={INK} />
                  <rect className="brow brow-r" x="121" y="94" width="16" height="4" rx="2" fill={INK} />

                  <circle className="blush" cx="52" cy="134" r="13" fill="#f9aeb6" />
                  <circle className="blush" cx="148" cy="134" r="13" fill="#f9aeb6" />

                  {/* eyes: one group per mood */}
                  <g className="part eye-normal">
                    <ellipse cx="72" cy="114" rx="7.5" ry="8.5" fill={EAR} />
                    <ellipse cx="128" cy="114" rx="7.5" ry="8.5" fill={EAR} />
                    <g ref={refs.pupils} className="pupils">
                      <circle cx="74.5" cy="111" r="2.6" fill="#fff" />
                      <circle cx="130.5" cy="111" r="2.6" fill="#fff" />
                    </g>
                  </g>
                  <g className="part eye-happy" stroke={EAR} strokeWidth="4.5" strokeLinecap="round" fill="none">
                    <path d="M63 117 Q72 105 81 117" /><path d="M119 117 Q128 105 137 117" />
                  </g>
                  <g className="part eye-sleep" stroke={EAR} strokeWidth="4" strokeLinecap="round" fill="none">
                    <path d="M63 113 Q72 121 81 113" /><path d="M119 113 Q128 121 137 113" />
                  </g>
                  <g className="part eye-wow">
                    <ellipse cx="72" cy="113" rx="10" ry="12" fill={EAR} />
                    <ellipse cx="128" cy="113" rx="10" ry="12" fill={EAR} />
                    <circle cx="75.5" cy="108" r="3.8" fill="#fff" /><circle cx="131.5" cy="108" r="3.8" fill="#fff" />
                    <circle cx="69" cy="118" r="1.8" fill="#fff" /><circle cx="125" cy="118" r="1.8" fill="#fff" />
                  </g>
                  <g className="part eye-dizzy" stroke={EAR} strokeWidth="3" strokeLinecap="round" fill="none">
                    <path d="M72 114 m-1.5 0 a1.5 1.5 0 1 1 3 0 a3.5 3.5 0 1 1 -7 0 a5.5 5.5 0 1 1 11 0 a7.5 7.5 0 1 1 -15 0" />
                    <path d="M128 114 m-1.5 0 a1.5 1.5 0 1 1 3 0 a3.5 3.5 0 1 1 -7 0 a5.5 5.5 0 1 1 11 0 a7.5 7.5 0 1 1 -15 0" />
                  </g>

                  {/* mouths */}
                  <path className="part m-idle" d="M89 124 Q94.5 133 100 125 Q105.5 133 111 124" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <g className="part m-open">
                    <path d="M88 123 Q100 123 112 123 Q110 142 100 142 Q90 142 88 123 Z" fill={INK} />
                    <path d="M93 136 Q100 131 107 136 Q105 141 100 141 Q95 141 93 136 Z" fill="#f2706b" />
                  </g>
                  <ellipse className="part m-o" cx="100" cy="130" rx="5.5" ry="7" fill={INK} />
                  <ellipse className="part m-sleep" cx="100" cy="129" rx="3.5" ry="3" fill={INK} />
                  <path className="part m-flat" d="M91 131 Q100 123 109 131" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path className="part m-wavy" d="M86 129 q3.5 -5 7 0 t7 0 t7 0 t7 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />

                  {/* effects */}
                  <g className="fx fx-spark" fill="#f28a9c">
                    <path transform="translate(28 108)" d={HEART} /><path transform="translate(172 108)" d={HEART} />
                  </g>
                  <g className="fx fx-zzz" fill="#7a6a66" fontFamily="Inter Tight, system-ui, sans-serif" fontWeight="800">
                    <text x="150" y="44" fontSize="18">z</text><text x="150" y="44" fontSize="22">z</text><text x="150" y="44" fontSize="26">Z</text>
                  </g>
                  <path className="fx fx-sweat" d="M170 74 C164 84 164 90 170 90 C176 90 176 84 170 74 Z" fill="#8fd0f5" stroke={INK} strokeWidth="2.5" />
                  <g className="fx fx-stars" fill="#f5c542" stroke={INK} strokeWidth="2" strokeLinejoin="round">
                    <path transform="translate(40 30)" d={STAR} /><path transform="translate(160 30)" d={STAR} /><path transform="translate(100 4)" d={STAR} />
                  </g>
                  <g className="fx fx-anger" stroke="#e0483e" strokeWidth="3.5" strokeLinecap="round" fill="none">
                    <path d="M150 66 q6 -2 4 -8 M162 66 q-6 -2 -4 -8 M150 72 q6 2 4 8 M162 72 q-6 2 -4 8" />
                  </g>
                  <g className="fx fx-shy" stroke="#e88a97" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M44 132 l4 -6 M52 134 l4 -6 M140 134 l4 -6 M148 132 l4 -6" />
                  </g>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
