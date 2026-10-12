/**
 * Single source of truth for company content.
 *
 * RULE: nothing in this file may be invented. Every entry traces to
 * `docs/brand-research.md`, which marks each fact [OBSERVED] or [UNVERIFIED].
 * Where a fact is unavailable it is left empty and the UI degrades honestly
 * rather than showing a placeholder.
 */

export const SITE = {
  name: 'Limited Spoon Wellness',
  shortName: 'Limited Spoon',
  /** [OBSERVED] logo lockup tagline on the Instagram profile image. */
  tagline: 'Nutritional & Dietetic Centre',
  /** [OBSERVED] bio line 1. */
  promise: 'Nourish. Transform. Thrive.',
  /**
   * [OBSERVED] bio line 5, only visible after expanding the bio. This is the
   * practice's own positioning in its own words, so it carries more weight
   * than anything written for the site.
   */
  stance: 'Wellness > quick fixes',
  description:
    'Limited Spoon Wellness is a nutritional and dietetic centre offering personalised nutrition care — from weight management and PCOS to diabetes, pre & post-natal, geriatric and cardiopulmonary nutrition.',
  url: 'https://limitedspoon.wellness',
  locale: 'en_IN',
} as const;

export const CONTACT = {
  /** [OBSERVED] The only contact channel actually published. */
  instagram: 'https://www.instagram.com/limitedspoon.wellness/',
  instagramHandle: '@limitedspoon.wellness',
  /**
   * [UNVERIFIED] The bio's single contact link redirects to
   * `https://gmail.com/` with no local part, and following that redirect
   * returns 302 to Instagram. No address, phone number, clinic address or
   * opening hours are published anywhere on the account — this was audited
   * exhaustively on 11 Oct 2026 (see docs/brand-research.md §3.4).
   *
   * Left empty deliberately: guessing an address would be fabricating a
   * contact detail. When empty, the enquiry form hands the message to the
   * clipboard and opens Instagram instead of failing silently.
   */
  email: '',
  /** [UNVERIFIED] No phone number or WhatsApp is published. */
  phone: '',
  /** [UNVERIFIED] No clinic address is published. */
  address: '',
  /** [UNVERIFIED] No opening hours are published. */
  hours: '',
} as const;

/** [OBSERVED] Shalini Selvakumar — clinical & wellness nutritionist, founder. */
export const FOUNDER = {
  name: 'Shalini Selvakumar',
  role: 'Clinical & Wellness Nutritionist',
  /** [INTERPRETATION] Not a credential claim; only the observed role is stated. */
  intro:
    'Shalini founded Limited Spoon Wellness on a simple observation: most nutrition advice fails because it is not specific to the person receiving it.',
} as const;

/**
 * [OBSERVED] Taken verbatim from the 24 Sep 2026 post caption. Nothing added.
 */
export const CARE_AREAS = [
  {
    id: 'weight-management',
    title: 'Weight management',
    summary:
      'A plan built around your routine, your preferences and your starting point — adjusted as your body and your week change.',
    focus: ['Sustainable pace', 'Habit formation', 'Realistic targets'],
  },
  {
    id: 'pcos',
    title: 'PCOS',
    summary:
      'Nutrition support that takes the whole picture into account, working alongside whatever clinical care you are already receiving.',
    focus: ['Consistent meals', 'Blood-sugar aware choices', 'Ongoing review'],
  },
  {
    id: 'diabetes',
    title: 'Diabetes',
    summary:
      'Food guidance that sits alongside your medical treatment rather than replacing it, focused on steady, repeatable eating patterns.',
    focus: ['Carb quality', 'Portion awareness', 'Medication-aware'],
  },
  {
    id: 'pre-post-natal',
    title: 'Pre & post-natal nutrition',
    summary:
      'Support through pregnancy and after — nutrition for recovery, for feeding, and for the demands that come with a new baby.',
    focus: ['Trimester-aware', 'Recovery support', 'Practical cooking'],
  },
  {
    id: 'geriatric',
    title: 'Geriatric nutrition',
    summary:
      'Food that respects appetite, chewing, digestion and independence — nourishment that is realistic for the person actually at the table.',
    focus: ['Appetite support', 'Texture & comfort', 'Adequate protein'],
  },
  {
    id: 'cardiopulmonary',
    title: 'Cardiopulmonary care',
    summary:
      'Dietary support alongside heart and lung care, with sodium, fat and fluid considered as part of your wider treatment.',
    focus: ['Sodium awareness', 'Heart-healthy fats', 'Breathable meals'],
  },
  {
    id: 'everyday-wellness',
    title: 'Everyday wellness',
    summary:
      'For when there is no single diagnosis — just a wish to eat better, feel steadier and hold onto the habits that work.',
    focus: ['Whole-plate balance', 'Label literacy', 'Small changes'],
  },
] as const;

/** [INTERPRETATION] Built from the observed approach in the feed captions. */
export const PRINCIPLES = [
  {
    title: 'No extreme changes',
    body: 'Plans that ask you to give up everything at once do not survive week two. This one is built to keep.',
  },
  {
    title: 'No unnecessary pressure',
    body: 'A missed day is not a failed plan. Progress here is measured in ordinary weeks, not perfect ones.',
  },
  {
    title: 'Consistency, one day at a time',
    body: 'The goal is a set of habits that stop feeling like a diet — which is the whole of the work.',
  },
] as const;

/**
 * [INTERPRETATION] Drawn from the observed educational voice. These are general
 * nutrition-literacy points, not promises of clinical outcomes, and they make
 * no claim about any individual result.
 */
export const EDUCATION = [
  {
    title: 'Start with protein',
    body: 'Protein is the part of a meal that tends to keep you satisfied the longest. A portion at breakfast often decides whether the morning is steady or you are looking for something by ten.',
  },
  {
    title: 'Colour is a shortcut',
    body: 'Different vegetables carry different nutrients. When a plate holds three colours rather than one, it is usually doing more than it looks like it is.',
  },
  {
    title: 'Thirst is not hunger',
    body: 'The two feel similar and often arrive together. A glass of water and ten minutes of waiting is a reasonable first move before deciding you are hungry.',
  },
  {
    title: 'Whole beats refined',
    body: 'Whole grains, whole pulses and whole fruit keep the fibre in. Refining usually takes it out, and fibre is what keeps the rest of the meal working.',
  },
] as const;

/**
 * [INTERPRETATION] Decorative illustration set per area. These are general
 * food categories chosen to give the list visual variety — they are not an
 * ingredient list, not a product line, and not a claim that any of these foods
 * treats the condition named alongside it. The copy stays the only source of
 * meaning; the marks are `aria-hidden`.
 */
export const CARE_ART: Record<string, Array<'apple' | 'citrus' | 'greens' | 'berries' | 'avocado' | 'root' | 'grain'>> = {
  'weight-management': ['greens', 'apple'],
  pcos: ['citrus', 'greens'],
  diabetes: ['root', 'greens'],
  'pre-post-natal': ['berries', 'avocado'],
  geriatric: ['citrus', 'grain'],
  cardiopulmonary: ['berries', 'greens'],
  'everyday-wellness': ['avocado', 'apple', 'grain'],
};

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/approach', label: 'Approach' },
  { to: '/care', label: 'Areas of care' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const;