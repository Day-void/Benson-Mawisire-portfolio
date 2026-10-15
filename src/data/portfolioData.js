// All the copy for the portfolio lives here so you can edit text
// without touching any component.

export const profile = {
  name: 'Benson Mawisire',
  role: 'Digital Marketer',
  title: 'Digital Marketing Portfolio',
  tagline: 'Strategy. Creativity. Digital Growth.',
  location: 'Harare, Zimbabwe',
}

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'Concepts', href: '#concept' },
  { label: 'Strategy', href: '#strategy' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export const aboutParagraphs = [
  'I’m Benson Mawisire, a digital marketer based in Harare, Zimbabwe. I help businesses build visibility, attract the right audience, and grow through data-driven marketing.',
  'I combine strategy, content, and performance marketing to turn brand goals into measurable results.',
  'From social media and content to paid campaigns and analytics, I focus on what moves the needle.',
  'I’m passionate about clear messaging, strong brand presence, and marketing that drives real growth.',
]

export const aboutSignoff = 'Always learning. Always optimizing. Always delivering value.'

export const skills = [
  'Social Media Marketing',
  'Content Creation and Copywriting',
  'SEO and Answer Engine Optimisation',
  'Email Marketing',
  'Digital Advertising',
  'Data Analysis',
  'AI Prompt Engineering',
  'Marketing Strategy and Audience Research',
]

export const workflow = ['Research', 'Strategise', 'Create', 'Execute', 'Measure']

export const businessProject = {
  label: 'Business marketing project',
  headline: ['Making everyday', 'digital services'],
  accent: ['easier to', 'understand'],
  paragraphs: [
    'BensonDreams is my personal brand offering digital services that help individuals and small businesses grow with clarity and confidence.',
    'I developed a clear brand presence and content strategy that communicates value, builds trust, and drives action.',
    'From visual identity and messaging to content planning and promotion, every asset is designed to educate, engage, and convert.',
  ],
}

export const contentPlan = [
  { day: 'Mon', theme: 'Marketing Tips', goal: 'Educate' },
  { day: 'Tue', theme: 'Brand Building', goal: 'Inspire' },
  { day: 'Wed', theme: 'Service Spotlight', goal: 'Inform' },
  { day: 'Thu', theme: 'Client Wins', goal: 'Trust' },
  { day: 'Fri', theme: 'Digital Growth', goal: 'Educate' },
  { day: 'Sat', theme: 'Q&A Engagement', goal: 'Engage' },
  { day: 'Sun', theme: 'Motivation & Mindset', goal: 'Inspire' },
]

export const productConcept = {
  label: 'Product concept',
  headline: ['Exploring a more'],
  middle: 'convenient airtime',
  accent: 'purchase journey',
  paragraphs: [
    'Wevhu MobApp is a concept for a faster, simpler way to buy airtime. The journey is designed to reduce friction and get users from start to confirmation in just a few steps.',
    'A clean interface, smart defaults, and multiple payment options make the process intuitive and reliable.',
    'This concept focuses on user convenience, speed, and trust at every touchpoint.',
  ],
  badge: 'Concept only',
}

export const airtimeSteps = [
  {
    id: 'phone',
    title: 'Phone number',
    text: 'Enter the recipient’s mobile number.',
    screen: { icon: 'phone', prompt: 'Enter phone number', cta: 'Continue' },
  },
  {
    id: 'amount',
    title: 'Amount',
    text: 'Choose a preset or enter a custom amount.',
    screen: {
      icon: 'dollar',
      prompt: 'Select airtime amount',
      presets: ['$1', '$2', '$5', '$10', '$20', '$50'],
      cta: 'Continue',
    },
  },
  {
    id: 'confirm',
    title: 'Confirm amount',
    text: 'Review and confirm the airtime amount to proceed.',
    screen: { icon: 'pencil', prompt: 'Enter custom amount', cta: 'Continue' },
  },
  {
    id: 'payment',
    title: 'Payment',
    text: 'Select a payment method and complete the transaction.',
    screen: {
      icon: 'bank',
      prompt: 'Choose payment method',
      methods: ['Bank Transfer', 'EcoCash', 'Card Payment'],
      cta: 'Pay Now',
    },
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    text: 'Receive instant confirmation and receipt.',
    screen: { icon: 'check', prompt: 'Airtime purchased successfully', cta: 'Done' },
  },
]

export const demoPhoneNumber = '072 123 456'
export const demoAmount = '$15.00'

export const strategyExercise = {
  label: 'Digital marketing strategy exercise',
  headline: ['Turning a digital', 'services platform into'],
  accent: 'a clear marketing message',
  slogan: 'Turn your shop into a Xash Point.',
  paragraphs: [
    'Xash connects customers to digital services. Our strategy builds awareness, trust, and adoption by showing local value and making it easy for anyone to become a Xash Point.',
    'This exercise maps the plan from insight to impact, with clear choices across the SOSTAC framework and a simple audience-to-message path.',
  ],
  disclaimer:
    'This is a strategic concept developed as an exercise. It is not an official campaign or final execution.',
}

export const audienceFlow = [
  { title: 'Audience', text: 'Shop owners, customers, community advocates' },
  { title: 'Insight', text: 'People want fast, reliable services close to home.' },
  { title: 'Message', text: 'Turn your shop into a Xash Point and serve your community.' },
  { title: 'Result', text: 'More visibility. More trust. More Xash Points.' },
]

export const sostac = [
  { title: 'Situation', text: 'Understand the market, competitors, and customer needs.' },
  { title: 'Objectives', text: 'Increase awareness, drive sign-ups, and grow access to Xash Points.' },
  { title: 'Strategy', text: 'Position Xash as the easiest and best way to get digital services.' },
  { title: 'Tactics', text: 'Use targeted content, social, partnerships, and in-store activation.' },
  { title: 'Actions', text: 'Execute campaigns, train agents, and support.' },
  { title: 'Control', text: 'Track results, learn, and optimize for continuous growth.' },
]

export const creativeConcept = {
  brand: 'Xash',
  headline: 'Turn your shop into a Xash Point.',
  subline: 'Offer digital services. Earn more. Help your community.',
  points: ['Fast transactions', 'Trusted services', 'Local support'],
  footer: 'Powering digital life. Together.',
}

export const processSteps = [
  { title: 'Research', text: 'Understand the audience, business context and market opportunity.' },
  { title: 'Strategise', text: 'Define objectives, positioning, key messages and the intended audience.' },
  { title: 'Create', text: 'Develop relevant content, creative concepts and campaign materials.' },
  { title: 'Execute', text: 'Organise marketing activities around appropriate platforms and objectives.' },
  { title: 'Evaluate', text: 'Review available performance data and identify opportunities for improvement.' },
]

export const contact = {
  headline: ['Let’s build', 'something', 'meaningful.'],
  paragraphs: [
    'I’m interested in opportunities to contribute to digital marketing, content creation, campaign development and brand communication.',
    'Let’s turn ideas into purposeful digital growth.',
  ],
  email: 'mawisirebenson4@gmail.com',
  phone: '+263 718 616 304',
  phoneHref: '+263718616304',
  portfolio: 'https://vibrant-grow-showcase.lovable.app',
}
