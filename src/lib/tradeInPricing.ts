import { TradeInIssues, DeviceCondition } from '@/types';

export interface DeviceBaseSpec {
  model: string;
  family: string;
  basePrice: {
    '64GB'?: number;
    '128GB'?: number;
    '256GB'?: number;
    '512GB'?: number;
    '1TB'?: number;
  };
}

export const SUPPORTED_TRADE_IN_MODELS: DeviceBaseSpec[] = [
  {
    model: 'iPhone 15 Pro Max',
    family: 'iPhone 15',
    basePrice: { '256GB': 78000, '512GB': 88000, '1TB': 98000 },
  },
  {
    model: 'iPhone 15 Pro',
    family: 'iPhone 15',
    basePrice: { '128GB': 66000, '256GB': 74000, '512GB': 84000, '1TB': 92000 },
  },
  {
    model: 'iPhone 15 Plus',
    family: 'iPhone 15',
    basePrice: { '128GB': 48000, '256GB': 54000, '512GB': 62000 },
  },
  {
    model: 'iPhone 15',
    family: 'iPhone 15',
    basePrice: { '128GB': 43000, '256GB': 49000, '512GB': 57000 },
  },
  {
    model: 'iPhone 14 Pro Max',
    family: 'iPhone 14',
    basePrice: { '128GB': 58000, '256GB': 64000, '512GB': 72000, '1TB': 78000 },
  },
  {
    model: 'iPhone 14 Pro',
    family: 'iPhone 14',
    basePrice: { '128GB': 50000, '256GB': 56000, '512GB': 63000, '1TB': 69000 },
  },
  {
    model: 'iPhone 14',
    family: 'iPhone 14',
    basePrice: { '128GB': 34000, '256GB': 39000, '512GB': 46000 },
  },
  {
    model: 'iPhone 13 Pro Max',
    family: 'iPhone 13',
    basePrice: { '128GB': 44000, '256GB': 49000, '512GB': 55000, '1TB': 60000 },
  },
  {
    model: 'iPhone 13 Pro',
    family: 'iPhone 13',
    basePrice: { '128GB': 38000, '256GB': 43000, '512GB': 48000, '1TB': 54000 },
  },
  {
    model: 'iPhone 13',
    family: 'iPhone 13',
    basePrice: { '128GB': 28000, '256GB': 32500, '512GB': 37000 },
  },
  {
    model: 'iPhone 12 Pro',
    family: 'iPhone 12',
    basePrice: { '128GB': 26000, '256GB': 29000, '512GB': 33000 },
  },
  {
    model: 'iPhone 12',
    family: 'iPhone 12',
    basePrice: { '64GB': 19000, '128GB': 22000, '256GB': 25000 },
  },
  {
    model: 'iPhone 11',
    family: 'iPhone 11',
    basePrice: { '64GB': 13000, '128GB': 15500, '256GB': 18000 },
  },
];

export function calculateTradeInQuote(
  model: string,
  storage: string,
  condition: DeviceCondition,
  issues: Partial<TradeInIssues>
) {
  const modelSpec = SUPPORTED_TRADE_IN_MODELS.find((m) => m.model === model) || SUPPORTED_TRADE_IN_MODELS[0];
  const base = (modelSpec.basePrice as Record<string, number>)[storage] || 25000;

  // Condition Multiplier
  let conditionMultiplier = 1.0;
  if (condition === 'Flawless') conditionMultiplier = 1.0;
  else if (condition === 'Excellent') conditionMultiplier = 0.92;
  else if (condition === 'Good') conditionMultiplier = 0.82;
  else if (condition === 'Fair') conditionMultiplier = 0.68;

  let computed = base * conditionMultiplier;

  // Screen Scratches
  if (issues.screenScratches === 'Cracked / Deep') {
    computed -= base * 0.25;
  } else if (issues.screenScratches === 'Minor') {
    computed -= base * 0.05;
  }

  // Body Condition
  if (issues.bodyCondition === 'Dents / Cracks') {
    computed -= base * 0.15;
  } else if (issues.bodyCondition === 'Minor Scratches') {
    computed -= base * 0.04;
  }

  // Battery Health
  if (issues.batteryHealth === 'Below 80%') {
    computed -= 2500;
  } else if (issues.batteryHealth === '80% - 85%') {
    computed -= 1200;
  }

  // Hardware Checks
  if (issues.cameraWorking === false) {
    computed -= base * 0.18;
  }
  if (issues.faceIdWorking === false) {
    computed -= base * 0.20;
  }
  if (issues.speakersAndMicWorking === false) {
    computed -= 1500;
  }

  // Accessories Bonus
  if (issues.boxAndAccessoriesPresent) {
    computed += 1000;
  }
  if (issues.validIndianBillPresent) {
    computed += 800;
  }

  const roundedQuote = Math.max(3000, Math.round(computed / 100) * 100);
  const exchangeBonus = Math.round((roundedQuote * 0.08) / 100) * 100 + 1500;

  return {
    basePrice: base,
    estimatedQuote: roundedQuote,
    exchangeBonus,
    totalExchangeValue: roundedQuote + exchangeBonus,
    priceRange: {
      min: Math.round(roundedQuote * 0.95),
      max: Math.round(roundedQuote * 1.05),
    },
  };
}

