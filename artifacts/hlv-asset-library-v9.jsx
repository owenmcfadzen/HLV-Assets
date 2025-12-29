import React, { useState } from 'react';

// ============================================================================
// HLV DESIGN TOKENS Ã¢â‚¬â€ Single source of truth
// ============================================================================
const T = {
  navy: '#182D53',
  emerald: '#00D866',
  slate: '#374151',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#D1D5DB',
  success: '#059669',
  successBg: '#ECFDF5',
  white: '#FFFFFF',
  font: "'Manrope', system-ui, sans-serif",
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  sizes: { xs: 10, sm: 11, base: 12, md: 13, lg: 14, xl: 16, '2xl': 18, '3xl': 24 },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 },
  radius: 8,
  radiusSm: 4,
  radiusLg: 12,
  stroke: 2,
  strokeSm: 1,
};

// ============================================================================
// SHARED STYLES
// ============================================================================
const S = {
  title: { fontFamily: T.font, fontSize: 24, fontWeight: 700, fill: T.navy },
  subtitle: { fontFamily: T.font, fontSize: 14, fontWeight: 500, fill: T.gray },
  heading: { fontFamily: T.font, fontSize: 18, fontWeight: 700, fill: T.white },
  headingNavy: { fontFamily: T.font, fontSize: 16, fontWeight: 700, fill: T.navy },
  label: { fontFamily: T.font, fontSize: 14, fontWeight: 400, fill: T.slate },
  labelSm: { fontFamily: T.font, fontSize: 12, fontWeight: 400, fill: T.gray },
  labelBold: { fontFamily: T.font, fontSize: 14, fontWeight: 600, fill: T.navy },
  caption: { fontFamily: T.font, fontSize: 11, fontWeight: 500, fill: T.gray },
  captionBold: { fontFamily: T.font, fontSize: 12, fontWeight: 600, fill: T.navy },
  tag: { fontFamily: T.font, fontSize: 11, fontWeight: 600, fill: T.white },
  number: { fontFamily: T.font, fontSize: 48, fontWeight: 700, fill: T.navy, opacity: 0.15 },
};

// ============================================================================
// SHARED COMPONENTS
// ============================================================================
const Card = ({ x, y, w, h, title, headerColor = T.gray, highlight, children }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={0} y={0} width={w} height={h} rx={T.radius} 
      fill={highlight ? T.successBg : T.lightGray} 
      stroke={highlight ? T.emerald : T.border} 
      strokeWidth={highlight ? 2 : 1} />
    <rect x={0} y={0} width={w} height={40} rx={T.radius} fill={headerColor} />
    <rect x={0} y={32} width={w} height={8} fill={headerColor} />
    {title && <text x={w/2} y={26} textAnchor="middle" style={S.heading}>{title}</text>}
    {children}
  </g>
);

const TextBlock = ({ x, y, lines, style = S.label, lineHeight = 16, anchor = "middle" }) => (
  <g>
    {lines.map((line, i) => (
      <text key={i} x={x} y={y + i * lineHeight} textAnchor={anchor} style={style}>{line}</text>
    ))}
  </g>
);

// ============================================================================
// DIAGRAM COMPONENTS Ã¢â‚¬â€ All defined before RENDERERS
// ============================================================================

const ThreeBoxes = () => {
  const boxes = [
    { x: 56, title: 'Box 1', num: '1', lines: ['Existing', 'Products'], desc: ['Incremental', 'improvements'], color: T.gray },
    { x: 300, title: 'Box 2', num: '2', lines: ['Adjacent', 'Markets'], desc: ['New customers', 'for existing products'], color: T.gray },
    { x: 544, title: 'Box 3', num: '3', lines: ['New', 'Problems'], desc: ['Identify unmet needs', 'and create solutions'], color: T.navy, highlight: true },
  ];
  
  return (
    <svg viewBox="0 0 800 400" style={{ width: '100%', maxWidth: 800 }}>
      <text x={400} y={48} textAnchor="middle" style={S.title}>Three Boxes of Innovation</text>
      {boxes.map((b, i) => (
        <Card key={i} x={b.x} y={88} w={200} h={240} title={b.title} headerColor={b.color} highlight={b.highlight}>
          <text x={100} y={112} textAnchor="middle" style={{ ...S.number, fill: b.highlight ? T.emerald : T.navy, opacity: b.highlight ? 0.3 : 0.15 }}>{b.num}</text>
          <TextBlock x={100} y={72} lines={b.lines} style={b.highlight ? S.labelBold : S.label} />
          <TextBlock x={100} y={128} lines={b.desc} style={S.labelSm} />
        </Card>
      ))}
      <g transform="translate(594, 340)">
        <rect x={0} y={0} width={100} height={24} rx={12} fill={T.emerald} />
        <text x={50} y={16} textAnchor="middle" style={S.tag}>HLV FOCUS</text>
      </g>
    </svg>
  );
};

const BuildMeasureLearn = () => {
  const nodes = [
    { x: 300, y: 150, label: 'BUILD' },
    { x: 413, y: 345, label: 'MEASURE' },
    { x: 187, y: 345, label: 'LEARN' },
  ];
  
  return (
    <svg viewBox="0 0 600 520" style={{ width: '100%', maxWidth: 600 }}>
      <text x={300} y={40} textAnchor="middle" style={S.title}>Build-Measure-Learn</text>
      <text x={300} y={65} textAnchor="middle" style={S.subtitle}>The Lean Startup Cycle</text>
      
      <path d="M 352 172 A 125 125 0 0 1 400 300" fill="none" stroke={T.navy} strokeWidth={4} strokeLinecap="round" />
      <polygon points="395,310 410,295 385,295" fill={T.navy} transform="rotate(35, 400, 300)" />
      
      <path d="M 380 375 A 125 125 0 0 1 220 375" fill="none" stroke={T.navy} strokeWidth={4} strokeLinecap="round" />
      <polygon points="215,365 230,380 205,380" fill={T.navy} transform="rotate(145, 220, 375)" />
      
      <path d="M 200 300 A 125 125 0 0 1 248 172" fill="none" stroke={T.navy} strokeWidth={4} strokeLinecap="round" />
      <polygon points="258,177 243,162 243,192" fill={T.navy} transform="rotate(-35, 248, 172)" />
      
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={50} fill={T.navy} />
          <text x={n.x} y={n.y + 6} textAnchor="middle" style={{ ...S.heading, fontSize: 16 }}>{n.label}</text>
        </g>
      ))}
      
      <circle cx={300} cy={280} r={40} fill={T.emerald} />
      <text x={300} y={276} textAnchor="middle" style={{ ...S.tag, fontSize: 10 }}>MVP</text>
      <text x={300} y={290} textAnchor="middle" style={{ ...S.tag, fontSize: 9 }}>Minimum</text>
      <text x={300} y={302} textAnchor="middle" style={{ ...S.tag, fontSize: 9 }}>Viable Product</text>
      
      <text x={300} y={480} textAnchor="middle" style={S.caption}>Start small, test fast, iterate continuously</text>
    </svg>
  );
};

const DoubleDiamond = () => {
  const phases = [
    { label: 'DISCOVER', x: 120, type: 'diverge' },
    { label: 'DEFINE', x: 310, type: 'converge' },
    { label: 'DEVELOP', x: 540, type: 'diverge' },
    { label: 'DELIVER', x: 770, type: 'converge' },
  ];
  const centerY = 280;
  const amplitude = 140;
  
  return (
    <svg viewBox="0 0 960 520" style={{ width: '100%', maxWidth: 960 }}>
      <text x={480} y={40} textAnchor="middle" style={S.title}>Double Diamond Process</text>
      <text x={480} y={65} textAnchor="middle" style={S.subtitle}>From discovery to validated solution</text>
      
      <path d={`M 30,${centerY} L 220,${centerY-amplitude} L 410,${centerY} L 600,${centerY-amplitude} L 790,${centerY} L 600,${centerY+amplitude} L 410,${centerY} L 220,${centerY+amplitude} Z`}
        fill={T.successBg} stroke={T.emerald} strokeWidth={2} />
      
      <line x1={410} y1={centerY-amplitude-20} x2={410} y2={centerY+amplitude+20} stroke={T.border} strokeWidth={2} strokeDasharray="6,4" />
      
      <text x={220} y={centerY-amplitude-35} textAnchor="middle" style={S.captionBold}>Problem Space</text>
      <text x={600} y={centerY-amplitude-35} textAnchor="middle" style={S.captionBold}>Solution Space</text>
      
      {phases.map((p, i) => (
        <g key={i}>
          <rect x={p.x - 45} y={centerY - 15} width={90} height={30} rx={4} fill={T.navy} />
          <text x={p.x} y={centerY + 5} textAnchor="middle" style={{ ...S.tag, fontSize: 11 }}>{p.label}</text>
        </g>
      ))}
      
      <g transform="translate(30, 420)">
        <circle cx={10} cy={8} r={8} fill={T.navy} />
        <text x={26} y={12} style={S.labelSm}>Problem</text>
      </g>
      <g transform="translate(410, 420)">
        <rect x={0} y={0} width={16} height={16} rx={3} fill={T.emerald} />
        <text x={26} y={12} style={S.labelSm}>Opportunity (POV)</text>
      </g>
      <g transform="translate(790, 420)">
        <polygon points="8,0 16,16 0,16" fill={T.success} />
        <text x={26} y={12} style={S.labelSm}>LPP</text>
      </g>
      
      <text x={480} y={480} textAnchor="middle" style={S.caption}>Diverge to explore possibilities, converge to make decisions</text>
    </svg>
  );
};

