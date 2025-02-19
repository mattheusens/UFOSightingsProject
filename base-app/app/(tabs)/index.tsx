"use dom";

import {
  MapContainer,
  Marker,
  Popup,
  SVGOverlay,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import IUFOSighting from "../types/interfaces";

const position: LatLngTuple = [51.505, -0.09];

/*interface LocationHandlerProps {
  addMarker: (lat: number, lng: number) => void;
}

const LocationHandler = ({ addMarker }: LocationHandlerProps) => {
  const map = useMapEvents({
    dragend: () => {
      console.log(map.getCenter());
    },
    click: (e) => {
      addMarker(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};*/

export default function Index() {
  const [UFOSightings, SetUFOSightings] = useState<IUFOSighting[]>([]);

  const iconX = L.icon({
    iconUrl: "https://www.clipartbest.com/cliparts/nTX/ojB/nTXojBzqc.png",
    iconSize: [48, 48],
    popupAnchor: [-3, 0],
  });

  useEffect(() => {
    const fetchSightings = async () => {
      let result = await fetch(
        "https://sampleapis.assimilate.be/ufo/sightings"
      );
      let json: IUFOSighting[] = await result.json();
      SetUFOSightings(json);
    };
    fetchSightings();
  }, []);

  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={13}
      scrollWheelZoom={true}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      attributionControl={false}
    >
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreretmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {UFOSightings.map((item, index) => (
        <Marker
          key={index}
          position={[item.location.latitude, item.location.longitude]}
          icon={iconX}
        >
          <Popup>
            <View style={styles.popup}>
              <Link
                href={{
                  pathname: "/list/[id]",
                  params: { id: item.id },
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.witnessName}</Text>
              </Link>
            </View>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

const styles = StyleSheet.create({
  popup: {
    backgroundColor: "white",
    padding: 10,
    width: 150,
  },
});
