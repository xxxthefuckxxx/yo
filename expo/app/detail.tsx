// Detail route — car detail screen

import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { theme } from "@/constants/theme";
import { useNav } from "@/lib/nav-context";
import { CarDetailScreen } from "@/screens/CarDetailScreen";

export default function DetailRoute() {
  const { selectedCar, clearSelected } = useNav();

  useEffect(() => {
    return () => clearSelected();
  }, [clearSelected]);

  if (!selectedCar) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.textSecondary }}>Annonce introuvable</Text>
      </View>
    );
  }

  return <CarDetailScreen car={selectedCar} onBack={() => router.back()} />;
}