const SixReframing = () => {
  const lenses = [
    { num: 1, title: 'Look Outside the Frame', desc: 'What are we missing?', example: 'Consider stakeholders not in the room', color: T.navy },
    { num: 2, title: 'Rethink the Goal', desc: 'Is this the right objective?', example: 'Question if solving the right problem', color: T.navy },
    { num: 3, title: 'Examine Bright Spots', desc: 'Where is it already working?', example: 'Find existing successes to learn from', color: T.emerald },
    { num: 4, title: 'Look in the Mirror', desc: 'What\'s our role in the problem?', example: 'Examine own contribution to situation', color: T.navy },
    { num: 5, title: 'Take Their Perspective', desc: 'How do others see this?', example: 'Understand different viewpoints', color: T.navy },
    { num: 6, title: 'Move Forward', desc: 'What would make this easy?', example: 'Identify path of least resistance', color: T.navy },
  ];
  
  const cols = 3;
  const cardW = 280;
  const cardH = 180;
  const gapX = 40;
  const gapY = 24;
  const startX = (1000 - (cols * cardW + (cols-1) * gapX)) / 2;
  const startY = 100;
  
  return (
    <svg viewBox="0 0 1000 700" style={{ width: '100%', maxWidth: 1000 }}>
      <text x={500} y={40} textAnchor="middle" style={S.title}>Six Reframing Lenses</text>
      <text x={500} y={65} textAnchor="middle" style={S.subtitle}>Wedell-Wedellsborg's framework for problem reframing</text>
      
      {lenses.map((lens, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardW + gapX);
        const y = startY + row * (cardH + gapY);
        const isHighlight = lens.color === T.emerald;
        
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <rect x={0} y={0} width={cardW} height={cardH} rx={T.radius}
              fill={isHighlight ? T.successBg : T.lightGray}
              stroke={isHighlight ? T.emerald : T.border}
              strokeWidth={isHighlight ? 2 : 1} />
            <circle cx={28} cy={28} r={18} fill={lens.color} />
            <text x={28} y={34} textAnchor="middle" style={{ ...S.tag, fontSize: 14 }}>{lens.num}</text>
            <text x={56} y={34} style={{ ...S.labelBold, fontSize: 15 }}>{lens.title}</text>
            <text x={16} y={70} style={{ ...S.label, fontWeight: 500 }}>{lens.desc}</text>
            <rect x={16} y={90} width={cardW - 32} height={1} fill={T.border} />
            <text x={16} y={115} style={S.labelSm}>{lens.example}</text>
            {isHighlight && (
              <g transform={`translate(${cardW - 85}, ${cardH - 32})`}>
                <rect x={0} y={0} width={70} height={20} rx={10} fill={T.emerald} />
                <text x={35} y={14} textAnchor="middle" style={{ ...S.tag, fontSize: 9 }}>START HERE</text>
              </g>
            )}
          </g>
        );
      })}
      
      <text x={500} y={660} textAnchor="middle" style={S.caption}>Apply each lens systematically to reframe problems and discover new opportunities</text>
    </svg>
  );
};

const EightModels = () => {
  const models = [
    { name: 'Product Sale', icon: 'Ã°Å¸â€œÂ¦', desc: 'One-time purchase' },
    { name: 'Subscription', icon: 'Ã°Å¸â€â€ž', desc: 'Recurring payments' },
    { name: 'Freemium', icon: 'Ã°Å¸Å½Â', desc: 'Free + premium tiers' },
    { name: 'Marketplace', icon: 'Ã°Å¸ÂÂª', desc: 'Connect buyers & sellers' },
    { name: 'Advertising', icon: 'Ã°Å¸â€œÂ¢', desc: 'Attention monetization' },
    { name: 'Data/API', icon: 'Ã°Å¸â€œÅ ', desc: 'Information as product' },
    { name: 'Licensing', icon: 'Ã°Å¸â€œÅ“', desc: 'Usage rights' },
    { name: 'Service', icon: 'Ã°Å¸â€ºÂ Ã¯Â¸Â', desc: 'Expertise delivery' },
  ];
  
  const cols = 4;
  const cardW = 180;
  const cardH = 120;
  const gap = 24;
  const startX = (900 - (cols * cardW + (cols-1) * gap)) / 2;
  
  return (
    <svg viewBox="0 0 900 560" style={{ width: '100%', maxWidth: 900 }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>8 Business Models</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>Common revenue strategies for ventures</text>
      
      {models.map((m, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardW + gap);
        const y = 100 + row * (cardH + gap);
        
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <rect x={0} y={0} width={cardW} height={cardH} rx={T.radius} fill={T.lightGray} stroke={T.border} strokeWidth={1} />
            <text x={cardW/2} y={40} textAnchor="middle" style={{ fontSize: 28 }}>{m.icon}</text>
            <text x={cardW/2} y={70} textAnchor="middle" style={S.labelBold}>{m.name}</text>
            <text x={cardW/2} y={95} textAnchor="middle" style={S.labelSm}>{m.desc}</text>
          </g>
        );
      })}
      
      <text x={450} y={420} textAnchor="middle" style={S.caption}>Most ventures combine multiple models</text>
    </svg>
  );
};

const MagicBullet = () => {
  const centerX = 400;
  const centerY = 280;
  const radius = 160;
  
  const vertices = [
    { x: centerX, y: centerY - radius, label: 'Business Insight', desc: 'Where is value created?', angle: -90 },
    { x: centerX + radius * Math.cos(Math.PI/6), y: centerY + radius * Math.sin(Math.PI/6), label: 'Domain Expertise', desc: 'What do you know deeply?', angle: 30 },
    { x: centerX - radius * Math.cos(Math.PI/6), y: centerY + radius * Math.sin(Math.PI/6), label: 'Distribution', desc: 'How do you reach customers?', angle: 150 },
  ];
  
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', maxWidth: 800 }}>
      <text x={400} y={40} textAnchor="middle" style={S.title}>The Magic Bullet</text>
      <text x={400} y={65} textAnchor="middle" style={S.subtitle}>Three critical questions for opportunity identification</text>
      
      <polygon
        points={vertices.map(v => `${v.x},${v.y}`).join(' ')}
        fill={T.successBg}
        stroke={T.emerald}
        strokeWidth={3}
      />
      
      <circle cx={centerX} cy={centerY} r={50} fill={T.navy} />
      <text x={centerX} y={centerY - 6} textAnchor="middle" style={{ ...S.tag, fontSize: 10 }}>MAGIC</text>
      <text x={centerX} y={centerY + 10} textAnchor="middle" style={{ ...S.tag, fontSize: 10 }}>BULLET</text>
      
      {vertices.map((v, i) => (
        <g key={i}>
          <circle cx={v.x} cy={v.y} r={12} fill={T.emerald} />
          <text x={v.x} y={v.y + 4} textAnchor="middle" style={{ ...S.tag, fontSize: 11 }}>{i + 1}</text>
          <text 
            x={v.angle === -90 ? v.x : v.x + (v.angle === 30 ? 30 : -30)} 
            y={v.angle === -90 ? v.y - 25 : v.y + 35} 
            textAnchor={v.angle === -90 ? 'middle' : v.angle === 30 ? 'start' : 'end'}
            style={S.labelBold}
          >{v.label}</text>
          <text 
            x={v.angle === -90 ? v.x : v.x + (v.angle === 30 ? 30 : -30)} 
            y={v.angle === -90 ? v.y - 8 : v.y + 52} 
            textAnchor={v.angle === -90 ? 'middle' : v.angle === 30 ? 'start' : 'end'}
            style={S.labelSm}
          >{v.desc}</text>
        </g>
      ))}
      
      <text x={400} y={470} textAnchor="middle" style={S.caption}>The intersection of all three creates defensible opportunity</text>
    </svg>
  );
};

const ConePredictability = () => {
  const startX = 100;
  const endX = 700;
  const centerY = 250;
  const maxSpread = 150;
  
  return (
    <svg viewBox="0 0 800 450" style={{ width: '100%', maxWidth: 800 }}>
      <text x={400} y={40} textAnchor="middle" style={S.title}>Cone of Predictability</text>
      <text x={400} y={65} textAnchor="middle" style={S.subtitle}>Uncertainty expands with time Ã¢â‚¬â€ why we focus on the first 100 days</text>
      
      <polygon
        points={`${startX},${centerY} ${endX},${centerY - maxSpread} ${endX},${centerY + maxSpread}`}
        fill={T.lightGray}
        stroke={T.border}
        strokeWidth={1}
      />
      
      <rect x={startX} y={centerY - 35} width={180} height={70} rx={T.radius} fill={T.successBg} stroke={T.emerald} strokeWidth={2} />
      <text x={startX + 90} y={centerY - 8} textAnchor="middle" style={{ ...S.labelBold, fill: T.success }}>HIGH</text>
      <text x={startX + 90} y={centerY + 12} textAnchor="middle" style={{ ...S.labelBold, fill: T.success }}>PREDICTABILITY</text>
      
      <line x1={startX} y1={centerY} x2={endX} y2={centerY} stroke={T.navy} strokeWidth={2} strokeDasharray="6,4" />
      
      <line x1={startX} y1={centerY + 170} x2={endX} y2={centerY + 170} stroke={T.navy} strokeWidth={2} />
      <polygon points={`${endX},${centerY + 170} ${endX - 12},${centerY + 165} ${endX - 12},${centerY + 175}`} fill={T.navy} />
      <text x={startX} y={centerY + 195} style={S.labelSm}>Now</text>
      <text x={startX + 150} y={centerY + 195} style={{ ...S.labelBold, fill: T.emerald }}>100 Days</text>
      <text x={endX} y={centerY + 195} textAnchor="end" style={S.labelSm}>1 Year+</text>
      
      <g transform={`translate(${startX + 150}, ${centerY + 165})`}>
        <line x1={0} y1={0} x2={0} y2={-120} stroke={T.emerald} strokeWidth={2} />
        <rect x={-50} y={-145} width={100} height={24} rx={12} fill={T.emerald} />
        <text x={0} y={-129} textAnchor="middle" style={S.tag}>HLV FOCUS</text>
      </g>
      
      <text x={400} y={420} textAnchor="middle" style={S.caption}>Plan in detail for the near term; stay flexible for the long term</text>
    </svg>
  );
};

