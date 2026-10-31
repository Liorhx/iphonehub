import { TradeInIssues, DeviceCondition } from '@/types';

export interface DeviceBaseSpec {
  model: string;
  family: string;
  image: string;
  storages: string[];
  basePrice: {
    '16GB'?: number;
    '32GB'?: number;
    '64GB'?: number;
    '128GB'?: number;
    '256GB'?: number;
    '512GB'?: number;
    '1TB'?: number;
    '2TB'?: number;
  };
}

export const SUPPORTED_TRADE_IN_MODELS: DeviceBaseSpec[] = [
  // --- iPhone 18 Series ---
  {
    model: 'iPhone 18 Pro Max',
    family: 'iPhone 18',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=940&hei=1112&fmt=png-alpha',
    storages: ['256GB', '512GB', '1TB'],
    basePrice: { '256GB': 120000, '512GB': 135000, '1TB': 150000 },
  },
  {
    model: 'iPhone 18 Pro',
    family: 'iPhone 18',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB', '1TB'],
    basePrice: { '128GB': 105000, '256GB': 115000, '512GB': 128000, '1TB': 140000 },
  },
  {
    model: 'iPhone 18 Plus',
    family: 'iPhone 18',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 82000, '256GB': 90000, '512GB': 99000 },
  },
  {
    model: 'iPhone 18',
    family: 'iPhone 18',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 75000, '256GB': 82000, '512GB': 92000 },
  },

  // --- iPhone 17 Series ---
  {
    model: 'iPhone 17 Pro Max',
    family: 'iPhone 17',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=940&hei=1112&fmt=png-alpha',
    storages: ['256GB', '512GB', '1TB'],
    basePrice: { '256GB': 98000, '512GB': 110000, '1TB': 122000 },
  },
  {
    model: 'iPhone 17 Pro',
    family: 'iPhone 17',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB', '1TB'],
    basePrice: { '128GB': 86000, '256GB': 94000, '512GB': 105000, '1TB': 115000 },
  },
  {
    model: 'iPhone 17 Air',
    family: 'iPhone 17',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 68000, '256GB': 75000, '512GB': 84000 },
  },
  {
    model: 'iPhone 17',
    family: 'iPhone 17',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 62000, '256GB': 69000, '512GB': 78000 },
  },

  // --- iPhone 16 Series ---
  {
    model: 'iPhone 16 Pro Max',
    family: 'iPhone 16',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=940&hei=1112&fmt=png-alpha',
    storages: ['256GB', '512GB', '1TB'],
    basePrice: { '256GB': 86000, '512GB': 96000, '1TB': 108000 },
  },
  {
    model: 'iPhone 16 Pro',
    family: 'iPhone 16',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB', '1TB'],
    basePrice: { '128GB': 74000, '256GB': 82000, '512GB': 92000, '1TB': 102000 },
  },
  {
    model: 'iPhone 16 Plus',
    family: 'iPhone 16',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 56000, '256GB': 63000, '512GB': 72000 },
  },
  {
    model: 'iPhone 16',
    family: 'iPhone 16',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 50000, '256GB': 57000, '512GB': 66000 },
  },

  // --- iPhone 15 Series ---
  {
    model: 'iPhone 15 Pro Max',
    family: 'iPhone 15',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha',
    storages: ['256GB', '512GB', '1TB'],
    basePrice: { '256GB': 78000, '512GB': 88000, '1TB': 98000 },
  },
  {
    model: 'iPhone 15 Pro',
    family: 'iPhone 15',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB', '1TB'],
    basePrice: { '128GB': 66000, '256GB': 74000, '512GB': 84000, '1TB': 92000 },
  },
  {
    model: 'iPhone 15 Plus',
    family: 'iPhone 15',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pink-select-202309?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 48000, '256GB': 54000, '512GB': 62000 },
  },
  {
    model: 'iPhone 15',
    family: 'iPhone 15',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-blue-select-202309?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 43000, '256GB': 49000, '512GB': 57000 },
  },

  // --- iPhone 14 Series ---
  {
    model: 'iPhone 14 Pro Max',
    family: 'iPhone 14',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-max-gold-select?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB', '1TB'],
    basePrice: { '128GB': 58000, '256GB': 64000, '512GB': 72000, '1TB': 78000 },
  },
  {
    model: 'iPhone 14 Pro',
    family: 'iPhone 14',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-max-gold-select?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB', '1TB'],
    basePrice: { '128GB': 50000, '256GB': 56000, '512GB': 63000, '1TB': 69000 },
  },
  {
    model: 'iPhone 14 Plus',
    family: 'iPhone 14',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-plus-blue-select-202209?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 38000, '256GB': 43000, '512GB': 49000 },
  },
  {
    model: 'iPhone 14',
    family: 'iPhone 14',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-blue-select-202209?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 34000, '256GB': 39000, '512GB': 46000 },
  },

  // --- iPhone 13 Series ---
  {
    model: 'iPhone 13 Pro Max',
    family: 'iPhone 13',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-midnight-select-2021?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB', '1TB'],
    basePrice: { '128GB': 44000, '256GB': 49000, '512GB': 55000, '1TB': 60000 },
  },
  {
    model: 'iPhone 13 Pro',
    family: 'iPhone 13',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-midnight-select-2021?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB', '1TB'],
    basePrice: { '128GB': 38000, '256GB': 43000, '512GB': 48000, '1TB': 54000 },
  },
  {
    model: 'iPhone 13',
    family: 'iPhone 13',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-starlight-select-2021?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 28000, '256GB': 32500, '512GB': 37000 },
  },
  {
    model: 'iPhone 13 mini',
    family: 'iPhone 13',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-mini-blue-select-2021?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 23000, '256GB': 26500, '512GB': 30000 },
  },

  // --- iPhone 12 Series ---
  {
    model: 'iPhone 12 Pro Max',
    family: 'iPhone 12',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-purple-select-2021?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 32000, '256GB': 36000, '512GB': 41000 },
  },
  {
    model: 'iPhone 12 Pro',
    family: 'iPhone 12',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-purple-select-2021?wid=940&hei=1112&fmt=png-alpha',
    storages: ['128GB', '256GB', '512GB'],
    basePrice: { '128GB': 26000, '256GB': 29000, '512GB': 33000 },
  },
  {
    model: 'iPhone 12',
    family: 'iPhone 12',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-blue-select-2020?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '128GB', '256GB'],
    basePrice: { '64GB': 19000, '128GB': 22000, '256GB': 25000 },
  },
  {
    model: 'iPhone 12 mini',
    family: 'iPhone 12',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-mini-blue-select-2020?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '128GB', '256GB'],
    basePrice: { '64GB': 15000, '128GB': 17500, '256GB': 20000 },
  },

  // --- iPhone 11 Series ---
  {
    model: 'iPhone 11 Pro Max',
    family: 'iPhone 11',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-pro-max-silver-select-2019?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '256GB', '512GB'],
    basePrice: { '64GB': 20000, '256GB': 23500, '512GB': 26500 },
  },
  {
    model: 'iPhone 11 Pro',
    family: 'iPhone 11',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-pro-midnight-green-select-2019?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '256GB', '512GB'],
    basePrice: { '64GB': 17000, '256GB': 20000, '512GB': 23000 },
  },
  {
    model: 'iPhone 11',
    family: 'iPhone 11',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone11-black-select-2019?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '128GB', '256GB'],
    basePrice: { '64GB': 13000, '128GB': 15500, '256GB': 18000 },
  },

  // --- iPhone SE Series ---
  {
    model: 'iPhone SE (3rd Gen)',
    family: 'iPhone SE',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-se-midnight-select-202203?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '128GB', '256GB'],
    basePrice: { '64GB': 13500, '128GB': 16000, '256GB': 18500 },
  },
  {
    model: 'iPhone SE (2nd Gen)',
    family: 'iPhone SE',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-se-white-select-2020?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '128GB', '256GB'],
    basePrice: { '64GB': 8500, '128GB': 10500, '256GB': 12500 },
  },

  // --- iPhone X / XS / XR Series ---
  {
    model: 'iPhone XS Max',
    family: 'iPhone X',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-xs-gold-select-2018?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '256GB', '512GB'],
    basePrice: { '64GB': 14000, '256GB': 16500, '512GB': 19000 },
  },
  {
    model: 'iPhone XS',
    family: 'iPhone X',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-xs-gold-select-2018?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '256GB', '512GB'],
    basePrice: { '64GB': 11500, '256GB': 13500, '512GB': 15500 },
  },
  {
    model: 'iPhone XR',
    family: 'iPhone X',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-xr-white-select-201809?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '128GB', '256GB'],
    basePrice: { '64GB': 10000, '128GB': 12000, '256GB': 14000 },
  },
  {
    model: 'iPhone X',
    family: 'iPhone X',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-x-silver-select-2017?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '256GB'],
    basePrice: { '64GB': 9000, '256GB': 11000 },
  },

  // --- iPhone 8 Series ---
  {
    model: 'iPhone 8 Plus',
    family: 'iPhone 8',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone8-spgray-select-2017?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '128GB', '256GB'],
    basePrice: { '64GB': 7500, '128GB': 8800, '256GB': 10000 },
  },
  {
    model: 'iPhone 8',
    family: 'iPhone 8',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone8-gold-select-2017?wid=940&hei=1112&fmt=png-alpha',
    storages: ['64GB', '128GB', '256GB'],
    basePrice: { '64GB': 5500, '128GB': 6500, '256GB': 7500 },
  },

  // --- iPhone 7 Series ---
  {
    model: 'iPhone 7 Plus',
    family: 'iPhone 7',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone7-black-select-2016?wid=940&hei=1112&fmt=png-alpha',
    storages: ['32GB', '128GB', '256GB'],
    basePrice: { '32GB': 4800, '128GB': 5800, '256GB': 6800 },
  },
  {
    model: 'iPhone 7',
    family: 'iPhone 7',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone7-black-select-2016?wid=940&hei=1112&fmt=png-alpha',
    storages: ['32GB', '128GB', '256GB'],
    basePrice: { '32GB': 3800, '128GB': 4600, '256GB': 5400 },
  },

  // --- iPhone 6s & 6 Series ---
  {
    model: 'iPhone 6s Plus',
    family: 'iPhone 6',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone6s-rosegold-select-2015?wid=940&hei=1112&fmt=png-alpha',
    storages: ['16GB', '32GB', '64GB', '128GB'],
    basePrice: { '16GB': 3200, '32GB': 3600, '64GB': 4200, '128GB': 4800 },
  },
  {
    model: 'iPhone 6s',
    family: 'iPhone 6',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone6s-rosegold-select-2015?wid=940&hei=1112&fmt=png-alpha',
    storages: ['16GB', '32GB', '64GB', '128GB'],
    basePrice: { '16GB': 2800, '32GB': 3200, '64GB': 3600, '128GB': 4200 },
  },
  {
    model: 'iPhone 6 Plus',
    family: 'iPhone 6',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone6-silver-select-2014?wid=940&hei=1112&fmt=png-alpha',
    storages: ['16GB', '64GB', '128GB'],
    basePrice: { '16GB': 2500, '64GB': 3000, '128GB': 3500 },
  },
  {
    model: 'iPhone 6',
    family: 'iPhone 6',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone6-silver-select-2014?wid=940&hei=1112&fmt=png-alpha',
    storages: ['16GB', '32GB', '64GB', '128GB'],
    basePrice: { '16GB': 2000, '32GB': 2400, '64GB': 2800, '128GB': 3200 },
  },
];

