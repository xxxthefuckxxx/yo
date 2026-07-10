// Home tab entry — wires navigation to the HomeScreen

import { router } from "expo-router";
import { useNav } from "@/lib/nav-context";
import { HomeScreen } from "@/screens/HomeScreen";
import type { CarListing } from "@/types/car";

export default function HomeTab() {
  const { selectCar } = useNav();
  return (
    <HomeScreen
      onCarPress={(car: CarListing) => {
        selectCar(car);
        router.push("/detail");
      }}
      onGoToFavorites={() => router.push("/favorites")}
    />
  );
}