const StakeholderEcosystem = () => {
  const centerX = 400;
  const centerY = 320;
  const rings = [110, 200, 300];
  
  const stakeholders = [
    { ring: 1, angle: 0, label: 'Parent' },
    { ring: 1, angle: 120, label: 'Best Friend' },
    { ring: 1, angle: 240, label: 'Teacher' },
    { ring: 2, angle: 45, label: 'Coach' },
    { ring: 2, angle: 135, label: 'Classmates' },
    { ring: 2, angle: 225, label: 'Siblings' },
    { ring: 2, angle: 315, label: 'Counselor' },
    { ring: 3, angle: 30, label: 'Admin' },
    { ring: 3, angle: 90, label: 'Community' },
    { ring: 3, angle: 150, label: 'Online Friends' },
    { ring: 3, angle: 210, label: 'Extended Family' },
    { ring: 3, angle: 270, label: 'Employers' },
    { ring: 3, angle: 330, label: 'Healthcare' },
  ];
  
  const ringColors = [T.emerald, T.navy, T.gray];
  
  return (
    <svg viewBox="0 0 800 600" style={{ width: '100%', maxWidth: 800 }}>
      <text x={400} y={40} textAnchor="middle" style={S.title}>Stakeholder Ecosystem</text>
      <text x={400} y={65} textAnchor="middle" style={S.subtitle}>Map relationships by proximity and influence</text>
      
      {rings.map((r, i) => (
        <circle key={i} cx={centerX} cy={centerY} r={r} fill="none" stroke={T.border} strokeWidth={1} strokeDasharray={i === 0 ? "0" : "4,4"} />
      ))}
      
      <text x={centerX + rings[0] + 10} y={centerY - rings[0] + 10} style={{ ...S.caption, fill: T.gray }}>Ring 1: Closest</text>
      <text x={centerX + rings[1] + 10} y={centerY - rings[1] + 10} style={{ ...S.caption, fill: T.gray }}>Ring 2: Regular</text>
      <text x={centerX + rings[2] + 10} y={centerY - rings[2] + 10} style={{ ...S.caption, fill: T.gray }}>Ring 3: Broader</text>
      
      <circle cx={centerX} cy={centerY} r={45} fill={T.successBg} stroke={T.emerald} strokeWidth={3} />
      <text x={centerX} y={centerY - 8} textAnchor="middle" style={{ ...S.labelBold, fontSize: 13 }}>MAIN</text>
      <text x={centerX} y={centerY + 10} textAnchor="middle" style={{ ...S.labelBold, fontSize: 13 }}>STAKEHOLDER</text>
      
      {stakeholders.map((s, i) => {
        const r = rings[s.ring - 1];
        const rad = (s.angle * Math.PI) / 180;
        const x = centerX + r * Math.cos(rad);
        const y = centerY + r * Math.sin(rad);
        const color = ringColors[s.ring - 1];
        
        return (
          <g key={i}>
            <line x1={centerX} y1={centerY} x2={x} y2={y} stroke={T.border} strokeWidth={1} opacity={0.3} />
            <circle cx={x} cy={y} r={8} fill={color} />
            <text x={x} y={y + 22} textAnchor="middle" style={{ ...S.caption, fontSize: 10 }}>{s.label}</text>
          </g>
        );
      })}
      
      <text x={400} y={570} textAnchor="middle" style={S.caption}>Place your main stakeholder at center. Add surrounding stakeholders in rings by relationship strength.</text>
    </svg>
  );
};

// ============================================================================
// NEW DIAGRAMS - SIMPLIFIED VERSIONS
// ============================================================================

