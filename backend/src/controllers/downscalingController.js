import Block from '../models/Block.js';
import Panchayat from '../models/Panchayat.js';
import WeatherForecast from '../models/WeatherForecast.js';
import { generatePanchayatForecast } from '../services/downscalingService.js';
import { calculateWeatherRisk } from '../services/riskService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * POST /api/downscaling/generate
 * 1. Receives blockId and date
 * 2. Fetches Block-level weather
 * 3. Fetches Panchayats belonging to that Block
 * 4. Passes data to prototype downscaling service (generatePanchayatForecast)
 * 5. Saves simulated Panchayat-level forecasts to MongoDB
 * 6. Returns generated forecasts
 */
export const generateDownscaledForecasts = asyncHandler(async (req, res) => {
  const { blockId, date } = req.body;

  if (!blockId || !date) {
    throw new AppError('blockId and date are required.', 400);
  }

  const blockDoc = await Block.findById(blockId)
    .populate('district', 'name code')
    .populate('state', 'name code');

  if (!blockDoc) {
    throw new AppError('Specified Block not found.', 404);
  }

  let blockWeather = await WeatherForecast.findOne({
    locationType: 'block',
    block: blockId,
    date,
  });

  // If no exact date block forecast exists yet, fallback to latest block forecast or synthesize baseline
  if (!blockWeather) {
    const latestBlock = await WeatherForecast.findOne({
      locationType: 'block',
      block: blockId,
    }).sort({ date: -1 });

    if (!latestBlock) {
      throw new AppError(
        `No Block-level weather forecast found for ${blockDoc.name} on ${date}. Please enter Block weather first.`,
        404
      );
    }

    blockWeather = await WeatherForecast.create({
      locationType: 'block',
      state: blockDoc.state._id,
      district: blockDoc.district._id,
      block: blockDoc._id,
      date,
      temperature: latestBlock.temperature,
      minTemperature: latestBlock.minTemperature,
      maxTemperature: latestBlock.maxTemperature,
      rainfall: latestBlock.rainfall,
      humidity: latestBlock.humidity,
      windSpeed: latestBlock.windSpeed,
      windDirection: latestBlock.windDirection,
      pressure: latestBlock.pressure,
      cloudCover: latestBlock.cloudCover,
      weatherCondition: latestBlock.weatherCondition,
      probabilityOfRain: latestBlock.probabilityOfRain,
      source: 'IMD Block Bulletin',
      forecastType: 'forecast',
    });
  }

  const panchayats = await Panchayat.find({ block: blockId }).sort({ name: 1 });
  if (!panchayats.length) {
    throw new AppError('No Panchayats found under this Block.', 404);
  }

  const simulatedList = await generatePanchayatForecast(
    blockWeather,
    panchayats,
    blockDoc
  );

  const savedForecasts = [];
  for (const sim of simulatedList) {
    const { risk, ...dbPayload } = sim;
    const saved = await WeatherForecast.findOneAndUpdate(
      {
        locationType: 'panchayat',
        block: blockDoc._id,
        panchayat: sim.panchayat,
        date,
      },
      dbPayload,
      { new: true, upsert: true, runValidators: true }
    )
      .populate('panchayat', 'name latitude longitude elevation area population vegetationFactor')
      .populate('block', 'name centerLatitude centerLongitude')
      .populate('district', 'name code')
      .populate('state', 'name code')
      .lean();

    savedForecasts.push({
      ...saved,
      risk,
    });
  }

  return sendSuccess(
    res,
    `Generated prototype simulated downscaled forecasts for ${savedForecasts.length} Panchayats in ${blockDoc.name} (${date})`,
    {
      disclaimer:
        'Panchayat-level forecasts shown in this prototype are simulated downscaled outputs. AI/ML-based operational downscaling will be integrated in a future version.',
      block: blockDoc,
      blockWeather: {
        ...blockWeather.toObject(),
        risk: calculateWeatherRisk(blockWeather),
      },
      panchayatForecasts: savedForecasts,
    }
  );
});

/**
 * GET /api/downscaling/:panchayatId
 * Fetches downscaled forecasts for a specific Panchayat along with parent Block comparison metadata
 */
export const getDownscaledByPanchayat = asyncHandler(async (req, res) => {
  const { panchayatId } = req.params;
  const panchayat = await Panchayat.findById(panchayatId)
    .populate('block', 'name centerLatitude centerLongitude elevation')
    .populate('district', 'name code')
    .populate('state', 'name code')
    .lean();

  if (!panchayat) {
    throw new AppError('Panchayat not found.', 404);
  }

  const forecasts = await WeatherForecast.find({
    locationType: 'panchayat',
    panchayat: panchayatId,
  })
    .sort({ date: 1 })
    .lean();

  const enriched = forecasts.map((f) => ({
    ...f,
    risk: calculateWeatherRisk(f),
  }));

  return sendSuccess(
    res,
    'Simulated downscaled Panchayat forecasts retrieved successfully',
    {
      disclaimer:
        'Panchayat-level forecasts shown in this prototype are simulated downscaled outputs. AI/ML-based operational downscaling will be integrated in a future version.',
      panchayat,
      forecasts: enriched,
    }
  );
});
