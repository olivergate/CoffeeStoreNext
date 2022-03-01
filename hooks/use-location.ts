import { useContext, useState } from 'react';
import { StoreContext } from '../context/storeContext';

export type UseLocation = ReturnType<typeof useLocation>;
export const useLocation = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setIsLoading] = useState(false);
  const { dispatch } = useContext(StoreContext);
  if (!dispatch) {
    throw Error('Store is not initialised');
  }
  const success: PositionCallback = position => {
    dispatch({ type: 'SET_LATLONG', payload: `${position.coords.latitude},${position.coords.longitude}` });
    setErrorMessage('');
    setIsLoading(false);
  };
  const onFail: PositionErrorCallback = error => {
    setErrorMessage('Unable to retrieve your location');
    setIsLoading(false);
  };
  const handleTrack = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(success, onFail);
  };

  return {
    errorMessage,
    handleTrack,
    loading,
  };
};
