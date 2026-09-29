/**
 * Prototype Rule-Based Weather Risk Engine
 * Evaluates meteorological parameters and returns structured risk assessment.
 * Clearly separated from future AI/ML risk prediction models.
 */
export const calculateWeatherRisk = (weather = {}) => {
  const rainfall = Number(weather.rainfall || 0);
  const temperature = Number(weather.temperature || 0);
  const maxTemperature = Number(weather.maxTemperature || temperature);
  const minTemperature = Number(weather.minTemperature || temperature);
  const windSpeed = Number(weather.windSpeed || 0);
  const humidity = Number(weather.humidity || 0);

  // Severe Risk Thresholds
  if (rainfall > 80) {
    return {
      riskLevel: 'severe',
      riskType: 'flood_risk',
      reason: `Expected rainfall (${rainfall} mm) exceeds 80 mm (Very Heavy Rain / Localized Flood Risk)`,
      color: 'red',
    };
  }

  if (maxTemperature >= 44) {
    return {
      riskLevel: 'severe',
      riskType: 'high_temperature',
      reason: `Extreme heatwave condition (${maxTemperature}°C >= 44°C)`,
      color: 'red',
    };
  }

  // High Risk Thresholds
  if (rainfall > 50) {
    return {
      riskLevel: 'high',
      riskType: 'heavy_rain',
      reason: `Expected rainfall (${rainfall} mm) exceeds 50 mm`,
      color: 'orange',
    };
  }

  if (temperature > 40 || maxTemperature > 40) {
    return {
      riskLevel: 'high',
      riskType: 'high_temperature',
      reason: `Temperature (${Math.max(temperature, maxTemperature)}°C) exceeds 40°C heat threshold`,
      color: 'orange',
    };
  }

  if (windSpeed > 40) {
    return {
      riskLevel: 'high',
      riskType: 'strong_wind',
      reason: `Wind speed (${windSpeed} km/h) exceeds 40 km/h crop lodging threshold`,
      color: 'orange',
    };
  }

  if (minTemperature > 0 && minTemperature < 5) {
    return {
      riskLevel: 'high',
      riskType: 'low_temperature',
      reason: `Minimum temperature (${minTemperature}°C) indicates frost/cold stress risk`,
      color: 'orange',
    };
  }

  // Moderate Risk Thresholds
  if (rainfall >= 25) {
    return {
      riskLevel: 'moderate',
      riskType: 'heavy_rain',
      reason: `Moderate-to-high rainfall (${rainfall} mm) expected; monitor field drainage`,
      color: 'yellow',
    };
  }

  if (temperature >= 36 || windSpeed >= 25 || (humidity >= 85 && rainfall >= 10)) {
    return {
      riskLevel: 'moderate',
      riskType: 'thunderstorm',
      reason: `Elevated agro-meteorological stress (Temp: ${temperature}°C, Humidity: ${humidity}%, Wind: ${windSpeed} km/h)`,
      color: 'yellow',
    };
  }

  // Normal / Low Risk
  return {
    riskLevel: 'low',
    riskType: 'normal',
    reason: 'Weather parameters are within normal agro-meteorological thresholds',
    color: 'green',
  };
};
