"use dom";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { SightingsContext } from "../contexts/SightingsContext";
import { Link } from "expo-router";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LocationContext } from "../contexts/LocationContext";

interface LocationHandlerProps {
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
};

export default function Index() {
  const { sightings } = useContext(SightingsContext);
  const { setLocation } = useContext(LocationContext);

  const iconX = L.icon({
    iconUrl: "http://www.clipartbest.com/cliparts/nTX/ojB/nTXojBzqc.png",
    iconSize: [48, 48],
    popupAnchor: [-3, 0],
  });

  const addLocation = (lat: number, lng: number) => {
    setLocation({
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
    });
  };

  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={3}
      scrollWheelZoom={true}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      attributionControl={false}
      maxBounds={L.latLngBounds([-90, -180], [90, 180])}
      maxBoundsViscosity={1.0}
      minZoom={3}
    >
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreretmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
        bounds={L.latLngBounds([-90, -180], [90, 180])}
      />

      <LocationHandler addMarker={(lat, lng) => addLocation(lat, lng)} />

      {sightings.map((item, index) => (
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
                style={{ color: "black" }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  {item.witnessName}:
                </Text>
              </Link>
              <Text>{item.description}</Text>
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
