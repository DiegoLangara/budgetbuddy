import React from 'react';
import { useLoading } from "../../contexts/LandingContext";
import Loading from './Loading';

const LoadingScreen = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loading-screen">
      <Loading />
    </div>
  );
};

export default LoadingScreen;
