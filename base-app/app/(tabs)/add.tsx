import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  Pressable,
} from "react-native";
import IUFOSighting from "../types/interfaces";
import { useContext, useState } from "react";
import { SightingsContext } from "../contexts/SightingsContext";

const head: string[] = [
  "Witness's name",
  "Mail",
  "Location",
  "",
  "Description",
  "Picture",
];
const helpers: string[] = [
  "Enter witness's name",
  "Mail",
  "Latitude",
  "Longitude",
  "Description",
  "Picture",
];
const keys: string[] = [
  "name",
  "mail",
  "locationLat",
  "locationLong",
  "description",
  "picture",
];

const MakeInput = ({ index }: { index: number }) => {
  if (helpers[index] == "Longitude")
    return (
      <View>
        <TextInput
          secureTextEntry={false}
          placeholder={helpers[index]}
          keyboardType="default"
          style={[styles.textinput, styles.margins]}
        />
      </View>
    );
  return (
    <View>
      <Text style={[styles.text, styles.margins]}>{head[index]}*:</Text>
      <TextInput
        secureTextEntry={false}
        placeholder={helpers[index]}
        keyboardType="default"
        style={[styles.textinput, styles.margins]}
      />
    </View>
  );
};

const addNewSighting = (sightings: IUFOSighting[]) => {
  console.log("hey");
};

export default function Add() {
  const { sightings, setSightings } = useContext(SightingsContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={head}
        renderItem={({ item, index }) => <MakeInput index={index} />}
        keyExtractor={(item, index) => keys[index]}
      />
      <Pressable onPress={() => {}}>Add sighting</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontWeight: "bold",
  },
  textinput: {
    borderColor: "black",
    backgroundColor: "white",
    width: "90%",
    paddingLeft: "2%",
    borderWidth: 1,
  },
  margins: {
    marginTop: "2.5%",
    marginLeft: "5%",
  },
});
