import { useContext } from 'react';
import { LocationContext } from '../context/LocationContext';

export const useLocationFilter = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationFilter must be used within a LocationProvider');
  }
  return context;
};
