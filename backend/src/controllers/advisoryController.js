import {
  getAdvisories,
  getAdvisoryById,
  createAdvisory,
  updateAdvisory,
  deleteAdvisory,
} from '../services/advisoryService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listAdvisories = asyncHandler(async (req, res) => {
  const advisories = await getAdvisories(req.query);
  return sendSuccess(res, 'Advisories fetched successfully', { advisories });
});

export const fetchAdvisory = asyncHandler(async (req, res) => {
  const advisory = await getAdvisoryById(req.params.id);
  return sendSuccess(res, 'Advisory fetched successfully', { advisory });
});

export const addAdvisory = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
    panchayat: req.body.panchayat || null,
  };

  if (typeof payload.recommendations === 'string') {
    try {
      payload.recommendations = JSON.parse(payload.recommendations);
    } catch {
      payload.recommendations = payload.recommendations
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.path, 'advisories');
    if (uploaded) {
      payload.attachments = [
        {
          url: uploaded.url,
          publicId: uploaded.publicId,
          name: req.file.originalname,
          format: uploaded.format,
        },
      ];
    }
  }

  const advisory = await createAdvisory(payload);
  return sendSuccess(res, 'Advisory created successfully', { advisory }, 201);
});

export const editAdvisory = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (typeof payload.recommendations === 'string') {
    try {
      payload.recommendations = JSON.parse(payload.recommendations);
    } catch {
      payload.recommendations = payload.recommendations
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  const advisory = await updateAdvisory(req.params.id, payload);
  return sendSuccess(res, 'Advisory updated successfully', { advisory });
});

export const removeAdvisory = asyncHandler(async (req, res) => {
  await deleteAdvisory(req.params.id);
  return sendSuccess(res, 'Advisory deleted successfully', {});
});
