import {
  getAllStates,
  createState,
  getDistrictsByState,
  createDistrict,
  getBlocksByDistrict,
  createBlock,
  getPanchayatsByBlock,
} from '../services/locationService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const fetchStates = asyncHandler(async (req, res) => {
  const states = await getAllStates();
  return sendSuccess(res, 'States fetched successfully', { states });
});

export const addState = asyncHandler(async (req, res) => {
  const state = await createState(req.body);
  return sendSuccess(res, 'State created successfully', { state }, 201);
});

export const fetchDistrictsByState = asyncHandler(async (req, res) => {
  const districts = await getDistrictsByState(req.params.stateId);
  return sendSuccess(res, 'Districts fetched successfully', { districts });
});

export const addDistrict = asyncHandler(async (req, res) => {
  const district = await createDistrict(req.body);
  return sendSuccess(res, 'District created successfully', { district }, 201);
});

export const fetchBlocksByDistrict = asyncHandler(async (req, res) => {
  const blocks = await getBlocksByDistrict(req.params.districtId);
  return sendSuccess(res, 'Blocks fetched successfully', { blocks });
});

export const addBlock = asyncHandler(async (req, res) => {
  const block = await createBlock(req.body);
  return sendSuccess(res, 'Block created successfully', { block }, 201);
});

export const fetchPanchayatsByBlock = asyncHandler(async (req, res) => {
  const panchayats = await getPanchayatsByBlock(req.params.blockId);
  return sendSuccess(res, 'Panchayats fetched successfully', { panchayats });
});
