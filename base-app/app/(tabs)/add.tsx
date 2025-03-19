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
import { useContext, useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SightingsContext } from "../contexts/SightingsContext";
import { LocationContext } from "../contexts/LocationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const makeNewSighting = (
  idIn: number,
  name: string,
  location: { latitude: number; longitude: number },
  descript: string,
  image: string,
  mail: string,
  date: string,
  tries: number
) => {
  if (tries < 1 && (location.latitude == 0 || location.longitude == 0)) {
    alert("Are you sure this is the right location?");
    return "location";
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(mail)) {
    alert("Not a valid email!");
    return "email";
  }

  if (new Date(date) > new Date()) {
    alert("Date can't be in the future!");
    return "date";
  }

  if (name == "" || descript == "" || mail == "" || image == "") {
    alert("Required fields must be filled in!");
    return "required";
  }

  var sighting: IUFOSighting = {
    id: idIn,
    witnessName: name,
    location: { latitude: location.latitude, longitude: location.longitude },
    description: descript,
    picture: image,
    status: "unconfirmed",
    dateTime: new Date(date + "T00:00:00").toISOString(),
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
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState<string>("");
  const [tries, setTries] = useState(0);

  const ref = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [wantPicture, setWantPicture] = useState<Boolean>(false);

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

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "ufo_sighting.jpg";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Fout bij downloaden:", error);
    }
  };

  const takePictureAsync = async () => {
    const photo = await ref.current?.takePictureAsync();
    setImage(photo?.uri ?? "");
    console.log(photo?.uri);
    setWantPicture(false);

    if (photo) {
      downloadImage(photo.uri);
    }
  };

  const addSighting = async () => {
    var newSighting: IUFOSighting | string = makeNewSighting(
      sightings.length + 1,
      name,
      location,
      description,
      image,
      mail,
      date,
      tries
    );

    if (typeof newSighting === "string") {
      if (newSighting === "location") {
        setTries(tries + 1);
      }
      return;
    }

    setTries(0);

    setSightings([...sightings, newSighting]);
    await storeData(newSighting);

    alert("Added sighting.");
    setName("");
    setDescription("");
    setMail("");
    setDate(new Date().toISOString().split("T")[0]);
    setLocation({ latitude: 0, longitude: 0 });
    setImage("");
  };

  const storeData = async (newSighting: IUFOSighting) => {
    try {
      const jsonValueOut = await AsyncStorage.getItem("sightings");
      const jsonValue = jsonValueOut ? JSON.parse(jsonValueOut) : [];

      jsonValue.push(newSighting);

      await AsyncStorage.setItem("sightings", JSON.stringify(jsonValue));
    } catch (e) {
      alert("Your sighting is only temporary.");
    }
  };

  if (permission?.granted && wantPicture) {
    return (
      <View style={styles.container}>
        <CameraView ref={ref} style={styles.camera} facing={"front"}>
          <Pressable onPress={takePictureAsync} style={styles.buttonCamera}>
            <Text style={styles.buttonCameraText}>Take picture</Text>
          </Pressable>
        </CameraView>
      </View>
    );
  }

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
        <Text style={[styles.text, styles.margins]}>Date*:</Text>
        <input
          type="date"
          value={date}
          style={{ ...styles.dateinput, ...styles.margins }}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
        <Text style={[styles.text, styles.margins]}>
          Location (click on the map):
        </Text>
        <Text style={[styles.text, styles.marginsExtra]}>
          Latitude: {location.latitude}
        </Text>
        <Text style={[styles.text, styles.marginsExtra]}>
          Longitude: {location.longitude}
        </Text>
        <Text style={[styles.text, styles.margins]}>Picture*:</Text>
        {image != "" ? (
          <Image
            source={{ uri: image }}
            style={[styles.image, styles.margins]}
          />
        ) : (
          <Text style={styles.margins}>No image selected.</Text>
        )}

        <View style={styles.pressContainer}>
          <Pressable
            onPress={pickImageAsync}
            style={[styles.press, styles.margins]}
          >
            <Text style={styles.pressText}>Choose image</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              requestPermission();
              setWantPicture(true);
            }}
            style={[styles.press, styles.margins]}
          >
            <Text style={styles.pressText}>Take picture</Text>
          </Pressable>
        </View>
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
    height: 30,
    paddingLeft: "2%",
    borderWidth: 1,
  },
  dateinput: {
    borderColor: "black",
    backgroundColor: "white",
    width: "87.9%",
    height: 30,
    paddingLeft: "2%",
    borderWidth: 1,
  },
  margins: {
    marginTop: "1%",
    marginLeft: "5%",
  },
  marginsExtra: {
    marginTop: "1%",
    marginLeft: "7%",
  },
  pressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  press: {
    backgroundColor: "grey",
    width: "42.5%",
  },
  pressAdd: {
    backgroundColor: "black",
    width: "90%",
  },
  pressText: {
    color: "white",
    height: 40,
    alignContent: "center",
    margin: "auto",
  },
  image: {
    width: 100,
    height: 100,
  },
  camera: {
    flex: 1,
  },
  buttonCamera: {
    backgroundColor: "white",
    width: 110,
    height: 40,
    borderRadius: "2rem",
    margin: "auto",
    marginBottom: 30,
  },
  buttonCameraText: {
    fontSize: 18,
    marginTop: 7,
    marginLeft: 7,
  },
});
