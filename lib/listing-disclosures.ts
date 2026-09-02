export type ConditionQuestion = {
  id: string;
  label: string;
  options: string[];
};

export type ConditionQuestionGroup = {
  category: string;
  questions: ConditionQuestion[];
};

export const conditionQuestionGroups: ConditionQuestionGroup[] = [
  {
    category: 'Accidents',
    questions: [
      {
        id: 'accident_history',
        label: 'Has the vehicle ever been in an accident?',
        options: ['No', 'Yes', 'Not sure'],
      },
    ],
  },
  {
    category: 'Flood and frame',
    questions: [
      {
        id: 'frame_damage',
        label: 'Does the vehicle have any frame damage?',
        options: ['No', 'Yes', 'Not sure'],
      },
      {
        id: 'flood_damage',
        label: 'Does the vehicle have any flood damage?',
        options: ['No', 'Yes', 'Not sure'],
      },
    ],
  },
  {
    category: 'Interior',
    questions: [
      {
        id: 'smoked_in',
        label: 'Has this vehicle been smoked in?',
        options: ['No', 'Yes', 'Not sure'],
      },
      {
        id: 'interior_inoperable',
        label: 'Are any interior parts broken or inoperable?',
        options: ['No', 'Yes'],
      },
      {
        id: 'interior_damage',
        label: 'Are there any rips, tears, or stains?',
        options: ['No', 'Yes'],
      },
    ],
  },
  {
    category: 'Mechanical',
    questions: [
      {
        id: 'starts_drives',
        label: 'Does the vehicle start and drive?',
        options: ['Starts and drives', 'Starts, does not drive', 'Does not start'],
      },
      {
        id: 'warning_lights',
        label: 'Are there mechanical issues or warning lights?',
        options: ['No', 'Yes'],
      },
      {
        id: 'odometer_replaced',
        label: 'Has the odometer ever been broken or replaced?',
        options: ['No', 'Yes', 'Not sure'],
      },
      {
        id: 'fluid_leaks',
        label: 'Are there any fluid leaks?',
        options: ['No', 'Yes', 'Not sure'],
      },
    ],
  },
  {
    category: 'Exterior',
    questions: [
      {
        id: 'paint_bodywork',
        label: 'Do any panels need paint or body work?',
        options: ['No', 'Yes'],
      },
      {
        id: 'rust_hail',
        label: 'Is there major rust or hail damage?',
        options: ['No', 'Yes'],
      },
      {
        id: 'windshield',
        label: 'Does the windshield need replacement?',
        options: ['No', 'Yes'],
      },
      {
        id: 'fire_damage',
        label: 'Has there ever been fire damage?',
        options: ['No', 'Yes', 'Not sure'],
      },
    ],
  },
  {
    category: 'Tires and wheels',
    questions: [
      {
        id: 'tires_replace',
        label: 'Do any tires need replacement?',
        options: ['No', 'Yes', 'Not sure'],
      },
      {
        id: 'wheel_issues',
        label: 'Are any wheels damaged or missing parts?',
        options: ['No', 'Yes'],
      },
    ],
  },
  {
    category: 'Keys and modifications',
    questions: [
      {
        id: 'key_count',
        label: 'How many keys are included?',
        options: ['2 or more', '1', 'No keys'],
      },
      {
        id: 'modifications',
        label: 'Does the vehicle have aftermarket modifications?',
        options: ['No', 'Yes'],
      },
      {
        id: 'other_issues',
        label: 'Are there any other issues a buyer should know?',
        options: ['No', 'Yes'],
      },
    ],
  },
];

export const featureGroups = [
  {
    category: 'Comfort and convenience',
    features: [
      'Air conditioning',
      'Automatic climate control',
      'Cruise control',
      'Heated front seats',
      'Keyless entry',
      'Power driver seat',
      'Power liftgate',
      'Power windows and locks',
      'Remote start',
      'Third-row seating',
    ],
  },
  {
    category: 'Entertainment',
    features: [
      'Apple CarPlay / Android Auto',
      'Bluetooth audio',
      'Navigation',
      'Premium audio',
      'Satellite radio',
      'USB input',
    ],
  },
  {
    category: 'Safety and driver assistance',
    features: [
      'Adaptive cruise control',
      'Automatic emergency braking',
      'Backup camera',
      'Blind-spot monitoring',
      'Forward-collision warning',
      'Lane-departure warning',
      'Parking sensors',
      'Stability control',
    ],
  },
  {
    category: 'Installed upgrades',
    features: [
      'All-weather floor mats',
      'Bed liner',
      'Roof crossbars',
      'Running boards',
      'Tow package',
      'Upgraded wheels',
    ],
  },
] as const;

