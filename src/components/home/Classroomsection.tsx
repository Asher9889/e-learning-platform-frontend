const FEATURES = [
  { label: 'hd video & screen sharing', icon: '🖥️' },
  { label: 'real-time chat & q&a', icon: '💬' },
  { label: 'hand raising & moderation', icon: '✋' },
  { label: 'session recording & replay', icon: '⏺️' },
  { label: 'auto attendance tracking', icon: '📋' },
  { label: 'multi-host & breakout rooms', icon: '🚪' },
];

export function ClassroomSection() {
  return (
    <section id="classroom" className="superr" style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        {/* Left: Product Visual — Live class notebook */}
        <div className="product-card" style={{ padding: 0, overflow: 'hidden', transform: 'rotate(-2deg)' }}>
          {/* Notebook top */}
          <div style={{ background: 'var(--color-charcoal)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            <div style={{
              fontFamily: 'var(--font-geist)', fontSize: 12, color: '#fff', marginLeft: 12,
              textTransform: 'lowercase',
            }}>
              live class · mathematics 101
            </div>
          </div>
          {/* Video placeholder */}
          <div style={{
            background: '#1a1a2e',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: '#ef4444', color: '#fff',
              fontFamily: 'var(--font-geist)', fontSize: 11, fontWeight: 600,
              padding: '3px 10px', borderRadius: 4,
            }}>
              ● live
            </div>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <path d="M20 15V33L34 24L20 15Z" fill="rgba(255,255,255,0.8)" />
            </svg>
          </div>
          {/* Chat preview */}
          <div style={{ padding: 16, borderTop: '1px solid var(--color-charcoal)' }}>
            <div style={{ fontFamily: 'var(--font-geist)', fontSize: 12, color: 'var(--color-charcoal)', marginBottom: 10, textTransform: 'lowercase' }}>
              live chat
            </div>
            {[
              { name: 'riya', msg: 'can you explain that again?' },
              { name: 'arjun', msg: 'got it! thanks sir' },
            ].map(({ name, msg }) => (
              <div key={name} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: 'var(--color-dew-drop)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-geist)', fontSize: 11, fontWeight: 600,
                  color: 'var(--color-charcoal)',
                  flexShrink: 0, textTransform: 'lowercase',
                }}>
                  {name[0]}
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-geist)', fontSize: 12, fontWeight: 500, color: 'var(--color-charcoal)' }}>{name} </span>
                  <span style={{ fontFamily: 'var(--font-geist)', fontSize: 12, color: 'var(--color-charcoal)' }}>{msg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div style={{ position: 'relative' }}>
          {/* Sticker */}
          <div className="sticker" style={{ position: 'absolute', top: -20, right: 20, transform: 'rotate(-12deg)' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect x="2" y="2" width="40" height="40" rx="8" fill="#22c55e" stroke="#171717" strokeWidth="2" />
              <path d="M14 22L20 28L30 16" stroke="#171717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="handwritten-caption" style={{ marginBottom: 8 }}>
            live classes that feel real
          </div>
          <h2 className="display-headline" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', margin: 0, marginBottom: 16 }}>
            your classroom.<br />anywhere.
          </h2>
          <p style={{ fontFamily: 'var(--font-geist)', fontSize: 16, lineHeight: 1.6, color: 'var(--color-charcoal)', marginBottom: 28 }}>
            teachers go live in one click. students join from any device. chat, ask questions, raise hands —
            it's a real classroom, just without the walls.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map(({ label, icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: '1.5px solid var(--color-charcoal)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>
                  {icon}
                </div>
                <span style={{
                  fontFamily: 'var(--font-geist)', fontSize: 14, color: 'var(--color-charcoal)',
                  textTransform: 'lowercase',
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
