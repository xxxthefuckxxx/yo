// Favorites route — standalone favorites screen (navigated from home)

import { router } from "expo-router";
import { useNav } from "@/lib/nav-context";
import { FavoritesScreen } from "@/screens/FavoritesScreen";
import type { CarListing } from "@/types/car";

export default function FavoritesRoute() {
  const { selectCar } = useNav();
  return (
    <FavoritesScreen
      onBack={() => router.back()}
      onCarPress={(car: CarListing) => {
        selectCar(car);
        router.push("/detail");
      }}
    />
  );
}
