import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { IUFOSighting } from "../types/interfaces";
import { useContext, useEffect } from "react";
import { SightingsContext } from "../contexts/SightingsContext";
import { useNavigation } from "expo-router";

const head: string[] = [
  "Witness's name:",
  "Mail:",
  "Location:",
  "",
  "Description:",
  "Picture:",
];

const ListMaker = ({ item }: { item: IUFOSighting }) => {
  return (
    <View style={{ marginLeft: "5%" }}>
      <Text style={[styles.fullprop, { textDecorationLine: "underline" }]}>
        STATUS: {item.status.toUpperCase()}
      </Text>
      <Text style={styles.headprop}>
        <Text style={styles.childprop}>Witness's name: </Text>
        {item.witnessName}
      </Text>
      <Text style={styles.headprop}>
        <Text style={styles.childprop}>Witness's contact: </Text>
        {item.witnessContact}
      </Text>
      <Text style={styles.headprop}>
        <Text style={styles.childprop}>Date: </Text>
        {new Date(item.dateTime)
          .toLocaleDateString("nl-NL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/-/g, "/")}
      </Text>
      <Text style={styles.fullprop}>Location:</Text>
      <Text>
        <Text style={styles.loc}>Latitude: </Text>
        {item.location.latitude}
      </Text>
      <Text>
        <Text style={styles.loc}>Longitude: </Text>
        {item.location.longitude}
      </Text>
      <Text style={styles.headprop}>
        <Text style={styles.childprop}>Description: </Text>
        {item.description}
      </Text>
      <Text style={styles.fullprop}>Image: </Text>
      <Image
        source={{ uri: item.picture }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

export default function listId() {
  const { sightings } = useContext(SightingsContext);
  const { id } = useLocalSearchParams();
  const index = Number(id);
  const nav = useNavigation();

  const [sighting, setSighting] = useState<IUFOSighting | null>(null);

  useEffect(() => {
    const foundSighting = sightings.find((s) => s.id === index);
    setSighting(foundSighting || null);

    nav.setOptions({
      title: `UFO Sighting ${foundSighting?.witnessName}`,
    });
  }, [index, nav]);

  if (isNaN(index) || sighting == null) {
    return (
      <View>
        <Text>Not a valid id!</Text>
      </View>
    );
  }

  return (
    <View>
      <ListMaker item={sighting} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullprop: {
    marginTop: "1%",
    fontWeight: "bold",
  },
  headprop: {
    marginTop: "1%",
  },
  childprop: {
    fontWeight: "bold",
  },
  loc: {
    marginLeft: "1%",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: "1%",
  },
});
