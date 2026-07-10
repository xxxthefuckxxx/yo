// Favorites tab entry

import { router } from "expo-router";
import { useNav } from "@/lib/nav-context";
import { FavoritesScreen } from "@/screens/FavoritesScreen";
import type { CarListing } from "@/types/car";

export default function FavoritesTab() {
  const { selectCar } = useNav();
  return (
    <FavoritesScreen
      onBack={() => router.push("/")}
      onCarPress={(car: CarListing) => {
        selectCar(car);
        router.push("/detail");
      }}
    />
  );
}
