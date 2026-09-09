export const SIZES = ['S', 'M', 'L', 'XL', '2XL']
export const BOXING_GLOVE_SIZES = ['8 oz', '10 oz', '12 oz', '14 oz', '16 oz', '18 oz']
export const MMA_GLOVE_SIZES = ['S', 'M', 'L', 'XL']
export const APPAREL_SIZES = ['S', 'M', 'L', 'XL', '2XL']
export const PROTECTIVE_GEAR_SIZES = ['M', 'L', 'XL']

export function sizesLabel(sizes) {
  if (!sizes || typeof sizes !== 'object') return null
  const parts = Object.entries(sizes).filter(([, n]) => Number(n) > 0)
  return parts.length ? parts.map(([size, n]) => `${size}: ${n}`).join(' · ') : null
}

export function detectSizingCategory(product) {
  if (!product) return 'apparel_tops'
  const title = (product.title || product.name || '').toLowerCase()
  const cat = (product.category || product.sport || '').toLowerCase()

  if (title.includes('boxing glove') || title.includes('gloves') || cat.includes('boxing')) {
    if (title.includes('mma') || title.includes('grappling')) {
      return 'mma_gloves'
    }
    return 'boxing_gloves'
  }
  if (title.includes('mma') || title.includes('grappling')) {
    return 'mma_gloves'
  }
  if (title.includes('short') || title.includes('pant') || title.includes('spat') || title.includes('trunk') || title.includes('bottom')) {
    return 'apparel_bottoms'
  }
  if (title.includes('shin') || title.includes('headgear') || title.includes('guard') || title.includes('pad') || title.includes('protective')) {
    return 'protective_gear'
  }
  return 'apparel_tops'
}

export function getProductSizes(product) {
  if (Array.isArray(product?.sizes) && product.sizes.length > 0) {
    return product.sizes
  }
  const category = detectSizingCategory(product)
  switch (category) {
    case 'boxing_gloves':
      return BOXING_GLOVE_SIZES
    case 'mma_gloves':
      return MMA_GLOVE_SIZES
    case 'apparel_bottoms':
      return APPAREL_SIZES
    case 'protective_gear':
      return PROTECTIVE_GEAR_SIZES
    case 'apparel_tops':
    default:
      return APPAREL_SIZES
  }
}

export const SIZE_FRAMEWORKS = [
  {
    id: 'boxing_gloves',
    title: 'Boxing & Combat Gloves',
    subtitle: 'Sized by weight (oz) based on body weight and training purpose',
    headers: ['Size (Weight)', 'User Weight', 'Hand Circumference (Knuckles)', 'Primary Purpose'],
    rows: [
      { size: '8 oz – 10 oz', weight: 'Under 120 lbs (< 54 kg)', knuckles: '6.5″ – 7.5″', purpose: 'Pro fight / Competition / Speed bag' },
      { size: '12 oz', weight: '120 – 150 lbs (54 – 68 kg)', knuckles: '7.5″ – 8.0″', purpose: 'Mitt work, bag work, light training' },
      { size: '14 oz', weight: '150 – 175 lbs (68 – 79 kg)', knuckles: '8.0″ – 8.5″', purpose: 'All-around training, light sparring' },
      { size: '16 oz', weight: '175 – 200+ lbs (79 – 90+ kg)', knuckles: '8.5″ – 9.5″', purpose: 'Standard gym sparring & heavy bag' },
      { size: '18 oz', weight: '200+ lbs (90+ kg)', knuckles: '9.5″+', purpose: 'Heavyweight sparring, extra protection' },
    ],
  },
  {
    id: 'mma_gloves',
    title: 'MMA & Grappling Gloves',
    subtitle: 'Graded by knuckle circumference and hand length (S to XL)',
    headers: ['Size', 'Palm / Knuckle Circumference', 'Hand Length (Wrist to Middle Finger)'],
    rows: [
      { size: 'S', knuckles: '6.5″ – 7.5″ (16.5 – 19.0 cm)', length: 'Under 7.0″ (17.8 cm)' },
      { size: 'M', knuckles: '7.5″ – 8.5″ (19.0 – 21.5 cm)', length: '7.0″ – 7.5″ (17.8 – 19.0 cm)' },
      { size: 'L', knuckles: '8.5″ – 9.5″ (21.5 – 24.0 cm)', length: '7.5″ – 8.0″ (19.0 – 20.3 cm)' },
      { size: 'XL', knuckles: '9.5″+ (24.0+ cm)', length: '8.0″+ (20.3+ cm)' },
    ],
  },
  {
    id: 'apparel_tops',
    title: 'Apparel Tops (Rashguards, Shirts & Hoodies)',
    subtitle: 'Graded by chest width, body length, and recommended body weight',
    headers: ['Size', 'Chest Width', 'Body Length', 'Recommended Weight'],
    rows: [
      { size: 'S', width: '36″ – 38″ (91 – 96 cm)', length: '26″ – 27″', weight: '55 – 68 kg' },
      { size: 'M', width: '39″ – 41″ (99 – 104 cm)', length: '27″ – 28″', weight: '68 – 80 kg' },
      { size: 'L', width: '42″ – 44″ (106 – 112 cm)', length: '28″ – 29″', weight: '80 – 92 kg' },
      { size: 'XL', width: '45″ – 47″ (114 – 119 cm)', length: '29″ – 30″', weight: '92 – 105 kg' },
      { size: '2XL', width: '48″ – 50″ (122 – 127 cm)', length: '30″ – 31″', weight: '105+ kg' },
    ],
  },
  {
    id: 'apparel_bottoms',
    title: 'Apparel Bottoms (Shorts, Fight Shorts & Spats)',
    subtitle: 'Sized by waist circumference and outseam length',
    headers: ['Size', 'Waist (Inches)', 'Waist (cm)', 'Outseam Length'],
    rows: [
      { size: 'S', waistInch: '28″ – 30″', waistCm: '71 – 76 cm', outseam: '17″' },
      { size: 'M', waistInch: '31″ – 33″', waistCm: '78 – 84 cm', outseam: '18″' },
      { size: 'L', waistInch: '34″ – 36″', waistCm: '86 – 91 cm', outseam: '19″' },
      { size: 'XL', waistInch: '37″ – 39″', waistCm: '94 – 99 cm', outseam: '20″' },
      { size: '2XL', waistInch: '40″ – 42″', waistCm: '101 – 107 cm', outseam: '20.5″' },
    ],
  },
  {
    id: 'protective_gear',
    title: 'Protective Gear (Shin Guards & Headgear)',
    subtitle: 'Sized by shin length, user height, and head circumference',
    headers: ['Item / Size', 'Shin Length / Head Circumference', 'Recommended User Height / Spec'],
    rows: [
      { size: 'Shin Guard - M', spec: 'Shin length 13″ – 14″', height: 'User height: 5\'4″ – 5\'9″' },
      { size: 'Shin Guard - L', spec: 'Shin length 14″ – 15″', height: 'User height: 5\'10″ – 6\'2″' },
      { size: 'Shin Guard - XL', spec: 'Shin length 15.5″+', height: 'User height: 6\'2″+' },
      { size: 'Headgear - M', spec: 'Head circumference 21″ – 22.5″', height: '53 – 57 cm' },
      { size: 'Headgear - L', spec: 'Head circumference 22.5″ – 24″', height: '57 – 61 cm' },
      { size: 'Headgear - XL', spec: 'Head circumference 24″+', height: '61+ cm' },
    ],
  },
]