export function calculateTradeInQuote(
  model: string,
  storage: string,
  condition: DeviceCondition,
  issues: Partial<TradeInIssues>
) {
  const modelSpec = SUPPORTED_TRADE_IN_MODELS.find((m) => m.model === model) || SUPPORTED_TRADE_IN_MODELS[0];
  const priceMap = modelSpec.basePrice as Record<string, number>;
  const base = priceMap[storage] || Object.values(priceMap)[0] || 15000;

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
    computed -= Math.min(2500, base * 0.15);
  } else if (issues.batteryHealth === '80% - 85%') {
    computed -= Math.min(1200, base * 0.08);
  }

  // Hardware Checks
  if (issues.cameraWorking === false) {
    computed -= base * 0.18;
  }
  if (issues.faceIdWorking === false) {
    computed -= base * 0.20;
  }
  if (issues.speakersAndMicWorking === false) {
    computed -= Math.min(1500, base * 0.1);
  }

  // Accessories Bonus
  if (issues.boxAndAccessoriesPresent) {
    computed += Math.min(1000, Math.round(base * 0.05));
  }
  if (issues.validIndianBillPresent) {
    computed += Math.min(800, Math.round(base * 0.04));
  }

  const roundedQuote = Math.max(1200, Math.round(computed / 100) * 100);
  const exchangeBonus = Math.max(500, Math.round((roundedQuote * 0.08) / 100) * 100 + 1000);

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