type DisclosureItem = {
  question: string;
  answer: string;
  needsAttention?: boolean;
};

export type ListingDisclosure = {
  condition: Array<{ category: string; items: DisclosureItem[] }>;
  features: Array<{ category: string; items: string[] }>;
  seller: {
    memberSince: string;
    identity: string;
    ownership: string;
    locationPrivacy: string;
  };
};

const defaultCondition: ListingDisclosure['condition'] = [
  {
    category: 'Accidents',
    items: [
      { question: 'Has the vehicle ever been in an accident?', answer: 'No' },
    ],
  },
  {
    category: 'Flood and frame',
    items: [
      { question: 'Frame damage', answer: 'No' },
      { question: 'Flood damage', answer: 'No' },
    ],
  },
  {
    category: 'Interior',
    items: [
      { question: 'Smoked in', answer: 'No' },
      { question: 'Broken or inoperable interior parts', answer: 'No' },
      { question: 'Rips, tears, or stains', answer: 'No' },
    ],
  },
  {
    category: 'Mechanical',
    items: [
      { question: 'Start and drive status', answer: 'Starts and drives' },
      { question: 'Mechanical issues or warning lights', answer: 'No' },
      { question: 'Odometer broken or replaced', answer: 'No' },
      { question: 'Fluid leaks', answer: 'No' },
    ],
  },
  {
    category: 'Exterior',
    items: [
      { question: 'Panels needing paint or body work', answer: 'No' },
      { question: 'Major rust or hail damage', answer: 'No' },
      { question: 'Windshield needs replacement', answer: 'No' },
      { question: 'Fire damage', answer: 'No' },
    ],
  },
  {
    category: 'Tires, keys, and modifications',
    items: [
      { question: 'Tires need replacement', answer: 'No' },
      { question: 'Wheel issues', answer: 'No' },
      { question: 'Keys included', answer: '2 or more' },
      { question: 'Aftermarket modifications', answer: 'No' },
    ],
  },
];

const disclosures: Record<string, ListingDisclosure> = {
  '2021-midsize-touring-crossover': {
    condition: defaultCondition,
    features: [
      {
        category: 'Comfort and convenience',
        items: ['Automatic climate control', 'Heated front seats', 'Keyless entry', 'Power liftgate'],
      },
      {
        category: 'Entertainment',
        items: ['Apple CarPlay / Android Auto', 'Bluetooth audio', 'USB input'],
      },
      {
        category: 'Safety and driver assistance',
        items: ['Backup camera', 'Blind-spot monitoring', 'Automatic emergency braking', 'Lane-departure warning'],
      },
      {
        category: 'Installed upgrades',
        items: ['All-weather floor mats', 'Roof crossbars'],
      },
    ],
    seller: {
      memberSince: 'Demo profile',
      identity: 'Government ID reviewed',
      ownership: 'Name and VIN review required before publication',
      locationPrivacy: 'Approximate area shown; exact address hidden',
    },
  },
};

export function getListingDisclosure(slug: string): ListingDisclosure {
  return disclosures[slug] ?? {
    ...disclosures['2021-midsize-touring-crossover'],
    features: [
      {
        category: 'Comfort and convenience',
        items: ['Air conditioning', 'Cruise control', 'Keyless entry', 'Power windows and locks'],
      },
      {
        category: 'Entertainment',
        items: ['Bluetooth audio', 'USB input'],
      },
      {
        category: 'Safety and driver assistance',
        items: ['Backup camera', 'Stability control'],
      },
      {
        category: 'Installed upgrades',
        items: ['All-weather floor mats'],
      },
    ],
  };
}

export const conditionQuestionCount = conditionQuestionGroups.reduce(
  (total, group) => total + group.questions.length,
  0,
);
