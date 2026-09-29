import mongoose from 'mongoose';

const weatherForecastSchema = new mongoose.Schema(
  {
    locationType: {
      type: String,
      enum: ['block', 'panchayat'],
      required: [true, 'locationType (block or panchayat) is required'],
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block',
      required: true,
    },
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Panchayat',
      default: null,
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for exact daily forecast querying
      required: [true, 'Forecast date (YYYY-MM-DD) is required'],
    },
    temperature: {
      type: Number,
      required: true,
    },
    minTemperature: {
      type: Number,
      required: true,
    },
    maxTemperature: {
      type: Number,
      required: true,
    },
    rainfall: {
      type: Number, // mm
      required: true,
      default: 0,
    },
    humidity: {
      type: Number, // %
      required: true,
    },
    windSpeed: {
      type: Number, // km/h
      required: true,
    },
    windDirection: {
      type: String,
      default: 'NW',
    },
    pressure: {
      type: Number, // hPa
      default: 1008,
    },
    cloudCover: {
      type: Number, // %
      default: 35,
    },
    weatherCondition: {
      type: String,
      enum: [
        'Clear',
        'Partly Cloudy',
        'Cloudy',
        'Light Rain',
        'Moderate Rain',
        'Heavy Rain',
        'Thunderstorm',
        'Heatwave',
      ],
      default: 'Partly Cloudy',
    },
    probabilityOfRain: {
      type: Number, // 0 - 100 %
      default: 20,
    },
    source: {
      type: String,
      default: 'IMD Block Bulletin / Prototype Downscaler v1.0',
    },
    forecastType: {
      type: String,
      enum: ['observed', 'forecast', 'simulated', 'downscaled'],
      default: 'simulated',
    },
    // Preserves spatial features and parent Block reference for future AI/ML training & evaluation
    downscalingMetadata: {
      parentBlockWeatherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeatherForecast',
        default: null,
      },
      method: {
        type: String,
        default: 'Prototype Simulated Downscaling',
      },
      distanceFromBlockKm: Number,
      elevationDeltaM: Number,
      vegetationFactor: Number,
      temperatureDelta: Number,
      rainfallMultiplier: Number,
      humidityDelta: Number,
      windDelta: Number,
    },
    attachments: [
      {
        url: String,
        publicId: String,
        label: String,
      },
    ],
  },
  { timestamps: true }
);

weatherForecastSchema.index(
  { locationType: 1, block: 1, panchayat: 1, date: 1 },
  { unique: true }
);

const WeatherForecast = mongoose.model('WeatherForecast', weatherForecastSchema);
export default WeatherForecast;
