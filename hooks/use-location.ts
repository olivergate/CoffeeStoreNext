import { useState } from 'react';

export type UseLocation = ReturnType<typeof useLocation>;
export const useLocation = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [latLong, setlatLong] = useState('');
  const [loading, setIsLoading] = useState(false);

  const success: PositionCallback = position => {
    setlatLong(`${position.coords.latitude}, ${position.coords.longitude}`);
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
    latLong,
    handleTrack,
    loading,
  };
};
