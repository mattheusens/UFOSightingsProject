import IUFOSighting from "../types/interfaces";
import React, { useEffect, useState } from "react";

interface ISightingsContext {
  sightings: IUFOSighting[];
}

export const SightingsContext = React.createContext<ISightingsContext>({
  sightings: [],
});

export const SightingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sightings, setSightings] = useState<IUFOSighting[]>([]);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        let result = await fetch(
          "https://sampleapis.assimilate.be/ufo/sightings"
        );
        let data = await result.json();
        setSightings(data);
      } catch (erro) {
        console.error("Kan API niet ophalen.");
      }
    };
    fetchSightings();
  }, []);

  return (
    <SightingsContext.Provider value={{ sightings }}>
      {children}
    </SightingsContext.Provider>
  );
};
