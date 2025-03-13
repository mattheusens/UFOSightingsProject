import { Link } from "expo-router";
import { useContext } from "react";
import { Text, View, StyleSheet, FlatList, Dimensions } from "react-native";
import { IUFOSighting } from "../types/interfaces";
import { SightingsContext } from "../contexts/SightingsContext";

const SightingComponent = ({ item }: { item: IUFOSighting }) => {
  return (
    <View>
      <Text style={styles.item}>
        <Link
          href={{
            pathname: "/list/[id]",
            params: { id: item.id },
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{item.witnessName}: </Text>"
          {item.description}"{" "}
        </Link>
      </Text>
    </View>
  );
};

export default function List() {
  const { sightings } = useContext(SightingsContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={sightings}
        renderItem={({ item }) => <SightingComponent item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    width: "90%",
  },
  item: {
    marginTop: "2.5%",
  },
});
