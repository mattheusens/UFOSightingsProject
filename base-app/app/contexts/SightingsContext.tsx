import React, { useEffect, useState } from "react";
import { IUFOSighting } from "../types/interfaces.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ISightingsContext {
  sightings: IUFOSighting[];
  setSightings: (sightingsIn: IUFOSighting[]) => void;
}

export const SightingsContext = React.createContext<ISightingsContext>({
  sightings: [],
  setSightings: () => [],
});

export default SightingsContext;

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

        const storedData = await getData();
        if (storedData) {
          setSightings([...data, ...storedData]);
        } else {
          setSightings(data);
        }
      } catch (error) {
        console.error("Can't reach API.");
      }
    };
    fetchSightings();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("sightings");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      alert("Couldn't get all the UFO sightings.");
    }
  };

  return (
    <SightingsContext.Provider value={{ sightings, setSightings }}>
      {children}
    </SightingsContext.Provider>
  );
};
