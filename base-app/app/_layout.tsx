import { Stack } from "expo-router";
import { SightingsProvider } from "./contexts/SightingsContext";

export default function RootLayout() {
  return (
    <SightingsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="list/[id]"
          options={{ presentation: "modal", headerShown: true }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SightingsProvider>
  );
}
