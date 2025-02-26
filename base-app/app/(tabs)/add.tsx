import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { IUFOSighting } from "../types/interfaces.js";
import { useContext, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { SightingsContext } from "../contexts/SightingsContext";
import { LocationContext } from "../contexts/LocationContext";

const makeNewSighting = (
  idIn: string,
  name: string,
  location: { latitude: number; longitude: number },
  descript: string,
  image: string,
  mail: string
) => {
  var sighting: IUFOSighting = {
    id: idIn,
    witnessName: name,
    location: { latitude: location.latitude, longitude: location.longitude },
    description: descript,
    picture: image,
    status: "unconfirmed",
    dateTime: "2020",
    witnessContact: mail,
  };
  return sighting;
};

export default function Add() {
  const { sightings, setSightings } = useContext(SightingsContext);
  const { location, setLocation } = useContext(LocationContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mail, setMail] = useState("");
  const [image, setImage] = useState<string>("");
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const addSighting = () => {
    setSightings([
      ...sightings,
      makeNewSighting(
        (sightings.length + 1).toString(),
        name,
        location,
        description,
        image,
        mail
      ),
    ]);
    alert("Added sighting.");
    setName("");
    setDescription("");
    setMail("");
    setImage("");
    setLocation({ latitude: 0, longitude: 0 });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={[styles.text, styles.margins]}>Witness's name*:</Text>
        <TextInput
          secureTextEntry={false}
          placeholder="Enter name"
          style={[styles.textinput, styles.margins]}
          onChangeText={setName}
          value={name}
          maxLength={30}
        />
        <Text style={[styles.text, styles.margins]}>Description*:</Text>
        <TextInput
          secureTextEntry={false}
          placeholder="Enter description"
          style={[styles.textinput, styles.margins]}
          onChangeText={setDescription}
          value={description}
          maxLength={100}
        />
        <Text style={[styles.text, styles.margins]}>Contact*:</Text>
        <TextInput
          secureTextEntry={false}
          placeholder="Enter mail"
          style={[styles.textinput, styles.margins]}
          onChangeText={setMail}
          value={mail}
          maxLength={40}
        />
        <Text style={[styles.text, styles.margins]}>Location*:</Text>
        <Text style={[styles.text, styles.margins]}>
          Latitude: {location.latitude}
        </Text>
        <Text style={[styles.text, styles.margins]}>
          Longitutde: {location.longitude}
        </Text>
        <Pressable style={[styles.press, styles.margins]}>
          <Text style={styles.pressText}>Add location</Text>
        </Pressable>
        <Text style={[styles.text, styles.margins]}>Picture*:</Text>
        {image != "" ? (
          <Image
            source={{ uri: image }}
            style={[styles.image, styles.margins]}
          />
        ) : (
          <Text style={styles.margins}>No image selected.</Text>
        )}

        <Pressable
          onPress={pickImageAsync}
          style={[styles.press, styles.margins]}
        >
          <Text style={styles.pressText}>Add picture</Text>
        </Pressable>

        <Pressable
          style={[styles.pressAdd, styles.margins]}
          onPress={() => {
            addSighting();
          }}
        >
          <Text style={styles.pressText}>Add sighting</Text>
        </Pressable>
        <Text style={styles.margins}>* = required</Text>
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
    marginTop: "1%",
    marginLeft: "5%",
  },
  press: {
    backgroundColor: "grey",
    width: "90%",
  },
  pressAdd: {
    backgroundColor: "black",
    width: "90%",
  },
  pressText: {
    color: "white",
    padding: ".5%",
    alignSelf: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
});
