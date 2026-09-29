import React, { createContext, useState, useEffect, useContext } from 'react';
import { locationService } from '../services/locationService';
import { AuthContext } from './AuthContext';

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-10-01');
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Load states on mount
  useEffect(() => {
    const initStates = async () => {
      try {
        setLoadingLocations(true);
        const stateList = await locationService.getStates();
        setStates(stateList);

        const defaultStateId =
          user?.state?._id || user?.state || stateList[0]?._id || '';
        if (defaultStateId) {
          setSelectedState(defaultStateId);
        }
      } catch (err) {
        console.error('Failed to load states:', err);
      } finally {
        setLoadingLocations(false);
      }
    };
    initStates();
  }, [user]);

  // Load districts when state changes
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      return;
    }
    const loadDistricts = async () => {
      try {
        const list = await locationService.getDistricts(selectedState);
        setDistricts(list);
        const userDistId = user?.district?._id || user?.district;
        const match = list.find((d) => d._id === userDistId);
        setSelectedDistrict(match ? match._id : list[0]?._id || '');
      } catch (err) {
        console.error('Failed to load districts:', err);
      }
    };
    loadDistricts();
  }, [selectedState, user]);

  // Load blocks when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setBlocks([]);
      return;
    }
    const loadBlocks = async () => {
      try {
        const list = await locationService.getBlocks(selectedDistrict);
        setBlocks(list);
        const userBlockId = user?.block?._id || user?.block;
        const match = list.find((b) => b._id === userBlockId);
        setSelectedBlock(match ? match._id : list[0]?._id || '');
      } catch (err) {
        console.error('Failed to load blocks:', err);
      }
    };
    loadBlocks();
  }, [selectedDistrict, user]);

  // Load panchayats when block changes
  useEffect(() => {
    if (!selectedBlock) {
      setPanchayats([]);
      return;
    }
    const loadPanchayats = async () => {
      try {
        const list = await locationService.getPanchayatsByBlock(selectedBlock);
        setPanchayats(list);
        const userPanchayatId = user?.panchayat?._id || user?.panchayat;
        const match = list.find((p) => p._id === userPanchayatId);
        setSelectedPanchayat(match ? match._id : list[0]?._id || '');
      } catch (err) {
        console.error('Failed to load panchayats:', err);
      }
    };
    loadPanchayats();
  }, [selectedBlock, user]);

  const currentPanchayatObj =
    panchayats.find((p) => p._id === selectedPanchayat) || null;
  const currentBlockObj = blocks.find((b) => b._id === selectedBlock) || null;
  const currentDistrictObj =
    districts.find((d) => d._id === selectedDistrict) || null;
  const currentStateObj = states.find((s) => s._id === selectedState) || null;

  return (
    <LocationContext.Provider
      value={{
        states,
        districts,
        blocks,
        panchayats,
        selectedState,
        setSelectedState,
        selectedDistrict,
        setSelectedDistrict,
        selectedBlock,
        setSelectedBlock,
        selectedPanchayat,
        setSelectedPanchayat,
        selectedDate,
        setSelectedDate,
        currentStateObj,
        currentDistrictObj,
        currentBlockObj,
        currentPanchayatObj,
        loadingLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
