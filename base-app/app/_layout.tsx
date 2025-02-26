import { Stack } from "expo-router";
import { SightingsProvider } from "./contexts/SightingsContext";
import { LocationProvider } from "./contexts/LocationContext";

export default function RootLayout() {
  return (
    <SightingsProvider>
      <LocationProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="list/[id]"
            options={{ presentation: "modal", headerShown: true }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </LocationProvider>
    </SightingsProvider>
  );
}
