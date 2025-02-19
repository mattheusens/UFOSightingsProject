import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  Pressable,
  ScrollView,
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

const makeNewSighting = (
  idIn: string,
  name: string,
  descript: string,
  locLat: string,
  locLon: string,
  mail: string
) => {
  var sighting: IUFOSighting = {
    id: idIn,
    witnessName: name,
    location: { latitude: Number(locLat), longitude: Number(locLon) },
    description: descript,
    picture: "something",
    status: "unconfirmed",
    dateTime: "2020",
    witnessContact: mail,
  };
  return sighting;
};

export default function Add() {
  const { sightings, setSightings } = useContext(SightingsContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locLat, setLocLat] = useState("");
  const [locLon, setLocLon] = useState("");
  const [mail, setMail] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={[styles.text, styles.margins]}>Witness's name*:</Text>
        <TextInput
          secureTextEntry={false}
          placeholder="Enter name"
          style={[styles.textinput, styles.margins]}
          onChangeText={setName}
          maxLength={30}
        />
        <Text style={[styles.text, styles.margins]}>Description*:</Text>
        <TextInput
          secureTextEntry={false}
          placeholder="Enter description"
          style={[styles.textinput, styles.margins]}
          onChangeText={setDescription}
          maxLength={100}
        />
        <Text style={[styles.text, styles.margins]}>Location*:</Text>
        <TextInput
          secureTextEntry={false}
          placeholder="Enter latitude"
          style={[styles.textinput, styles.margins]}
          onChangeText={setLocLat}
          maxLength={100}
        />
        <TextInput
          secureTextEntry={false}
          placeholder="Enter longitude"
          style={[styles.textinput, styles.margins]}
          onChangeText={setLocLon}
          maxLength={100}
        />
        <Text style={[styles.text, styles.margins]}>Picture*:</Text>
        <Text style={[styles.text, styles.margins]}>Contact*:</Text>
        <TextInput
          secureTextEntry={false}
          placeholder="Enter mail"
          style={[styles.textinput, styles.margins]}
          onChangeText={setMail}
          maxLength={100}
        />

        <Pressable
          onPress={() => {
            setSightings([
              ...sightings,
              makeNewSighting(
                (sightings.length + 1).toString(),
                name,
                description,
                locLat,
                locLon,
                mail
              ),
            ]);
          }}
        >
          Add sighting
        </Pressable>
      </ScrollView>
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
