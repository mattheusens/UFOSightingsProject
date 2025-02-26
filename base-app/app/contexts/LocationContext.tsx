import React, { useState } from "react";

interface ILocationContext {
  location: { latitude: number; longitude: number };
  setLocation: (location: { latitude: number; longitude: number }) => void;
}

export const LocationContext = React.createContext<ILocationContext>({
  location: { latitude: 0, longitude: 0 },
  setLocation: () => {},
});

export default LocationContext;

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
