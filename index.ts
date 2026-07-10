// Navigation context — holds the currently selected car for detail screen

import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useState } from "react";
import type { CarListing } from "@/types/car";

function useNavState() {
  const [selectedCar, setSelectedCar] = useState<CarListing | null>(null);

  const selectCar = useCallback((car: CarListing) => {
    setSelectedCar(car);
  }, []);

  const clearSelected = useCallback(() => {
    setSelectedCar(null);
  }, []);

  return {
    selectedCar,
    selectCar,
    clearSelected,
  };
}

export const [NavProvider, useNav] = createContextHook(useNavState);
