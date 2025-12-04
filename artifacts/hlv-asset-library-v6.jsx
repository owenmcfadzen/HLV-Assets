import React, { useState } from 'react';

// ============================================================================
// HLV DESIGN TOKENS â€” Single source of truth
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
// DIAGRAM COMPONENTS â€” All defined before RENDERERS
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
    { name: 'Product Sale', icon: 'ðŸ“¦', desc: 'One-time purchase' },
    { name: 'Subscription', icon: 'ðŸ”„', desc: 'Recurring payments' },
    { name: 'Freemium', icon: 'ðŸŽ', desc: 'Free + premium tiers' },
    { name: 'Marketplace', icon: 'ðŸª', desc: 'Connect buyers & sellers' },
    { name: 'Advertising', icon: 'ðŸ“¢', desc: 'Attention monetization' },
    { name: 'Data/API', icon: 'ðŸ“Š', desc: 'Information as product' },
    { name: 'Licensing', icon: 'ðŸ“œ', desc: 'Usage rights' },
    { name: 'Service', icon: 'ðŸ› ï¸', desc: 'Expertise delivery' },
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
      <text x={400} y={65} textAnchor="middle" style={S.subtitle}>Uncertainty expands with time â€” why we focus on the first 100 days</text>
      
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
        <text x={20} y={155} style={S.labelSm}>â€¢ Clear progression or timeline</text>
        <text x={20} y={173} style={S.labelSm}>â€¢ Cycles or phases</text>
        <text x={20} y={191} style={S.labelSm}>â€¢ Before/during/after moments</text>
        
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
        <text x={20} y={155} style={S.labelSm}>â€¢ Multiple stakeholder types</text>
        <text x={20} y={173} style={S.labelSm}>â€¢ Decision-making moments</text>
        <text x={20} y={191} style={S.labelSm}>â€¢ Repeating interactions</text>
        
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
      
      <text x={400} y={470} textAnchor="middle" style={S.caption}>These behaviors apply to anyone solving problems â€” not just "entrepreneurs"</text>
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
      desc: 'Sensing what\'s unsaid â€” body language, tone, underlying needs, emotions',
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
        <text x={0} y={0} style={{ ...S.caption, fill: T.emerald }}>â† TARGET</text>
      </g>
      
      <text x={400} y={445} textAnchor="middle" style={S.caption}>Move from Level 1 â†’ Level 3 to truly understand stakeholder needs</text>
    </svg>
  );
};

// ============================================================================
// DIAGRAM REGISTRY
// ============================================================================
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
  'four-behaviors': { name: 'Four Entrepreneurial Behaviors', usage: 'The iterative cycle: Problem ID â†’ Opportunity â†’ Resources â†’ Value', viewBox: '0 0 800 500' },
  'three-levels-listening': { name: 'Three Levels of Listening', usage: 'Facilitation skill - Internal â†’ Focused â†’ Global listening', viewBox: '0 0 800 480' },
};

const UPCOMING = [
  { name: 'ORID Framework', priority: 'P2' },
  { name: 'Specific Target Behavior (Verb+Noun)', priority: 'P2' },
  { name: 'Four Steps to Epiphany', priority: 'P3' },
  { name: 'Interview Flow Diagram', priority: 'P3' },
];

// ============================================================================
// RENDERERS MAP â€” Must come AFTER all component definitions
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
        <p style={{ fontSize: 12, color: T.gray, margin: '4px 0 0' }}>Design Tokens + Diagrams â€¢ v6.0</p>
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
        <p style={{ fontSize: 10, color: T.gray, margin: 0 }}>Hudson Lab Ventures â€¢ {diagramKeys.length} diagrams complete</p>
      </div>
    </div>
  );
}
