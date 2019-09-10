export const FIND_STEP_BRAND = 'brand';
export const FIND_STEP_MODEL = 'model';
export const FIND_STEP_TRIM = 'trim';
export const FIND_STEP_COLOR = 'color-selection';
export const FIND_STEP_SPEC = 'spec';
export const FIND_STEP_REVIEW = 'review';
export const FIND_STEP_SEARCH_RESULT = 'search-result';
export const FIND_STEP_REVIEW_INFO = 'review-info';
export const FIND_STEP_THANKS = 'thank-you';
export const FIND_STEP_CREDIT = 'credit-assessment';

export const FIND_STEPS = {
  brand: FIND_STEP_BRAND,
  model: FIND_STEP_MODEL,
  trim: FIND_STEP_TRIM,
  color: FIND_STEP_COLOR,
  spec: FIND_STEP_SPEC,
  review: FIND_STEP_REVIEW,
  searchResult: FIND_STEP_SEARCH_RESULT,
  reviewInfo: FIND_STEP_REVIEW_INFO,
  thankyou: FIND_STEP_THANKS,
  credit: FIND_STEP_CREDIT,
};

export const OWN_CAR = [
  { id: 0, label: 'I Own My Car' },
  { id: 1, label: 'I Lease My Car' },
  { id: 2, label: `I Don't Have a Car` },
];

export const WILL_TRADE = [
  { id: 0, label: 'Yes' },
  { id: 1, label: 'No' },
  { id: 2, label: 'Not Sure' },
];

export const STEPS_BLOCK_LIST = [
  { id: 0, step: FIND_STEP_BRAND, label: 'brand' },
  { id: 1, step: FIND_STEP_MODEL, label: 'model' },
  { id: 2, step: FIND_STEP_TRIM, label: 'trim' },
  { id: 3, step: FIND_STEP_COLOR, label: 'color' },
  { id: 4, step: FIND_STEP_SPEC, label: 'specs' },
];

export const DEFAULT_IMAGE_FUEL_ID = 12;

export const BUYING_METHOD_LIST = [
  { id: 0, label: 'Finance' },
  { id: 1, label: 'Lease' },
  { id: 2, label: 'Not Sure' },
];

export const BUYING_TIME_LIST = [
  { id: 0, label: 'ASAP' },
  { id: 1, label: 'This Month' },
  { id: 2, label: 'Over a Month' },
];

export const CREDIT_ASSESSMENT_LIST = [
  {
    id: 0,
    label: 'Excellent',
    score: '720-850',
    description:
      'You have established your credit and have never been sent to a collections department.',
  },
  {
    id: 1,
    label: 'Good',
    score: '690-719',
    description:
      'You have established your credit with a few late payments or you are currently working on building your credit.',
  },
  {
    id: 2,
    label: 'Fair',
    score: '630-689',
    description:
      'You do not have established credit and you are currently working on building.',
  },
  {
    id: 3,
    label: 'Poor',
    score: 'Under 630',
    description:
      'You may need some extra help qualify and might be required to pay a higher interest rate.',
  },
];

export const FAQ = [
  {
    id: 1,
    question: 'What is CarBlip?',
    answer:
      'CarBlip is the first car concierge service of its kind that provides customers with a completely personalized car buying experience without ever having to visit a dealership. Through a mobile-based app, customers are able to build their car and submit the request to CarBlip who will locate and secure the vehicle on behalf of the customer. A CarBlip representative will assist them throughout the entire buying process – from price negotiation and paperwork to final delivery. CarBlip’s goal is to alleviate most, if not all, of the pain points that consumers often experience in the car buying process.',
  },
  {
    id: 2,
    question: 'How is CarBlip different than other car buying apps?',
    answer:
      'CarBlip is the first car concierge app that allows customers to skip the dealership entirely. Unlike other car buying apps, CarBlip works directly with dealers to secure a car on behalf of its customers. Users will be able to manage and view the entire process of their transaction from start to finish all within the app.',
  },
  {
    id: 3,
    question: 'Will CarBlip pass my information to a bunch of dealerships?',
    answer:
      'No! This is why we created CarBlip. Your information will only be passed to the dealership on record once you select your car. Each of our customers receives the utmost attention from our team and we don’t ever want you to feel pressure to buy a car – from us or anyone else. We are focused on providing you with the best experience possible.',
  },
  {
    id: 4,
    question: "What is CarBlip's?",
    answer:
      'Due to DMV regulations, you cannot return a car. If a customer orders the wrong car, CarBlip will work to rectify the situation on a case by case basis.',
  },
  {
    id: 5,
    question: 'Is there an additional fee for using CarBlip?',
    answer: 'Nothing. Using our service is absolutely free to consumers.',
  },
];
// limit colors of color-selection page
export const LIMIT_COLORS = 3;