const JourneyVsRelationship = () => {
  // Simplified two-column comparison - no embedded mini diagrams
  const colWidth = 340;
  const leftX = 90;
  const rightX = 470;
  
  return (
    <svg viewBox="0 0 900 480" style={{ width: '100%', maxWidth: 900 }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>Journey vs Relationship Approach</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>Two methods for stakeholder analysis</text>
      
      {/* Left Column - Journey Driven */}
      <g transform={`translate(${leftX}, 95)`}>
        <rect x={0} y={0} width={colWidth} height={44} rx={T.radius} fill={T.navy} />
        <text x={colWidth/2} y={28} textAnchor="middle" style={S.heading}>Journey-Driven</text>
        
        <rect x={0} y={50} width={colWidth} height={280} rx={T.radius} fill={T.lightGray} stroke={T.border} strokeWidth={1} />
        
        <text x={20} y={82} style={S.labelBold}>Focus</text>
        <text x={20} y={102} style={S.labelSm}>Experience over time</text>
        
        <text x={20} y={135} style={S.labelBold}>Best For</text>
        <text x={20} y={155} style={S.labelSm}>Ã¢â‚¬Â¢ Clear progression or timeline</text>
        <text x={20} y={173} style={S.labelSm}>Ã¢â‚¬Â¢ Cycles or phases</text>
        <text x={20} y={191} style={S.labelSm}>Ã¢â‚¬Â¢ Before/during/after moments</text>
        
        <text x={20} y={224} style={S.labelBold}>Examples</text>
        <text x={20} y={244} style={S.labelSm}>Patient journey, funding rounds,</text>
        <text x={20} y={262} style={S.labelSm}>subscription lifecycle, disease progression</text>
        
        <rect x={colWidth - 55} y={290} width={45} height={24} rx={12} fill={T.gray} />
        <text x={colWidth - 32} y={306} textAnchor="middle" style={{ ...S.tag, fontSize: 10 }}>~20%</text>
      </g>
      
      {/* VS Divider */}
      <circle cx={450} cy={240} r={20} fill={T.border} />
      <text x={450} y={246} textAnchor="middle" style={{ ...S.labelBold, fontSize: 14 }}>vs</text>
      
      {/* Right Column - Relationship Driven (Preferred) */}
      <g transform={`translate(${rightX}, 95)`}>
        <rect x={0} y={0} width={colWidth} height={44} rx={T.radius} fill={T.emerald} />
        <text x={colWidth/2} y={28} textAnchor="middle" style={S.heading}>Relationship-Driven</text>
        
        <rect x={0} y={50} width={colWidth} height={280} rx={T.radius} fill={T.successBg} stroke={T.emerald} strokeWidth={2} />
        
        <text x={20} y={82} style={S.labelBold}>Focus</text>
        <text x={20} y={102} style={S.labelSm}>Ecosystem of connections</text>
        
        <text x={20} y={135} style={S.labelBold}>Best For</text>
        <text x={20} y={155} style={S.labelSm}>Ã¢â‚¬Â¢ Multiple stakeholder types</text>
        <text x={20} y={173} style={S.labelSm}>Ã¢â‚¬Â¢ Decision-making moments</text>
        <text x={20} y={191} style={S.labelSm}>Ã¢â‚¬Â¢ Repeating interactions</text>
        
        <text x={20} y={224} style={S.labelBold}>Examples</text>
        <text x={20} y={244} style={S.labelSm}>Student ecosystem, family dynamics,</text>
        <text x={20} y={262} style={S.labelSm}>workplace relationships, community networks</text>
        
        <rect x={colWidth - 80} y={290} width={70} height={24} rx={12} fill={T.emerald} />
        <text x={colWidth - 45} y={306} textAnchor="middle" style={{ ...S.tag, fontSize: 9 }}>PREFERRED</text>
      </g>
      
      <text x={450} y={450} textAnchor="middle" style={S.caption}>Most HLV problems are better suited to relationship mapping (~75% of cases)</text>
    </svg>
  );
};

const FourBehaviors = () => {
  // Four entrepreneurial behaviors in a cycle
  const centerX = 400;
  const centerY = 270;
  const radius = 130;
  
  const behaviors = [
    { angle: -90, label: 'Problem', sublabel: 'Identification', desc: 'Notice what\'s broken' },
    { angle: 0, label: 'Opportunity', sublabel: 'Recognition', desc: 'See the potential' },
    { angle: 90, label: 'Resource', sublabel: 'Acquisition', desc: 'Gather what you need' },
    { angle: 180, label: 'Value', sublabel: 'Creation', desc: 'Build something useful' },
  ];
  
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', maxWidth: 800 }}>
      <text x={400} y={40} textAnchor="middle" style={S.title}>Four Entrepreneurial Behaviors</text>
      <text x={400} y={65} textAnchor="middle" style={S.subtitle}>The iterative cycle of entrepreneurial thinking</text>
      
      {/* Connecting circle (dashed) */}
      <circle cx={centerX} cy={centerY} r={radius + 40} fill="none" stroke={T.border} strokeWidth={1} strokeDasharray="6,4" />
      
      {/* Center hub */}
      <circle cx={centerX} cy={centerY} r={45} fill={T.navy} />
      <text x={centerX} y={centerY - 6} textAnchor="middle" style={{ ...S.tag, fontSize: 9 }}>ITERATIVE</text>
      <text x={centerX} y={centerY + 8} textAnchor="middle" style={{ ...S.tag, fontSize: 9 }}>CYCLE</text>
      
      {/* Arrows between nodes */}
      {behaviors.map((b, i) => {
        const nextAngle = behaviors[(i + 1) % 4].angle;
        const startRad = (b.angle * Math.PI) / 180;
        const endRad = (nextAngle * Math.PI) / 180;
        
        const r = radius + 40;
        const x1 = centerX + (r - 10) * Math.cos(startRad + 0.3);
        const y1 = centerY + (r - 10) * Math.sin(startRad + 0.3);
        const x2 = centerX + (r - 10) * Math.cos(endRad - 0.3);
        const y2 = centerY + (r - 10) * Math.sin(endRad - 0.3);
        
        return (
          <g key={`arrow-${i}`}>
            <path
              d={`M ${x1} ${y1} A ${r - 10} ${r - 10} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={T.emerald}
              strokeWidth={3}
              markerEnd="url(#arrowhead)"
            />
          </g>
        );
      })}
      
      {/* Arrowhead marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={T.emerald} />
        </marker>
      </defs>
      
      {/* Behavior nodes */}
      {behaviors.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(rad);
        const y = centerY + radius * Math.sin(rad);
        const isTop = b.angle === -90;
        const isBottom = b.angle === 90;
        
        return (
          <g key={i}>
            {/* Node circle */}
            <circle cx={x} cy={y} r={35} fill={i % 2 === 0 ? T.navy : T.emerald} />
            <text x={x} y={y + 4} textAnchor="middle" style={{ ...S.tag, fontSize: 12 }}>{i + 1}</text>
            
            {/* Labels positioned outside */}
            <text 
              x={x} 
              y={isTop ? y - 50 : isBottom ? y + 55 : y - 45} 
              textAnchor="middle" 
              style={S.labelBold}
            >{b.label}</text>
            <text 
              x={x} 
              y={isTop ? y - 35 : isBottom ? y + 70 : y - 30} 
              textAnchor="middle" 
              style={S.labelBold}
            >{b.sublabel}</text>
            <text 
              x={x} 
              y={isTop ? y - 18 : isBottom ? y + 87 : y - 13} 
              textAnchor="middle" 
              style={S.labelSm}
            >{b.desc}</text>
          </g>
        );
      })}
      
      <text x={400} y={470} textAnchor="middle" style={S.caption}>These behaviors apply to anyone solving problems Ã¢â‚¬â€ not just "entrepreneurs"</text>
    </svg>
  );
};

const ThreeLevelsListening = () => {
  // Clean vertical layout with simple icons
  const levels = [
    { 
      num: 1, 
      title: 'Internal Listening', 
      subtitle: 'Self-focused',
      desc: 'Focused on your own thoughts, reactions, and what you\'ll say next',
      quality: 'Surface',
      bgColor: T.lightGray,
      borderColor: T.border,
      textColor: T.slate
    },
    { 
      num: 2, 
      title: 'Focused Listening', 
      subtitle: 'Content-focused',
      desc: 'Understanding the words, facts, and logical content being shared',
      quality: 'Active',
      bgColor: T.successBg,
      borderColor: T.emerald,
      textColor: T.slate
    },
    { 
      num: 3, 
      title: 'Global Listening', 
      subtitle: 'Whole-person focused',
      desc: 'Sensing what\'s unsaid Ã¢â‚¬â€ body language, tone, underlying needs, emotions',
      quality: 'Deep',
      bgColor: T.navy,
      borderColor: T.navy,
      textColor: T.white,
      highlight: true
    },
  ];
  
  const boxWidth = 580;
  const boxHeight = 90;
  const startX = 160;
  const startY = 100;
  const gap = 20;
  
  return (
    <svg viewBox="0 0 800 480" style={{ width: '100%', maxWidth: 800 }}>
      <text x={400} y={40} textAnchor="middle" style={S.title}>Three Levels of Listening</text>
      <text x={400} y={65} textAnchor="middle" style={S.subtitle}>Essential facilitation skill for deep understanding</text>
      
      {/* Depth indicator arrow on left */}
      <line x1={80} y1={startY + 30} x2={80} y2={startY + 3 * boxHeight + 2 * gap - 30} stroke={T.gray} strokeWidth={2} />
      <polygon points="80,100 74,115 86,115" fill={T.gray} />
      <polygon points={`80,${startY + 3 * boxHeight + 2 * gap - 10} 74,${startY + 3 * boxHeight + 2 * gap - 25} 86,${startY + 3 * boxHeight + 2 * gap - 25}`} fill={T.emerald} />
      <text x={80} y={95} textAnchor="middle" style={{ ...S.caption, fontSize: 10 }}>Shallow</text>
      <text x={80} y={startY + 3 * boxHeight + 2 * gap + 8} textAnchor="middle" style={{ ...S.caption, fontSize: 10, fill: T.emerald }}>Deep</text>
      
      {/* Level boxes */}
      {levels.map((level, i) => {
        const y = startY + i * (boxHeight + gap);
        
        return (
          <g key={i} transform={`translate(${startX}, ${y})`}>
            {/* Main box */}
            <rect 
              x={0} y={0} 
              width={boxWidth} height={boxHeight} 
              rx={T.radius} 
              fill={level.bgColor} 
              stroke={level.borderColor} 
              strokeWidth={level.highlight ? 2 : 1} 
            />
            
            {/* Level number */}
            <circle cx={45} cy={boxHeight/2} r={22} fill={level.highlight ? T.emerald : T.navy} />
            <text x={45} y={boxHeight/2 + 6} textAnchor="middle" style={{ ...S.tag, fontSize: 16 }}>{level.num}</text>
            
            {/* Title and subtitle */}
            <text x={85} y={32} style={{ ...S.labelBold, fontSize: 16, fill: level.highlight ? T.white : T.navy }}>{level.title}</text>
            <text x={85} y={52} style={{ ...S.labelSm, fill: level.highlight ? '#94A3B8' : T.gray }}>{level.subtitle}</text>
            
            {/* Description */}
            <text x={85} y={74} style={{ ...S.labelSm, fontSize: 11, fill: level.highlight ? '#CBD5E1' : T.gray }}>{level.desc}</text>
            
            {/* Quality badge */}
            <rect x={boxWidth - 75} y={boxHeight/2 - 12} width={60} height={24} rx={12} fill={level.highlight ? T.emerald : T.border} />
            <text x={boxWidth - 45} y={boxHeight/2 + 4} textAnchor="middle" style={{ ...S.tag, fontSize: 10, fill: level.highlight ? T.white : T.slate }}>{level.quality}</text>
          </g>
        );
      })}
      
      {/* Target indicator for Level 3 */}
      <g transform={`translate(${startX + boxWidth + 15}, ${startY + 2 * (boxHeight + gap) + boxHeight/2})`}>
        <text x={0} y={0} style={{ ...S.caption, fill: T.emerald }}>Ã¢â€ Â TARGET</text>
      </g>
      
      <text x={400} y={445} textAnchor="middle" style={S.caption}>Move from Level 1 Ã¢â€ â€™ Level 3 to truly understand stakeholder needs</text>
    </svg>
  );
};

// ============================================================================
// LESSON 5 DIAGRAMS - December 2025
// ============================================================================

const GoodProblemCriteria = () => {
  const criteria = [
    { num: 1, title: 'Personal or Interesting', desc: 'You genuinely care about this problem or find it fascinating', check: 'Would I work on this for free?', highlight: false },
    { num: 2, title: 'Specific', desc: 'Clear who has it, where, and when â€” not vague or too broad', check: 'Can I name actual people with this problem?', highlight: false },
    { num: 3, title: 'Deeply Felt', desc: 'It causes real frustration, pain, or cost â€” not just minor annoyance', check: 'Would someone pay or change behavior to solve this?', highlight: true },
    { num: 4, title: 'Happens Often', desc: 'Recurring problem, not a one-time event', check: 'Does this happen weekly or more?', highlight: false },
    { num: 5, title: 'Not Well-Solved', desc: 'Current solutions are inadequate, too expensive, or inaccessible', check: "Why haven't existing solutions fixed this?", highlight: false },
  ];
  
  const rowH = 95;
  const startY = 75;
  
  return (
    <svg viewBox="0 0 900 580" style={{ width: '100%', maxWidth: 900 }}>
      <text x={450} y={35} textAnchor="middle" style={S.title}>5 Criteria for a Good Problem</text>
      <text x={450} y={58} textAnchor="middle" style={S.subtitle}>Before reframing, check if your problem is worth solving</text>
      
      {criteria.map((c, i) => {
        const y = startY + i * rowH;
        const isKey = c.highlight;
        
        return (
          <g key={i} transform={`translate(40, ${y})`}>
            <rect x={0} y={0} width={820} height={85} rx={T.radius}
              fill={isKey ? T.successBg : T.lightGray}
              stroke={isKey ? T.emerald : T.border}
              strokeWidth={isKey ? 2 : 1} />
            
            <circle cx={45} cy={42} r={22} fill={isKey ? T.emerald : T.navy} />
            <text x={45} y={49} textAnchor="middle" style={{ ...S.tag, fontSize: 16 }}>{c.num}</text>
            
            <text x={85} y={32} style={{ ...S.labelBold, fontSize: 15 }}>{c.title}</text>
            {isKey && (
              <g transform="translate(290, 18)">
                <rect x={0} y={0} width={65} height={18} rx={9} fill={T.emerald} />
                <text x={32} y={13} textAnchor="middle" style={{ ...S.tag, fontSize: 9 }}>KEY TEST</text>
              </g>
            )}
            <text x={85} y={52} style={S.label}>{c.desc}</text>
            <text x={85} y={72} style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, fill: T.success, fontStyle: 'italic' }}>Self-check: {c.check}</text>
          </g>
        );
      })}
      
      <text x={450} y={560} textAnchor="middle" style={S.caption}>A problem that passes all 5 criteria is worth your time to solve</text>
    </svg>
  );
};

const ProblemOpportunityFlow = () => {
  const stages = [
    { x: 40, title: '1. RAW PROBLEM', color: T.gray, heading: 'Observation', sub: '"Something seems wrong"', example: '"Students seem stressed"' },
    { x: 285, title: '2. VALIDATED', color: T.navy, heading: 'Evidence-Based', sub: 'Passes 5 criteria + interviews', example: '"80% of seniors report..."' },
    { x: 530, title: '3. REFRAMED', color: T.navy, heading: 'Better Angle', sub: '6 lenses applied', example: '"They lack agency, not time"' },
  ];
  
  return (
    <svg viewBox="0 0 900 420" style={{ width: '100%', maxWidth: 900 }}>
      <defs>
        <marker id="arrowNav" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={T.navy} />
        </marker>
        <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={T.emerald} />
        </marker>
      </defs>
      
      <text x={450} y={35} textAnchor="middle" style={S.title}>Problem â†’ Opportunity Flow</text>
      <text x={450} y={58} textAnchor="middle" style={S.subtitle}>Transform validated problems into actionable opportunities</text>
      
      {stages.map((s, i) => (
        <g key={i} transform={`translate(${s.x}, 100)`}>
          <rect x={0} y={0} width={180} height={40} rx={T.radius} fill={s.color} />
          <text x={90} y={25} textAnchor="middle" style={{ ...S.heading, fontSize: 14 }}>{s.title}</text>
          <rect x={0} y={48} width={180} height={100} rx={T.radius} fill={T.lightGray} stroke={T.border} strokeWidth={1} />
          <text x={90} y={75} textAnchor="middle" style={S.labelBold}>{s.heading}</text>
          <text x={90} y={95} textAnchor="middle" style={S.labelSm}>{s.sub}</text>
          <text x={90} y={125} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 11, fontStyle: 'italic', fill: T.slate }}>{s.example}</text>
        </g>
      ))}
      
      <line x1={230} y1={170} x2={275} y2={170} stroke={T.navy} strokeWidth={2} markerEnd="url(#arrowNav)" />
      <line x1={475} y1={170} x2={520} y2={170} stroke={T.navy} strokeWidth={2} markerEnd="url(#arrowNav)" />
      <line x1={720} y1={170} x2={765} y2={170} stroke={T.emerald} strokeWidth={3} markerEnd="url(#arrowGreen)" />
      
      <g transform="translate(775, 85)">
        <rect x={0} y={0} width={110} height={170} rx={T.radius} fill={T.successBg} stroke={T.emerald} strokeWidth={2} />
        <rect x={0} y={0} width={110} height={40} rx={T.radius} fill={T.emerald} />
        <rect x={0} y={32} width={110} height={8} fill={T.emerald} />
        <text x={55} y={25} textAnchor="middle" style={{ ...S.heading, fontSize: 14 }}>OPPORTUNITY</text>
        <text x={55} y={70} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, fill: T.success }}>How might</text>
        <text x={55} y={86} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, fill: T.success }}>we...</text>
        <text x={55} y={115} textAnchor="middle" style={{ ...S.labelSm, fill: T.success }}>Actionable</text>
        <text x={55} y={130} textAnchor="middle" style={{ ...S.labelSm, fill: T.success }}>question that</text>
        <text x={55} y={145} textAnchor="middle" style={{ ...S.labelSm, fill: T.success }}>invites solutions</text>
      </g>
      
      {[
        { x: 40, label: 'Observation' },
        { x: 285, label: '5 Criteria + Interviews' },
        { x: 530, label: '6 Reframing Lenses' },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x}, 280)`}>
          <rect x={0} y={0} width={180} height={24} rx={4} fill="#E5E7EB" />
          <text x={90} y={16} textAnchor="middle" style={S.labelSm}>{p.label}</text>
        </g>
      ))}
      <g transform="translate(775, 280)">
        <rect x={0} y={0} width={110} height={24} rx={4} fill="#D1FAE5" />
        <text x={55} y={16} textAnchor="middle" style={{ ...S.labelSm, fill: T.success }}>HMW Format</text>
      </g>
      
      <rect x={40} y={330} width={845} height={60} rx={T.radius} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1} />
      <text x={60} y={355} style={S.labelBold}>Example:</text>
      <text x={140} y={355} style={{ fontFamily: T.font, fontSize: 11, fontStyle: 'italic', fill: T.slate }}>"Stressed students"</text>
      <text x={260} y={355} style={S.label}>â†’</text>
      <text x={280} y={355} style={{ fontFamily: T.font, fontSize: 11, fontStyle: 'italic', fill: T.slate }}>"80% seniors report anxiety"</text>
      <text x={470} y={355} style={S.label}>â†’</text>
      <text x={490} y={355} style={{ fontFamily: T.font, fontSize: 11, fontStyle: 'italic', fill: T.slate }}>"Lack agency over schedule"</text>
      <text x={665} y={355} style={S.label}>â†’</text>
      <text x={685} y={355} style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, fill: T.success }}>"HMW give students more control?"</text>
      
      <text x={450} y={410} textAnchor="middle" style={S.caption}>Each stage builds on the previous â€” don't skip steps</text>
    </svg>
  );
};

