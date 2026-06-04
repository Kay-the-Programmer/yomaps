const CATEGORY_ICONS = {
  apparel:     'APPAREL',
  headwear:    'HEADWEAR',
  accessories: 'ACCESS.',
  music:       'MUSIC',
  lifestyle:   'LIFESTYLE',
  exclusive:   'EXCLUSIVE'
}

const CATEGORY_SHAPES = {
  apparel: (
    <path
      d="M50 20 L30 30 L20 25 L15 45 L25 43 L25 80 L75 80 L75 43 L85 45 L80 25 L70 30 Z"
      fill="none"
      stroke="#c9a84c"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  headwear: (
    <path
      d="M30 65 Q50 20 70 65 L75 65 Q75 72 50 72 Q25 72 25 65 Z"
      fill="none"
      stroke="#c9a84c"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  accessories: (
    <>
      <rect x="30" y="35" width="40" height="30" rx="2" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
      <line x1="30" y1="50" x2="70" y2="50" stroke="#c9a84c" strokeWidth="1" strokeDasharray="3 3" />
    </>
  ),
  music: (
    <path
      d="M40 30 L40 70 M60 25 L60 65 M40 30 L60 25 M40 70 Q40 75 35 75 Q30 75 30 70 Q30 65 35 65 Q40 65 40 70 M60 65 Q60 70 55 70 Q50 70 50 65 Q50 60 55 60 Q60 60 60 65"
      fill="none"
      stroke="#c9a84c"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  ),
  lifestyle: (
    <circle cx="50" cy="50" r="22" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
  ),
  exclusive: (
    <path
      d="M50 22 L57 40 L77 40 L62 52 L67 70 L50 60 L33 70 L38 52 L23 40 L43 40 Z"
      fill="none"
      stroke="#c9a84c"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  )
}

export default function ProductSVG({ category, name }) {
  const shape = CATEGORY_SHAPES[category] || CATEGORY_SHAPES.lifestyle
  const label = CATEGORY_ICONS[category] || 'MERCH'

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block', background: '#111111' }}
      aria-label={name}
      role="img"
    >
      <rect width="100" height="100" fill="#111111" />
      <rect width="100" height="100" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />

      {shape}

      <text
        x="50"
        y="91"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="5"
        fontWeight="600"
        letterSpacing="0.15em"
        fill="rgba(201,168,76,0.4)"
      >
        {label}
      </text>

      <text
        x="50"
        y="13"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="7"
        fontWeight="700"
        letterSpacing="0.08em"
        fill="rgba(201,168,76,0.6)"
      >
        YM
      </text>
    </svg>
  )
}
