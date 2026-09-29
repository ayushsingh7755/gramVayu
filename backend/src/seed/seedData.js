import State from '../models/State.js';
import District from '../models/District.js';
import Block from '../models/Block.js';
import Panchayat from '../models/Panchayat.js';
import User from '../models/User.js';
import WeatherForecast from '../models/WeatherForecast.js';
import WeatherAlert from '../models/WeatherAlert.js';
import Advisory from '../models/Advisory.js';
import { generatePanchayatForecast } from '../services/downscalingService.js';

export const DEMO_PASSWORD = 'Password@123';

export const seedDatabase = async ({ clearExisting = true } = {}) => {
  if (clearExisting) {
    await Promise.all([
      WeatherForecast.deleteMany({}),
      WeatherAlert.deleteMany({}),
      Advisory.deleteMany({}),
      Panchayat.deleteMany({}),
      Block.deleteMany({}),
      District.deleteMany({}),
      State.deleteMany({}),
      User.deleteMany({}),
    ]);
  }

  // 1. Create States
  const delhiState = await State.create({
    name: 'Delhi NCR (Agro-Met Zone)',
    code: 'DL',
  });

  const haryanaState = await State.create({
    name: 'Haryana',
    code: 'HR',
  });

  // 2. Create Districts (2 Districts in primary State + 1 in secondary State)
  const swDelhi = await District.create({
    name: 'South West Delhi',
    code: 'SWD',
    state: delhiState._id,
  });

  const nwDelhi = await District.create({
    name: 'North West Delhi',
    code: 'NWD',
    state: delhiState._id,
  });

  const jhajjarDist = await District.create({
    name: 'Jhajjar',
    code: 'JHJ',
    state: haryanaState._id,
  });

  // 3. Create Blocks (2 Blocks per District in primary State)
  const najafgarhBlock = await Block.create({
    name: 'Najafgarh',
    district: swDelhi._id,
    state: delhiState._id,
    centerLatitude: 28.6092,
    centerLongitude: 76.9798,
    elevation: 213,
  });

  const kapasheraBlock = await Block.create({
    name: 'Kapashera',
    district: swDelhi._id,
    state: delhiState._id,
    centerLatitude: 28.5245,
    centerLongitude: 77.0824,
    elevation: 222,
  });

  const narelaBlock = await Block.create({
    name: 'Narela',
    district: nwDelhi._id,
    state: delhiState._id,
    centerLatitude: 28.8527,
    centerLongitude: 77.0929,
    elevation: 216,
  });

  const kanjhawalaBlock = await Block.create({
    name: 'Kanjhawala',
    district: nwDelhi._id,
    state: delhiState._id,
    centerLatitude: 28.7256,
    centerLongitude: 77.0039,
    elevation: 218,
  });

  const bahadurgarhBlock = await Block.create({
    name: 'Bahadurgarh',
    district: jhajjarDist._id,
    state: haryanaState._id,
    centerLatitude: 28.6924,
    centerLongitude: 76.9239,
    elevation: 210,
  });

  // 4. Create Panchayats (4 Panchayats per Block in Delhi NCR + 2 in Bahadurgarh)
  const panchayatsConfig = [
    // Najafgarh Block (4 Panchayats)
    {
      name: 'Mitraon Gram Panchayat',
      block: najafgarhBlock._id,
      district: swDelhi._id,
      state: delhiState._id,
      latitude: 28.6041,
      longitude: 76.9462,
      elevation: 211,
      area: 14.2,
      population: 7850,
      vegetationFactor: 0.78,
      primaryCrops: ['Paddy', 'Wheat', 'Mustard'],
    },
    {
      name: 'Jafarpur Kalan Panchayat',
      block: najafgarhBlock._id,
      district: swDelhi._id,
      state: delhiState._id,
      latitude: 28.5818,
      longitude: 76.9155,
      elevation: 208,
      area: 16.5,
      population: 9200,
      vegetationFactor: 0.84,
      primaryCrops: ['Paddy', 'Bajra', 'Cauliflower'],
    },
    {
      name: 'Dichaukalan Panchayat',
      block: najafgarhBlock._id,
      district: swDelhi._id,
      state: delhiState._id,
      latitude: 28.6312,
      longitude: 76.9685,
      elevation: 216,
      area: 11.8,
      population: 11400,
      vegetationFactor: 0.42,
      primaryCrops: ['Mustard', 'Wheat', 'Tomato'],
    },
    {
      name: 'Kair Gram Panchayat',
      block: najafgarhBlock._id,
      district: swDelhi._id,
      state: delhiState._id,
      latitude: 28.6185,
      longitude: 76.9295,
      elevation: 214,
      area: 13.0,
      population: 6300,
      vegetationFactor: 0.72,
      primaryCrops: ['Wheat', 'Paddy', 'Spinach'],
    },

    // Kapashera Block (4 Panchayats)
    {
      name: 'Bijwasan Gram Panchayat',
      block: kapasheraBlock._id,
      district: swDelhi._id,
      state: delhiState._id,
      latitude: 28.5361,
      longitude: 77.0531,
      elevation: 224,
      area: 10.9,
      population: 12500,
      vegetationFactor: 0.52,
      primaryCrops: ['Mustard', 'Vegetables', 'Wheat'],
    },
    {
      name: 'Chhawla Gram Panchayat',
      block: kapasheraBlock._id,
      district: swDelhi._id,
      state: delhiState._id,
      latitude: 28.5608,
      longitude: 77.0072,
      elevation: 218,
      area: 13.4,
      population: 9800,
      vegetationFactor: 0.68,
      primaryCrops: ['Paddy', 'Wheat', 'Berseem'],
    },
    {
      name: 'Bamnoli Panchayat',
      block: kapasheraBlock._id,
      district: swDelhi._id,
      state: delhiState._id,
      latitude: 28.5452,
      longitude: 77.0289,
      elevation: 220,
      area: 9.6,
      population: 5400,
      vegetationFactor: 0.74,
      primaryCrops: ['Floriculture', 'Mustard', 'Wheat'],
    },
    {
      name: 'Samalkha Gram Panchayat',
      block: kapasheraBlock._id,
      district: swDelhi._id,
      state: delhiState._id,
      latitude: 28.5305,
      longitude: 77.0921,
      elevation: 228,
      area: 8.2,
      population: 14100,
      vegetationFactor: 0.38,
      primaryCrops: ['Okra', 'Brinjal', 'Wheat'],
    },

    // Narela Block (4 Panchayats)
    {
      name: 'Bawana Gram Panchayat',
      block: narelaBlock._id,
      district: nwDelhi._id,
      state: delhiState._id,
      latitude: 28.7996,
      longitude: 77.0328,
      elevation: 217,
      area: 15.1,
      population: 13200,
      vegetationFactor: 0.58,
      primaryCrops: ['Paddy', 'Wheat', 'Sugarcane'],
    },
    {
      name: 'Alipur Gram Panchayat',
      block: narelaBlock._id,
      district: nwDelhi._id,
      state: delhiState._id,
      latitude: 28.7972,
      longitude: 77.1331,
      elevation: 212,
      area: 14.8,
      population: 10900,
      vegetationFactor: 0.76,
      primaryCrops: ['Paddy', 'Cauliflower', 'Wheat'],
    },
    {
      name: 'Holambi Kalan Panchayat',
      block: narelaBlock._id,
      district: nwDelhi._id,
      state: delhiState._id,
      latitude: 28.8195,
      longitude: 77.0964,
      elevation: 215,
      area: 12.3,
      population: 8400,
      vegetationFactor: 0.71,
      primaryCrops: ['Wheat', 'Mustard', 'Radish'],
    },
    {
      name: 'Bankner Gram Panchayat',
      block: narelaBlock._id,
      district: nwDelhi._id,
      state: delhiState._id,
      latitude: 28.8482,
      longitude: 77.0691,
      elevation: 218,
      area: 13.7,
      population: 7600,
      vegetationFactor: 0.81,
      primaryCrops: ['Paddy', 'Wheat', 'Green Gram'],
    },

    // Kanjhawala Block (4 Panchayats)
    {
      name: 'Qutabgarh Gram Panchayat',
      block: kanjhawalaBlock._id,
      district: nwDelhi._id,
      state: delhiState._id,
      latitude: 28.7581,
      longitude: 76.9682,
      elevation: 219,
      area: 15.6,
      population: 6900,
      vegetationFactor: 0.83,
      primaryCrops: ['Mustard', 'Wheat', 'Guava Orchard'],
    },
    {
      name: 'Jaunti Gram Panchayat',
      block: kanjhawalaBlock._id,
      district: nwDelhi._id,
      state: delhiState._id,
      latitude: 28.7392,
      longitude: 76.9524,
      elevation: 221,
      area: 14.0,
      population: 5800,
      vegetationFactor: 0.79,
      primaryCrops: ['Wheat', 'Pearl Millet', 'Mustard'],
    },
    {
      name: 'Nizampur Panchayat',
      block: kanjhawalaBlock._id,
      district: nwDelhi._id,
      state: delhiState._id,
      latitude: 28.7124,
      longitude: 76.9648,
      elevation: 216,
      area: 12.9,
      population: 6100,
      vegetationFactor: 0.74,
      primaryCrops: ['Paddy', 'Wheat', 'Mustard'],
    },
    {
      name: 'Ladpur Gram Panchayat',
      block: kanjhawalaBlock._id,
      district: nwDelhi._id,
      state: delhiState._id,
      latitude: 28.7365,
      longitude: 76.9912,
      elevation: 217,
      area: 11.4,
      population: 7300,
      vegetationFactor: 0.62,
      primaryCrops: ['Wheat', 'Vegetables', 'Mustard'],
    },

    // Bahadurgarh Block (2 Panchayats)
    {
      name: 'Badli Gram Panchayat',
      block: bahadurgarhBlock._id,
      district: jhajjarDist._id,
      state: haryanaState._id,
      latitude: 28.5912,
      longitude: 76.8421,
      elevation: 210,
      area: 17.2,
      population: 10200,
      vegetationFactor: 0.82,
      primaryCrops: ['Paddy', 'Wheat', 'Mustard'],
    },
    {
      name: 'Asaudha Gram Panchayat',
      block: bahadurgarhBlock._id,
      district: jhajjarDist._id,
      state: haryanaState._id,
      latitude: 28.7321,
      longitude: 76.8754,
      elevation: 212,
      area: 15.8,
      population: 8900,
      vegetationFactor: 0.77,
      primaryCrops: ['Wheat', 'Sugarcane', 'Mustard'],
    },
  ];

  const createdPanchayats = await Panchayat.insertMany(panchayatsConfig);
  const mitraonPanchayat = createdPanchayats[0];

  // 5. Create Demo Users (Admin, Officer, Farmer)
  const adminUser = await User.create({
    name: 'Dr. Rajeshwar Sharma (System Admin)',
    email: 'admin@example.com',
    password: DEMO_PASSWORD,
    phone: '+91 9810011223',
    role: 'admin',
    state: delhiState._id,
    district: swDelhi._id,
    block: najafgarhBlock._id,
    panchayat: mitraonPanchayat._id,
  });

  const officerUser = await User.create({
    name: 'Dr. Meenakshi Verma (Block Agro-Met Officer)',
    email: 'officer@example.com',
    password: DEMO_PASSWORD,
    phone: '+91 9810044556',
    role: 'officer',
    state: delhiState._id,
    district: swDelhi._id,
    block: najafgarhBlock._id,
    panchayat: mitraonPanchayat._id,
  });

  const farmerUser = await User.create({
    name: 'RameshChandra Dagar (Progressive Farmer)',
    email: 'farmer@example.com',
    password: DEMO_PASSWORD,
    phone: '+91 9810077889',
    role: 'farmer',
    state: delhiState._id,
    district: swDelhi._id,
    block: najafgarhBlock._id,
    panchayat: mitraonPanchayat._id,
  });

  // 6. Seed 7 Days of Block-Level Weather (2026-10-01 to 2026-10-07)
  // Matches prompt example: 2026-10-01 Najafgarh Temp 32, Rainfall 20, Humidity 72, Wind 14, Pressure 1005, Cloud 65
  const dates = [
    '2026-10-01',
    '2026-10-02',
    '2026-10-03',
    '2026-10-04',
    '2026-10-05',
    '2026-10-06',
    '2026-10-07',
  ];

  const baselineSchedule = [
    {
      date: '2026-10-01',
      temperature: 32,
      minTemperature: 25.5,
      maxTemperature: 35.2,
      rainfall: 20,
      humidity: 72,
      windSpeed: 14,
      windDirection: 'SE',
      pressure: 1005,
      cloudCover: 65,
      weatherCondition: 'Moderate Rain',
      probabilityOfRain: 75,
    },
    {
      date: '2026-10-02',
      temperature: 30.5,
      minTemperature: 24.0,
      maxTemperature: 33.4,
      rainfall: 48,
      humidity: 82,
      windSpeed: 22,
      windDirection: 'E',
      pressure: 1002,
      cloudCover: 88,
      weatherCondition: 'Heavy Rain',
      probabilityOfRain: 90,
    },
    {
      date: '2026-10-03',
      temperature: 29.8,
      minTemperature: 23.6,
      maxTemperature: 32.8,
      rainfall: 14,
      humidity: 70,
      windSpeed: 16,
      windDirection: 'NE',
      pressure: 1006,
      cloudCover: 55,
      weatherCondition: 'Light Rain',
      probabilityOfRain: 60,
    },
    {
      date: '2026-10-04',
      temperature: 33.2,
      minTemperature: 25.0,
      maxTemperature: 36.8,
      rainfall: 4,
      humidity: 61,
      windSpeed: 11,
      windDirection: 'NW',
      pressure: 1009,
      cloudCover: 28,
      weatherCondition: 'Partly Cloudy',
      probabilityOfRain: 25,
    },
    {
      date: '2026-10-05',
      temperature: 34.4,
      minTemperature: 25.8,
      maxTemperature: 38.0,
      rainfall: 0,
      humidity: 54,
      windSpeed: 12,
      windDirection: 'NW',
      pressure: 1011,
      cloudCover: 15,
      weatherCondition: 'Clear',
      probabilityOfRain: 10,
    },
    {
      date: '2026-10-06',
      temperature: 33.8,
      minTemperature: 25.2,
      maxTemperature: 37.1,
      rainfall: 8,
      humidity: 64,
      windSpeed: 18,
      windDirection: 'W',
      pressure: 1008,
      cloudCover: 42,
      weatherCondition: 'Partly Cloudy',
      probabilityOfRain: 40,
    },
    {
      date: '2026-10-07',
      temperature: 31.6,
      minTemperature: 24.4,
      maxTemperature: 34.9,
      rainfall: 28,
      humidity: 76,
      windSpeed: 24,
      windDirection: 'SE',
      pressure: 1004,
      cloudCover: 74,
      weatherCondition: 'Thunderstorm',
      probabilityOfRain: 80,
    },
  ];

  const blocksList = [
    { doc: najafgarhBlock, tempOffset: 0, rainFactor: 1.0, windOffset: 0 },
    { doc: kapasheraBlock, tempOffset: 0.7, rainFactor: 0.85, windOffset: -1.5 },
    { doc: narelaBlock, tempOffset: -0.4, rainFactor: 1.15, windOffset: 2.0 },
    { doc: kanjhawalaBlock, tempOffset: -0.2, rainFactor: 1.08, windOffset: 1.0 },
    { doc: bahadurgarhBlock, tempOffset: 0.3, rainFactor: 0.95, windOffset: 1.5 },
  ];

  for (const bEntry of blocksList) {
    const bDoc = bEntry.doc;
    const blockPanchayats = createdPanchayats.filter(
      (p) => String(p.block) === String(bDoc._id)
    );

    for (const daySpec of baselineSchedule) {
      const blockForecast = await WeatherForecast.create({
        locationType: 'block',
        state: bDoc.state,
        district: bDoc.district,
        block: bDoc._id,
        panchayat: null,
        date: daySpec.date,
        temperature: Number((daySpec.temperature + bEntry.tempOffset).toFixed(1)),
        minTemperature: Number((daySpec.minTemperature + bEntry.tempOffset).toFixed(1)),
        maxTemperature: Number((daySpec.maxTemperature + bEntry.tempOffset).toFixed(1)),
        rainfall: Number((daySpec.rainfall * bEntry.rainFactor).toFixed(1)),
        humidity: Math.min(98, Math.max(25, Math.round(daySpec.humidity + (bEntry.rainFactor - 1) * 15))),
        windSpeed: Number((daySpec.windSpeed + bEntry.windOffset).toFixed(1)),
        windDirection: daySpec.windDirection,
        pressure: daySpec.pressure,
        cloudCover: daySpec.cloudCover,
        weatherCondition: daySpec.weatherCondition,
        probabilityOfRain: daySpec.probabilityOfRain,
        source: 'IMD Block Bulletin',
        forecastType: 'forecast',
      });

      // Generate deterministic Panchayat-level forecasts from Block forecast
      const downscaledList = await generatePanchayatForecast(
        blockForecast,
        blockPanchayats,
        bDoc
      );

      for (const sim of downscaledList) {
        const { risk, ...dbRecord } = sim;
        await WeatherForecast.create(dbRecord);
      }
    }
  }

  // 7. Create Weather Alerts
  const now = new Date('2026-10-01T08:00:00Z');
  const twoDaysLater = new Date('2026-10-03T20:00:00Z');
  const fiveDaysLater = new Date('2026-10-06T20:00:00Z');

  await WeatherAlert.insertMany([
    {
      title: 'Heavy Rainfall & Field Waterlogging Alert (50-62 mm)',
      description:
        'Downscaled Panchayat forecasts indicate intense convective rainfall exceeding 50 mm across low-lying pockets of Najafgarh (Jafarpur Kalan & Mitraon) over the next 48 hours. Ensure bund drainage in standing Paddy fields.',
      severity: 'high',
      type: 'heavy_rain',
      state: delhiState._id,
      district: swDelhi._id,
      block: najafgarhBlock._id,
      panchayat: createdPanchayats[1]._id, // Jafarpur Kalan
      startTime: now,
      endTime: twoDaysLater,
      isActive: true,
      createdBy: officerUser._id,
    },
    {
      title: 'Thunderstorm & Gusty Surface Winds Advisory',
      description:
        'Local wind gusts of 25-32 km/h accompanied by moderate showers expected across Narela and Kanjhawala blocks. Tall maturing Kharif crops may experience lodging if irrigated prior to squall passage.',
      severity: 'moderate',
      type: 'thunderstorm',
      state: delhiState._id,
      district: nwDelhi._id,
      block: narelaBlock._id,
      panchayat: null,
      startTime: now,
      endTime: fiveDaysLater,
      isActive: true,
      createdBy: officerUser._id,
    },
    {
      title: 'Localized Low-Lying Drainage Watch (Najafgarh Jheel Belt)',
      description:
        'Higher vegetation moisture retention and runoff accumulation near Jafarpur Kalan and Kair Panchayats may cause temporary water stagnation. Keep drainage channels clear.',
      severity: 'severe',
      type: 'flood_risk',
      state: delhiState._id,
      district: swDelhi._id,
      block: najafgarhBlock._id,
      panchayat: mitraonPanchayat._id,
      startTime: now,
      endTime: twoDaysLater,
      isActive: true,
      createdBy: adminUser._id,
    },
    {
      title: 'Mid-Week Diurnal Temperature Rise (36-38°C)',
      description:
        'Clear sky conditions around Oct 4-5 will raise afternoon soil surface temperatures to 37°C in urban-fringe Panchayats (Dichaukalan & Samalkha). Schedule nursery transplanting in evening hours.',
      severity: 'low',
      type: 'high_temperature',
      state: delhiState._id,
      district: swDelhi._id,
      block: kapasheraBlock._id,
      panchayat: null,
      startTime: now,
      endTime: fiveDaysLater,
      isActive: true,
      createdBy: officerUser._id,
    },
  ]);

  // 8. Create Agro-Meteorological Advisories
  await Advisory.insertMany([
    {
      title: 'Heavy Rain Expected: Suspend Irrigation & Drain Excess Water in Maturing Paddy',
      description:
        'Downscaled Panchayat forecast indicates 48-60 mm cumulative rainfall across Mitraon and Jafarpur Kalan Panchayats over the next 24-48 hours with 82-90% probability.',
      category: 'irrigation',
      crop: 'Paddy',
      weatherCondition: 'Heavy Rain',
      state: delhiState._id,
      district: swDelhi._id,
      block: najafgarhBlock._id,
      panchayat: mitraonPanchayat._id,
      severity: 'high',
      recommendations: [
        'Avoid irrigation completely for the next 4 days.',
        'Delay harvesting of early-maturing Basmati varieties where possible.',
        'Open bund outlets to ensure immediate field drainage and prevent panicle submergence.',
        'Protect already harvested paddy produce on threshing floors with tarpaulin sheets.',
      ],
      createdBy: officerUser._id,
    },
    {
      title: 'Optimum Soil Moisture Utilization for Early Mustard (Sarson) Sowing',
      description:
        'Following the Oct 1-3 rain spell, residual topsoil moisture in well-drained loamy fields of Dichaukalan and Kair Panchayats will be ideal for land preparation and Toria/Early Mustard sowing.',
      category: 'sowing',
      crop: 'Mustard',
      weatherCondition: 'Partly Cloudy',
      state: delhiState._id,
      district: swDelhi._id,
      block: najafgarhBlock._id,
      panchayat: createdPanchayats[2]._id,
      severity: 'low',
      recommendations: [
        'Utilize conserved rain moisture after Oct 3 for preparatory tillage without pre-sowing irrigation.',
        'Treat mustard seeds with Carbendazim @ 2g/kg seed before sowing to prevent white rust.',
        'Maintain row-to-row spacing of 45 cm and plant depth of 3-4 cm.',
      ],
      createdBy: officerUser._id,
    },
    {
      title: 'High Humidity (75-85%) Pest Vigilance: Brown Plant Hopper & Sheath Blight in Paddy',
      description:
        'Elevated canopy humidity (>76%) combined with warm daytime temperatures (~31.5°C) creates favorable micro-climate for hopper burn and fungal sheath blight in dense paddy stands.',
      category: 'pest_management',
      crop: 'Paddy',
      weatherCondition: 'Moderate Rain',
      state: delhiState._id,
      district: nwDelhi._id,
      block: narelaBlock._id,
      panchayat: null,
      severity: 'moderate',
      recommendations: [
        'Inspect the lower base of rice hills regularly for Brown Plant Hopper (BPH) nymphs.',
        'Postpone foliar pesticide spraying until rain-free window on Oct 4-5.',
        'Avoid excessive top-dressing of Urea fertilizer which increases crop susceptibility.',
        'Part the crop canopy along pathways every 3 meters to improve aeration and sunlight penetration.',
      ],
      createdBy: officerUser._id,
    },
    {
      title: 'Cole Crops (Cauliflower & Cabbage) Nursery Protection Against Downpour',
      description:
        'Intense localized rain showers can cause damping-off and root rot in raised vegetable nursery beds across Kapashera and Kanjhawala blocks.',
      category: 'crop_protection',
      crop: 'Cauliflower',
      weatherCondition: 'Heavy Rain',
      state: delhiState._id,
      district: swDelhi._id,
      block: kapasheraBlock._id,
      panchayat: null,
      severity: 'high',
      recommendations: [
        'Cover nursery beds with low poly-tunnels or agro-shade nets during heavy showers.',
        'Ensure 15 cm raised beds with clear peripheral drainage channels.',
        'Drench nursery soil with Copper Oxychloride (2.5 g/litre) once skies clear on Oct 4.',
      ],
      createdBy: adminUser._id,
    },
    {
      title: 'Harvesting & Post-Harvest Storage Protocol for Kharif Pearl Millet (Bajra)',
      description:
        'Moisture levels and intermittent showers require careful scheduling of earhead harvesting and sun-drying to prevent grain discoloration and fungal mould.',
      category: 'harvesting',
      crop: 'Pearl Millet (Bajra)',
      weatherCondition: 'Light Rain',
      state: delhiState._id,
      district: nwDelhi._id,
      block: kanjhawalaBlock._id,
      panchayat: null,
      severity: 'moderate',
      recommendations: [
        'Harvest matured earheads only during dry sunny spells forecasted on Oct 4-5.',
        'Dry grains thoroughly until moisture content drops below 12% before bagging.',
        'Store bags on wooden pallets away from damp walls in ventilated godowns.',
      ],
      createdBy: officerUser._id,
    },
  ]);

  return {
    statesCount: 2,
    districtsCount: 3,
    blocksCount: 5,
    panchayatsCount: createdPanchayats.length,
    users: {
      admin: adminUser.email,
      officer: officerUser.email,
      farmer: farmerUser.email,
      password: DEMO_PASSWORD,
    },
  };
};