const SymptomVsRootCause = () => {
  const centerY = 200;
  
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', maxWidth: 800 }}>
      <text x={400} y={35} textAnchor="middle" style={S.title}>Symptom vs Root Cause</text>
      <text x={400} y={58} textAnchor="middle" style={S.subtitle}>Why reframing matters â€” treating symptoms doesn't solve problems</text>
      
      <line x1={100} y1={centerY} x2={700} y2={centerY} stroke="#3B82F6" strokeWidth={2} strokeDasharray="8,4" />
      <text x={720} y={centerY + 4} style={{ ...S.labelSm, fill: '#3B82F6' }}>Surface</text>
      
      <polygon points="400,90 500,200 300,200" fill="#E5E7EB" stroke={T.border} strokeWidth={1} />
      <text x={400} y={150} textAnchor="middle" style={S.labelBold}>SYMPTOM</text>
      <text x={400} y={170} textAnchor="middle" style={S.labelSm}>What you see first</text>
      
      <polygon points="400,200 550,450 250,450" fill={T.navy} stroke={T.navy} strokeWidth={1} />
      <text x={400} y={280} textAnchor="middle" style={{ ...S.heading, fontSize: 16 }}>ROOT CAUSE</text>
      <text x={400} y={305} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 12, fill: '#94A3B8' }}>The real problem beneath</text>
      <text x={400} y={330} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 11, fill: '#64748B' }}>Often hidden, systemic,</text>
      <text x={400} y={348} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 11, fill: '#64748B' }}>or uncomfortable to admit</text>
      
      <g transform="translate(40, 110)">
        <rect x={0} y={0} width={160} height={70} rx={T.radius} fill="#FEF2F2" stroke="#FECACA" strokeWidth={1} />
        <text x={80} y={25} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, fill: '#DC2626' }}>âœ— Treating Symptoms</text>
        <text x={80} y={45} textAnchor="middle" style={S.labelSm}>Quick fixes that don't last</text>
        <text x={80} y={60} textAnchor="middle" style={S.labelSm}>Problem keeps returning</text>
      </g>
      
      <g transform="translate(600, 300)">
        <rect x={0} y={0} width={160} height={70} rx={T.radius} fill={T.successBg} stroke="#A7F3D0" strokeWidth={1} />
        <text x={80} y={25} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, fill: T.success }}>âœ“ Solving Root Cause</text>
        <text x={80} y={45} textAnchor="middle" style={S.labelSm}>Lasting change</text>
        <text x={80} y={60} textAnchor="middle" style={S.labelSm}>Real impact created</text>
      </g>
      
      <path d="M 120 180 Q 180 160 280 155" fill="none" stroke="#DC2626" strokeWidth={2} strokeDasharray="4,3" />
      <path d="M 600 335 Q 500 340 450 360" fill="none" stroke={T.emerald} strokeWidth={2} />
      
      <rect x={60} y={420} width={680} height={55} rx={T.radius} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1} />
      <text x={80} y={442} style={S.labelBold}>Example:</text>
      <text x={155} y={442} style={{ fontFamily: T.font, fontSize: 11, fontStyle: 'italic', fill: T.slate }}>Symptom: "The elevator is too slow"</text>
      <text x={415} y={442} style={S.label}>â†’</text>
      <text x={435} y={442} style={{ fontFamily: T.font, fontSize: 11, fontStyle: 'italic', fill: T.slate }}>Root Cause: "People hate waiting"</text>
      <text x={80} y={462} style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, fill: '#DC2626' }}>âœ— Fix: Faster elevator ($$$)</text>
      <text x={435} y={462} style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, fill: T.success }}>âœ“ Fix: Add mirrors (cheap, works)</text>
      
      <text x={400} y={495} textAnchor="middle" style={S.caption}>Reframing helps you dive below the surface to find what's really worth solving</text>
    </svg>
  );
};

const GoodVsWeakProblems = () => {
  const comparisons = [
    { weak: { tag: 'GENERIC', problem: '"People waste food."', note: 'No personal connection â€” why do YOU care?' },
      good: { tag: 'PERSONAL', problem: '"My family throws away $50 of groceries weekly."', note: 'Connected to your life â€” motivation to persist' } },
    { weak: { tag: 'VAGUE', problem: '"Traffic is terrible."', note: 'Where? When? For whom? Too broad to solve' },
      good: { tag: 'SPECIFIC', problem: '"Parents at Lincoln Elementary wait 25 min in', problem2: 'pickup line daily because of single exit lane."' } },
    { weak: { tag: 'MILD', problem: '"It\'s annoying when my phone dies."', note: 'Minor inconvenience â€” won\'t pay to solve' },
      good: { tag: 'DEEPLY FELT', problem: '"Nurses miss family emergencies because', problem2: 'hospital policy blocks personal phones."' } },
    { weak: { tag: 'RARE', problem: '"I lost my luggage on a flight once."', note: 'Happened once â€” not worth building for' },
      good: { tag: 'FREQUENT', problem: '"Students forget homework assignments', problem2: '3-4 times per week across multiple classes."' } },
    { weak: { tag: 'SOLVED', problem: '"I need a way to order food online."', note: 'DoorDash, UberEats, etc. â€” already done well' },
      good: { tag: 'UNSOLVED', problem: '"Elderly patients can\'t track multiple', problem2: 'medications â€” existing apps are too complex."' } },
  ];
  
  const rowH = 85;
  const startY = 135;
  
  return (
    <svg viewBox="0 0 900 600" style={{ width: '100%', maxWidth: 900 }}>
      <text x={450} y={35} textAnchor="middle" style={S.title}>Good vs Weak Problems</text>
      <text x={450} y={58} textAnchor="middle" style={S.subtitle}>See the 5 criteria in action â€” before and after</text>
      
      <g transform="translate(60, 85)">
        <rect x={0} y={0} width={350} height={36} rx={6} fill="#FEE2E2" />
        <text x={175} y={24} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, fill: '#DC2626' }}>âœ— WEAK PROBLEMS</text>
      </g>
      <g transform="translate(490, 85)">
        <rect x={0} y={0} width={350} height={36} rx={6} fill="#D1FAE5" />
        <text x={175} y={24} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, fill: T.success }}>âœ“ GOOD PROBLEMS</text>
      </g>
      
      {comparisons.map((c, i) => {
        const y = startY + i * rowH;
        const weakTagW = c.weak.tag.length * 7 + 16;
        const goodTagW = c.good.tag.length * 7 + 16;
        return (
          <g key={i}>
            <g transform={`translate(60, ${y})`}>
              <rect x={0} y={0} width={350} height={75} rx={6} fill="#FEF2F2" stroke="#FECACA" strokeWidth={1} />
              <rect x={10} y={8} width={weakTagW} height={18} rx={4} fill="#DC2626" />
              <text x={10 + weakTagW / 2} y={20} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 9, fontWeight: 600, fill: T.white }}>{c.weak.tag}</text>
              <text x={15} y={45} style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, fill: T.slate }}>{c.weak.problem}</text>
              <text x={15} y={62} style={S.labelSm}>{c.weak.note}</text>
            </g>
            
            <g transform={`translate(490, ${y})`}>
              <rect x={0} y={0} width={350} height={75} rx={6} fill={T.successBg} stroke="#A7F3D0" strokeWidth={1} />
              <rect x={10} y={8} width={goodTagW} height={18} rx={4} fill={T.success} />
              <text x={10 + goodTagW / 2} y={20} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 9, fontWeight: 600, fill: T.white }}>{c.good.tag}</text>
              <text x={15} y={45} style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, fill: T.slate }}>{c.good.problem}</text>
              {c.good.problem2 && <text x={15} y={60} style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, fill: T.slate }}>{c.good.problem2}</text>}
              {c.good.note && <text x={15} y={62} style={S.labelSm}>{c.good.note}</text>}
            </g>
          </g>
        );
      })}
      
      <line x1={450} y1={125} x2={450} y2={560} stroke="#E5E7EB" strokeWidth={2} strokeDasharray="6,4" />
      
      <text x={450} y={590} textAnchor="middle" style={S.caption}>Transform weak problems into good ones by sharpening each criterion</text>
    </svg>
  );
};

