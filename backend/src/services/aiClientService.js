import { env } from '../config/env.js';

/**
 * Future AI/ML Service Adapter
 * ----------------------------------------------------------------------------
 * NOTE: Not invoked in the current prototype (DOWNSCALING_PROVIDER="prototype").
 * When the Python/FastAPI ML Downscaling Model is deployed, setting
 * DOWNSCALING_PROVIDER="ai_service" will route generatePanchayatForecast()
 * through this adapter without any changes required in Controllers or React UI.
 */
export const requestAiDownscalingFromFastAPI = async (blockWeather, panchayats) => {
  const endpoint = `${env.aiServiceUrl}/api/v1/downscale`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      blockWeather,
      panchayats,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI Downscaling Service returned HTTP ${response.status}`);
  }

  return response.json();
};