// ============================================================================
// MVP TYPES
// ============================================================================
const MVPTypes = () => {
  const types = [
    { name: 'Concierge', desc: 'Deliver manually what will later be automated', example: 'Personal shopping service before algorithm', color: '#3B82F6' },
    { name: 'Wizard of Oz', desc: 'Human behind the curtain mimics the product', example: 'Human answers pretending to be chatbot', color: '#8B5CF6' },
    { name: 'Single-Feature', desc: 'Build only the one critical feature', example: 'Dropbox: just file sync, nothing else', color: '#F59E0B' },
    { name: 'Pre-Order', desc: 'Sell before building to test demand', example: 'Kickstarter campaign before production', color: '#EF4444' },
    { name: 'Piecemeal', desc: 'Combine existing tools to simulate product', example: 'Google Forms + Zapier + Airtable', color: '#10B981' },
    { name: 'Smoke Test', desc: 'Landing page to measure interest', example: 'Sign-up page before building anything', color: T.navy },
  ];
  
  return (
    <svg viewBox="0 0 900 600" style={{ width: '100%', maxWidth: 900, fontFamily: T.font }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>Six MVP Types</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>Choose the smallest experiment to test your riskiest assumption</text>
      
      {types.map((type, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 50 + col * 280;
        const y = 100 + row * 240;
        return (
          <g key={type.name}>
            <rect x={x} y={y} width={260} height={200} rx={8} fill={T.white} stroke={type.color} strokeWidth={2} />
            <rect x={x} y={y} width={260} height={44} rx={8} fill={type.color} />
            <rect x={x} y={y + 36} width={260} height={8} fill={type.color} />
            <text x={x + 130} y={y + 28} textAnchor="middle" style={{ ...S.heading, fontSize: 16 }}>{type.name}</text>
            <text x={x + 20} y={y + 70} style={S.labelBold} textAnchor="start">{type.desc.split(' ').slice(0, 4).join(' ')}</text>
            <text x={x + 20} y={y + 88} style={S.labelBold} textAnchor="start">{type.desc.split(' ').slice(4).join(' ')}</text>
            <rect x={x + 16} y={y + 110} width={228} height={70} rx={4} fill={T.lightGray} />
            <text x={x + 24} y={y + 130} style={{ ...S.caption, fontStyle: 'italic' }}>Example:</text>
            <text x={x + 24} y={y + 150} style={S.labelSm}>{type.example.split(' ').slice(0, 5).join(' ')}</text>
            <text x={x + 24} y={y + 166} style={S.labelSm}>{type.example.split(' ').slice(5).join(' ')}</text>
          </g>
        );
      })}
      
      <text x={450} y={575} textAnchor="middle" style={S.caption}>The best MVP is the one that tests your riskiest assumption with the least effort</text>
    </svg>
  );
};

// ============================================================================
// VERB + NOUN EXAMPLES
// ============================================================================
const VerbNounExamples = () => {
  const examples = [
    { verb: 'Watch', noun: 'Movies', product: 'Netflix', color: '#E50914' },
    { verb: 'Find', noun: 'Rides', product: 'Uber', color: '#000000' },
    { verb: 'Share', noun: 'Photos', product: 'Instagram', color: '#E1306C' },
    { verb: 'Send', noun: 'Money', product: 'Venmo', color: '#3D95CE' },
    { verb: 'Book', noun: 'Rooms', product: 'Airbnb', color: '#FF5A5F' },
    { verb: 'Order', noun: 'Food', product: 'DoorDash', color: '#FF3008' },
  ];
  
  return (
    <svg viewBox="0 0 900 520" style={{ width: '100%', maxWidth: 900, fontFamily: T.font }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>Verb + Noun</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>Define your product in two words: what action + what object</text>
      
      <rect x={280} y={100} width={340} height={80} rx={12} fill={T.navy} />
      <text x={450} y={130} textAnchor="middle" style={{ ...S.heading, fontSize: 14 }}>THE FORMULA</text>
      <text x={450} y={160} textAnchor="middle" style={{ ...S.heading, fontSize: 24 }}>[VERB] + [NOUN]</text>
      
      {examples.map((ex, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 70 + col * 270;
        const y = 220 + row * 130;
        return (
          <g key={ex.product}>
            <rect x={x} y={y} width={240} height={100} rx={8} fill={T.white} stroke={T.border} strokeWidth={1} />
            <rect x={x + 16} y={y + 16} width={80} height={32} rx={4} fill={T.emerald} />
            <text x={x + 56} y={y + 38} textAnchor="middle" style={{ ...S.tag, fontSize: 14 }}>{ex.verb}</text>
            <text x={x + 108} y={y + 38} textAnchor="middle" style={{ ...S.headingNavy, fontSize: 18 }}>+</text>
            <rect x={x + 120} y={y + 16} width={104} height={32} rx={4} fill={T.navy} />
            <text x={x + 172} y={y + 38} textAnchor="middle" style={{ ...S.tag, fontSize: 14 }}>{ex.noun}</text>
            <circle cx={x + 36} cy={y + 74} r={12} fill={ex.color} />
            <text x={x + 60} y={y + 78} style={S.labelSm}>{ex.product}</text>
          </g>
        );
      })}
      
      <rect x={280} y={460} width={340} height={40} rx={8} fill={T.successBg} stroke={T.emerald} strokeWidth={2} />
      <text x={450} y={486} textAnchor="middle" style={S.captionBold}>If you can't say it in two words, you don't know it yet</text>
    </svg>
  );
};

// ============================================================================
// LPP STRUCTURE (WHY-WHAT-HOW-WHEN)
// ============================================================================
const LPPStructure = () => {
  const sections = [
    { name: 'WHY', color: '#3B82F6', slides: ['Insight', 'Problem'], desc: 'The opportunity you discovered' },
    { name: 'WHAT', color: '#8B5CF6', slides: ['Introducing', 'What It Does', 'How It Works', 'What It Looks Like', 'What User Achieves'], desc: 'Your solution and value proposition' },
    { name: 'HOW', color: '#F59E0B', slides: ['Business Model', 'Market Opportunity', 'Revenue Projections', 'Competition', 'Expansion'], desc: 'Business viability and scale' },
    { name: 'WHEN', color: T.emerald, slides: ['MVP', 'Resources', 'Go-to-Market', 'Vision'], desc: 'Execution plan and timeline' },
  ];
  
  let slideNum = 1;
  
  return (
    <svg viewBox="0 0 900 600" style={{ width: '100%', maxWidth: 900, fontFamily: T.font }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>Lean Product Plan Structure</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>16-20 slides organized by the questions investors ask</text>
      
      {sections.map((sec, i) => {
        const y = 100 + i * 120;
        const startSlide = slideNum;
        slideNum += sec.slides.length;
        return (
          <g key={sec.name}>
            <rect x={40} y={y} width={80} height={90} rx={8} fill={sec.color} />
            <text x={80} y={y + 40} textAnchor="middle" style={{ ...S.heading, fontSize: 20 }}>{sec.name}</text>
            <text x={80} y={y + 60} textAnchor="middle" style={{ ...S.tag, fontSize: 10, opacity: 0.8 }}>{startSlide}-{startSlide + sec.slides.length - 1}</text>
            
            <text x={140} y={y + 20} style={S.labelSm}>{sec.desc}</text>
            
            <g transform={`translate(140, ${y + 35})`}>
              {sec.slides.map((slide, si) => (
                <g key={slide} transform={`translate(${si * 140}, 0)`}>
                  <rect x={0} y={0} width={130} height={45} rx={4} fill={T.white} stroke={sec.color} strokeWidth={1.5} />
                  <text x={65} y={28} textAnchor="middle" style={{ ...S.labelSm, fontSize: 10 }}>{slide}</text>
                </g>
              ))}
            </g>
          </g>
        );
      })}
      
      <g transform="translate(40, 545)">
        <rect x={0} y={0} width={820} height={40} rx={8} fill={T.lightGray} />
        <text x={410} y={25} textAnchor="middle" style={S.caption}>Each section answers a fundamental investor question — build the story in this order</text>
      </g>
    </svg>
  );
};

// ============================================================================
// JOURNEY MAP TEMPLATE
// ============================================================================
const JourneyMapTemplate = () => {
  const stages = ['Awareness', 'Consideration', 'Decision', 'Use', 'Advocacy'];
  const rows = [
    { label: 'Actions', desc: 'What does the stakeholder do?', icon: '→' },
    { label: 'Thinking', desc: 'What are they considering?', icon: '💭' },
    { label: 'Feeling', desc: 'What emotions arise?', icon: '♥' },
    { label: 'Pain Points', desc: 'What frustrates them?', icon: '⚡' },
    { label: 'Opportunities', desc: 'Where can we help?', icon: '★' },
  ];
  
  return (
    <svg viewBox="0 0 1000 600" style={{ width: '100%', maxWidth: 1000, fontFamily: T.font }}>
      <text x={500} y={40} textAnchor="middle" style={S.title}>Journey Map Template</text>
      <text x={500} y={65} textAnchor="middle" style={S.subtitle}>Map the stakeholder experience across key moments</text>
      
      <rect x={40} y={95} width={120} height={40} rx={4} fill={T.navy} />
      <text x={100} y={120} textAnchor="middle" style={S.heading}>STAGES →</text>
      
      {stages.map((stage, i) => (
        <g key={stage}>
          <rect x={170 + i * 160} y={95} width={150} height={40} rx={4} fill={T.navy} />
          <text x={245 + i * 160} y={120} textAnchor="middle" style={{ ...S.tag, fontSize: 12 }}>{stage}</text>
        </g>
      ))}
      
      {rows.map((row, ri) => {
        const y = 150 + ri * 85;
        const isHighlight = row.label === 'Pain Points' || row.label === 'Opportunities';
        return (
          <g key={row.label}>
            <rect x={40} y={y} width={120} height={75} rx={4} fill={isHighlight ? T.successBg : T.lightGray} stroke={isHighlight ? T.emerald : T.border} />
            <text x={100} y={y + 32} textAnchor="middle" style={S.labelBold}>{row.label}</text>
            <text x={100} y={y + 50} textAnchor="middle" style={{ ...S.caption, fontSize: 9 }}>{row.desc.split(' ').slice(0, 3).join(' ')}</text>
            <text x={100} y={y + 62} textAnchor="middle" style={{ ...S.caption, fontSize: 9 }}>{row.desc.split(' ').slice(3).join(' ')}</text>
            
            {stages.map((_, si) => (
              <rect key={si} x={170 + si * 160} y={y} width={150} height={75} rx={4} fill={T.white} stroke={T.border} strokeDasharray={isHighlight ? "0" : "4,2"} />
            ))}
          </g>
        );
      })}
      
      <g transform="translate(40, 560)">
        <rect x={0} y={0} width={920} height={30} rx={4} fill={T.lightGray} />
        <text x={460} y={20} textAnchor="middle" style={S.caption}>Fill in each cell with observations from stakeholder interviews — pain points and opportunities are where innovation happens</text>
      </g>
    </svg>
  );
};

// ============================================================================
// DIAGRAM REGISTRY
// ============================================================================

// ============================================================================
// ORID FRAMEWORK
// ============================================================================
const ORIDFramework = () => {
  const stages = [
    { letter: 'O', name: 'Objective', focus: 'Data, facts, sensory impressions', questions: ['What did you observe?', 'What words stood out?', 'What happened?'], color: '#3B82F6' },
    { letter: 'R', name: 'Reflective', focus: 'Personal reactions, emotions', questions: ['How did it make you feel?', 'What surprised you?', 'What does it remind you of?'], color: '#8B5CF6' },
    { letter: 'I', name: 'Interpretive', focus: 'Meaning, significance, implications', questions: ['What does this mean?', 'What are the key insights?', 'Why does this matter?'], color: '#F59E0B' },
    { letter: 'D', name: 'Decisional', focus: 'Next steps, actions, decisions', questions: ['What should we do?', 'What are our options?', 'What will you commit to?'], color: T.emerald }
  ];
  
  return (
    <svg viewBox="0 0 900 520" style={{ width: '100%', maxWidth: 900, fontFamily: T.font }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>ORID Framework</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>Focused Conversation Technique</text>
      
      {stages.map((stage, i) => {
        const y = 100 + i * 100;
        return (
          <g key={stage.letter}>
            <circle cx={70} cy={y + 30} r={32} fill={stage.color} />
            <text x={70} y={y + 40} textAnchor="middle" style={{ ...S.heading, fontSize: 28 }}>{stage.letter}</text>
            <text x={130} y={y + 20} style={{ ...S.headingNavy, fontSize: 18 }}>{stage.name}</text>
            <text x={130} y={y + 42} style={S.label}>{stage.focus}</text>
            <rect x={420} y={y} width={460} height={60} rx={8} fill={T.lightGray} stroke={stage.color} strokeWidth={2} />
            {stage.questions.map((q, qi) => (
              <text key={qi} x={440} y={y + 20 + qi * 18} style={S.labelSm}>â€¢ {q}</text>
            ))}
            {i < 3 && <line x1={70} y1={y + 62} x2={70} y2={y + 98} stroke={T.border} strokeWidth={2} />}
          </g>
        );
      })}
      <text x={450} y={505} textAnchor="middle" style={S.caption}>Move through all four stages to facilitate meaningful group reflection</text>
    </svg>
  );
};

// ============================================================================
// FOUR STEPS TO EPIPHANY
// ============================================================================
const FourStepsEpiphany = () => {
  const steps = [
    { num: 1, name: 'Customer Discovery', desc: 'Find who has the problem', phase: T.navy },
    { num: 2, name: 'Customer Validation', desc: 'Prove they will pay', phase: T.navy },
    { num: 3, name: 'Customer Creation', desc: 'Create end-user demand', phase: '#6366F1' },
    { num: 4, name: 'Company Building', desc: 'Scale the organization', phase: T.emerald }
  ];
  
  return (
    <svg viewBox="0 0 900 400" style={{ width: '100%', maxWidth: 900, fontFamily: T.font }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>Four Steps to the Epiphany</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>Steve Blank's Customer Development Process</text>
      
      <rect x={60} y={95} width={360} height={24} rx={4} fill={T.navy} />
      <text x={240} y={112} textAnchor="middle" style={{ ...S.tag, fontSize: 11 }}>PRODUCT/MARKET FIT</text>
      <rect x={440} y={95} width={170} height={24} rx={4} fill="#6366F1" />
      <text x={525} y={112} textAnchor="middle" style={{ ...S.tag, fontSize: 11 }}>MAXIMIZE PROFIT</text>
      <rect x={630} y={95} width={170} height={24} rx={4} fill={T.emerald} />
      <text x={715} y={112} textAnchor="middle" style={{ ...S.tag, fontSize: 11 }}>SCALE UP</text>
      
      {steps.map((step, i) => {
        const x = 80 + i * 190;
        return (
          <g key={step.num}>
            <rect x={x} y={140} width={170} height={140} rx={8} fill={T.white} stroke={step.phase} strokeWidth={2} />
            <circle cx={x + 85} cy={175} r={24} fill={step.phase} />
            <text x={x + 85} y={183} textAnchor="middle" style={{ ...S.heading, fontSize: 20 }}>{step.num}</text>
            <text x={x + 85} y={218} textAnchor="middle" style={S.labelBold}>{step.name.split(' ')[0]}</text>
            <text x={x + 85} y={236} textAnchor="middle" style={S.labelBold}>{step.name.split(' ')[1]}</text>
            <text x={x + 85} y={265} textAnchor="middle" style={S.labelSm}>{step.desc}</text>
          </g>
        );
      })}
      
      <path d="M 165 285 Q 165 330 260 330 Q 355 330 355 285" fill="none" stroke={T.navy} strokeWidth={2} strokeDasharray="4,3" />
      <text x={260} y={355} textAnchor="middle" style={{ ...S.caption, fill: T.navy }}>Iterate until validated</text>
      <text x={450} y={385} textAnchor="middle" style={S.caption}>From "The Four Steps to the Epiphany" by Steve Blank â€” Focus on the first 100 days</text>
    </svg>
  );
};

// ============================================================================
// INTERVIEW NOTE-TAKING GRID
// ============================================================================
const InterviewNoteGrid = () => {
  const columns = [
    { title: 'Needs / Goals', prompt: '"I need..."', color: '#3B82F6', hints: ['What are they trying to achieve?', 'What matters most?', 'What does success look like?'] },
    { title: 'Challenges / Pains', prompt: '"I can\'t because..."', color: '#EF4444', hints: ['What frustrates them?', 'What blocks their goals?', 'What takes too long?'] },
    { title: 'Bright Spots', prompt: '"I\'m happy when..."', color: T.emerald, hints: ["What's working today?", 'What do they enjoy?', 'What would they keep?'] }
  ];
  
  return (
    <svg viewBox="0 0 900 480" style={{ width: '100%', maxWidth: 900, fontFamily: T.font }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>Interview Note-Taking Grid</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>Capture stakeholder insights during empathy interviews</text>
      
      {columns.map((col, i) => {
        const x = 50 + i * 280;
        return (
          <g key={col.title}>
            <rect x={x} y={90} width={260} height={50} rx={8} fill={col.color} />
            <text x={x + 130} y={115} textAnchor="middle" style={S.heading}>{col.title}</text>
            <text x={x + 130} y={132} textAnchor="middle" style={{ ...S.tag, opacity: 0.9, fontSize: 10 }}>{col.prompt}</text>
            <rect x={x} y={145} width={260} height={260} rx={8} fill={T.white} stroke={col.color} strokeWidth={2} />
            {[0,1,2,3,4,5,6,7].map(line => (
              <line key={line} x1={x + 15} y1={175 + line * 30} x2={x + 245} y2={175 + line * 30} stroke="#E5E7EB" strokeWidth={1} />
            ))}
            {col.hints.map((hint, hi) => (
              <text key={hi} x={x + 20} y={195 + hi * 60} style={{ ...S.labelSm, fill: T.gray, fontStyle: 'italic', opacity: 0.6 }}>{hint}</text>
            ))}
          </g>
        );
      })}
      
      <rect x={50} y={420} width={800} height={45} rx={8} fill={T.lightGray} />
      <text x={450} y={445} textAnchor="middle" style={S.labelSm}>Tips: Use one post-it per insight â€¢ Listen for stories, not statistics â€¢ Capture exact quotes when possible</text>
    </svg>
  );
};

// ============================================================================
// AFFINITY MAPPING PROCESS
// ============================================================================
const AffinityMapping = () => {
  const steps = [
    { num: 1, title: 'Capture', desc: 'One insight per sticky', icon: 'ðŸ“' },
    { num: 2, title: 'Cluster', desc: 'Group related notes', icon: 'ðŸ”€' },
    { num: 3, title: 'Label', desc: 'Name each theme', icon: 'ðŸ·ï¸' },
    { num: 4, title: 'Prioritize', desc: 'Identify top insights', icon: 'â­' }
  ];
  
  return (
    <svg viewBox="0 0 900 500" style={{ width: '100%', maxWidth: 900, fontFamily: T.font }}>
      <text x={450} y={40} textAnchor="middle" style={S.title}>Affinity Mapping Process</text>
      <text x={450} y={65} textAnchor="middle" style={S.subtitle}>Synthesize interview data into actionable insights</text>
      
      {steps.map((step, i) => {
        const x = 70 + i * 205;
        return (
          <g key={step.num}>
            <rect x={x} y={100} width={180} height={120} rx={12} fill={T.white} stroke={T.navy} strokeWidth={2} />
            <circle cx={x + 25} cy={100} r={18} fill={T.navy} />
            <text x={x + 25} y={106} textAnchor="middle" style={{ ...S.tag, fontSize: 14 }}>{step.num}</text>
            <text x={x + 90} y={145} textAnchor="middle" style={{ fontSize: 32 }}>{step.icon}</text>
            <text x={x + 90} y={175} textAnchor="middle" style={S.labelBold}>{step.title}</text>
            <text x={x + 90} y={195} textAnchor="middle" style={S.labelSm}>{step.desc}</text>
            {i < 3 && (
              <g>
                <line x1={x + 185} y1={160} x2={x + 210} y2={160} stroke={T.emerald} strokeWidth={3} />
                <polygon points={`${x+210},155 ${x+225},160 ${x+210},165`} fill={T.emerald} />
              </g>
            )}
          </g>
        );
      })}
      
      <text x={450} y={260} textAnchor="middle" style={{ ...S.labelBold, fontSize: 13 }}>Example: From scattered notes to key learnings</text>
      
      <text x={180} y={295} textAnchor="middle" style={S.captionBold}>Before</text>
      <rect x={80} y={310} width={55} height={40} fill="#FEF3C7" stroke="#D1D5DB" transform="rotate(-8 107 330)" />
      <rect x={140} y={330} width={55} height={40} fill="#DBEAFE" stroke="#D1D5DB" transform="rotate(5 167 350)" />
      <rect x={100} y={360} width={55} height={40} fill="#FCE7F3" stroke="#D1D5DB" transform="rotate(-3 127 380)" />
      <rect x={170} y={345} width={55} height={40} fill="#FEF3C7" stroke="#D1D5DB" transform="rotate(10 197 365)" />
      <rect x={220} y={320} width={55} height={40} fill="#D1FAE5" stroke="#D1D5DB" transform="rotate(-5 247 340)" />
      
      <line x1={320} y1={350} x2={380} y2={350} stroke={T.navy} strokeWidth={3} />
      <polygon points="380,345 395,350 380,355" fill={T.navy} />
      
      <text x={600} y={295} textAnchor="middle" style={S.captionBold}>After</text>
      <rect x={420} y={310} width={120} height={90} rx={8} fill={T.lightGray} stroke={T.border} strokeDasharray="4,2" />
      <rect x={435} y={325} width={40} height={30} fill="#FEF3C7" stroke="#D1D5DB" />
      <rect x={480} y={330} width={40} height={30} fill="#FEF3C7" stroke="#D1D5DB" />
      <text x={480} y={415} textAnchor="middle" style={{ ...S.caption, fill: T.navy, fontWeight: 600 }}>Theme A</text>
      
      <rect x={560} y={310} width={120} height={90} rx={8} fill={T.lightGray} stroke={T.border} strokeDasharray="4,2" />
      <rect x={575} y={325} width={40} height={30} fill="#DBEAFE" stroke="#D1D5DB" />
      <rect x={620} y={330} width={40} height={30} fill="#DBEAFE" stroke="#D1D5DB" />
      <text x={620} y={415} textAnchor="middle" style={{ ...S.caption, fill: T.navy, fontWeight: 600 }}>Theme B</text>
      
      <rect x={700} y={310} width={120} height={90} rx={8} fill={T.lightGray} stroke={T.border} strokeDasharray="4,2" />
      <rect x={715} y={330} width={40} height={30} fill="#FCE7F3" stroke="#D1D5DB" />
      <rect x={760} y={330} width={40} height={30} fill="#D1FAE5" stroke="#D1D5DB" />
      <text x={760} y={415} textAnchor="middle" style={{ ...S.caption, fill: T.navy, fontWeight: 600 }}>Theme C</text>
      
      <rect x={420} y={435} width={400} height={50} rx={8} fill={T.successBg} stroke={T.success} strokeWidth={2} />
      <text x={620} y={457} textAnchor="middle" style={{ ...S.labelBold, fill: T.success }}>KEY LEARNING</text>
      <text x={620} y={475} textAnchor="middle" style={{ ...S.labelSm, fill: T.slate }}>Synthesized insight from clustered data</text>
    </svg>
  );
};

const DIAGRAMS = {
  'three-boxes': { name: 'Three Boxes of Innovation', usage: 'Introduces Box 3 thinking - finding new problems rather than improving existing solutions', viewBox: '0 0 800 400' },
  'build-measure-learn': { name: 'Build-Measure-Learn Loop', usage: 'Lean Startup cycle - emphasizes MVP and rapid iteration', viewBox: '0 0 600 520' },
  'double-diamond': { name: 'Double Diamond Process', usage: 'HLV opportunity identification flow from discovery to LPP', viewBox: '0 0 960 520' },
  'six-reframing': { name: 'Six Reframing Lenses', usage: 'Wedell-Wedellsborg framework for problem reframing', viewBox: '0 0 1000 700' },
  'eight-models': { name: '8 Business Models', usage: 'Revenue model overview for solution development', viewBox: '0 0 900 560' },
  'magic-bullet': { name: 'The Magic Bullet', usage: 'Three critical questions: Business Insights, Domain Expertise, Distribution', viewBox: '0 0 800 500' },
  'cone-predictability': { name: 'Cone of Predictability', usage: 'Illustrates how uncertainty expands over time - why we focus on first 100 days', viewBox: '0 0 800 450' },
  'stakeholder-ecosystem': { name: 'Stakeholder Ecosystem', usage: '3-ring concentric map for stakeholder relationships', viewBox: '0 0 800 600' },
  'journey-vs-relationship': { name: 'Journey vs Relationship', usage: 'Comparison of two stakeholder analysis approaches - when to use each', viewBox: '0 0 900 480' },
  'four-behaviors': { name: 'Four Entrepreneurial Behaviors', usage: 'The iterative cycle: Problem ID Ã¢â€ â€™ Opportunity Ã¢â€ â€™ Resources Ã¢â€ â€™ Value', viewBox: '0 0 800 500' },
  'three-levels-listening': { name: 'Three Levels of Listening', usage: 'Facilitation skill - Internal Ã¢â€ â€™ Focused Ã¢â€ â€™ Global listening', viewBox: '0 0 800 480' },
  'good-problem-criteria': { name: '5 Criteria for a Good Problem', usage: 'Evaluate whether a problem is worth solving before reframing', viewBox: '0 0 900 580' },
  'problem-opportunity-flow': { name: 'Problem â†’ Opportunity Flow', usage: 'Shows the 4-stage transformation from raw problem to HMW statement', viewBox: '0 0 900 420' },
  'symptom-vs-root-cause': { name: 'Symptom vs Root Cause', usage: 'Iceberg metaphor explaining why reframing matters', viewBox: '0 0 800 500' },
  'good-vs-weak-problems': { name: 'Good vs Weak Problems', usage: 'Side-by-side comparison showing the 5 criteria in action', viewBox: '0 0 900 600' },
  'orid-framework': { name: 'ORID Framework', usage: 'Focused conversation technique for facilitated group reflection', viewBox: '0 0 900 520' },
  'four-steps-epiphany': { name: 'Four Steps to Epiphany', usage: 'Steve Blank customer development - Discovery to Company Building', viewBox: '0 0 900 400' },
  'interview-note-grid': { name: 'Interview Note-Taking Grid', usage: 'Capture stakeholder insights: Needs, Challenges, Bright Spots', viewBox: '0 0 900 480' },
  'affinity-mapping': { name: 'Affinity Mapping Process', usage: 'Synthesize interview data into clustered themes and key learnings', viewBox: '0 0 900 500' },
  'mvp-types': { name: 'Six MVP Types', usage: 'Choose the smallest experiment to test your riskiest assumption', viewBox: '0 0 900 600' },
  'verb-noun': { name: 'Verb + Noun', usage: 'Define your product in two words: what action + what object', viewBox: '0 0 900 520' },
  'lpp-structure': { name: 'LPP Structure', usage: 'WHY-WHAT-HOW-WHEN framework for Lean Product Plan presentations', viewBox: '0 0 900 600' },
  'journey-map-template': { name: 'Journey Map Template', usage: 'Blank template for mapping stakeholder experience across stages', viewBox: '0 0 1000 600' },
};

const UPCOMING = [
  { name: 'Interview Flow Diagram', priority: 'P3' },
  { name: 'Team Agreement Questions', priority: 'P3' },
  { name: 'Pitch Deck Structure', priority: 'P3' },
];

// ============================================================================
// RENDERERS MAP Ã¢â‚¬â€ Must come AFTER all component definitions
// ============================================================================
const RENDERERS = {
  'three-boxes': ThreeBoxes,
  'build-measure-learn': BuildMeasureLearn,
  'double-diamond': DoubleDiamond,
  'six-reframing': SixReframing,
  'eight-models': EightModels,
  'magic-bullet': MagicBullet,
  'cone-predictability': ConePredictability,
  'stakeholder-ecosystem': StakeholderEcosystem,
  'journey-vs-relationship': JourneyVsRelationship,
  'four-behaviors': FourBehaviors,
  'three-levels-listening': ThreeLevelsListening,
  'good-problem-criteria': GoodProblemCriteria,
  'problem-opportunity-flow': ProblemOpportunityFlow,
  'symptom-vs-root-cause': SymptomVsRootCause,
  'good-vs-weak-problems': GoodVsWeakProblems,
  'orid-framework': ORIDFramework,
  'four-steps-epiphany': FourStepsEpiphany,
  'interview-note-grid': InterviewNoteGrid,
  'affinity-mapping': AffinityMapping,
  'mvp-types': MVPTypes,
  'verb-noun': VerbNounExamples,
  'lpp-structure': LPPStructure,
  'journey-map-template': JourneyMapTemplate,

};

// ============================================================================
// MAIN APP
// ============================================================================
export default function App() {
  const [tab, setTab] = useState('diagrams');
  const [selected, setSelected] = useState('three-boxes');
  const diagramKeys = Object.keys(DIAGRAMS);
  
  return (
    <div style={{ fontFamily: T.font, background: '#FAFAFA', minHeight: '100vh', padding: 20 }}>
      <div style={{ borderBottom: `2px solid ${T.navy}`, paddingBottom: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.navy, margin: 0 }}>HLV Asset Library</h1>
        <p style={{ fontSize: 12, color: T.gray, margin: '4px 0 0' }}>Design Tokens + Diagrams • v9.0</p>
      </div>
      
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['diagrams', 'tokens', 'upcoming'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: tab === t ? T.navy : T.lightGray,
            color: tab === t ? T.white : T.slate,
            fontWeight: 600, fontSize: 11, textTransform: 'capitalize'
          }}>{t === 'tokens' ? 'Design Tokens' : t}</button>
        ))}
      </div>
      
      {tab === 'diagrams' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginBottom: 20 }}>
            {diagramKeys.map(k => (
              <div key={k} onClick={() => setSelected(k)} style={{
                background: T.white, borderRadius: 8, padding: 14, cursor: 'pointer',
                border: selected === k ? `2px solid ${T.emerald}` : `1px solid ${T.border}`,
                boxShadow: selected === k ? `0 0 0 3px ${T.successBg}` : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: T.navy, margin: 0 }}>{DIAGRAMS[k].name}</h4>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, background: T.successBg, color: T.success, fontWeight: 600 }}>done</span>
                </div>
                <p style={{ fontSize: 11, color: T.gray, margin: 0, lineHeight: 1.4 }}>{DIAGRAMS[k].usage}</p>
              </div>
            ))}
          </div>
          
          <div style={{ background: T.white, borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>{DIAGRAMS[selected].name}</h3>
            <div style={{ background: T.lightGray, borderRadius: 8, padding: 20, display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
              {React.createElement(RENDERERS[selected])}
            </div>
          </div>
        </>
      )}
      
      {tab === 'tokens' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div style={{ background: T.white, borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>Colors</h3>
            {Object.entries(T).filter(([k,v]) => typeof v === 'string' && v.startsWith('#')).map(([k,v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 4, background: v, border: v === '#FFFFFF' ? `1px solid ${T.border}` : 'none', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.navy }}>{k}</div>
                  <div style={{ fontSize: 10, color: T.gray, fontFamily: 'monospace' }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ background: T.white, borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>Typography</h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.navy }}>Font Family</div>
              <div style={{ fontSize: 10, color: T.gray }}>Manrope</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.navy, marginBottom: 4 }}>Weights</div>
              {Object.entries(T.weights).map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                  <span style={{ fontWeight: v }}>{k}</span>
                  <span style={{ color: T.gray, fontFamily: 'monospace' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ background: T.white, borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>Spacing (8px base)</h3>
            {Object.entries(T.space).map(([k,v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: Math.min(v, 64), height: 14, background: T.emerald, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: T.slate }}>{k}: {v}px</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {tab === 'upcoming' && (
        <div style={{ background: T.white, borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>Diagrams To Build</h3>
          {UPCOMING.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: T.lightGray, borderRadius: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: T.navy }}>{d.name}</span>
              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, background: d.priority === 'P1' ? '#FEF3C7' : '#E5E7EB', color: d.priority === 'P1' ? '#92400E' : T.gray, fontWeight: 600 }}>{d.priority}</span>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: 24, paddingTop: 12, borderTop: `1px solid ${T.border}`, textAlign: 'center' }}>
        <p style={{ fontSize: 10, color: T.gray, margin: 0 }}>Hudson Lab Ventures Ã¢â‚¬Â¢ {diagramKeys.length} diagrams complete</p>
      </div>
    </div>
  );
}
