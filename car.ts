// Favorites context — persisted car bookmarks via AsyncStorage

import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { CarListing } from "@/types/car";

const STORAGE_KEY = "dzswoopa_favorites";
const RECENTS_KEY = "dzswoopa_recents";

function useFavoritesState() {
  const [favorites, setFavorites] = useState<CarListing[]>([]);
  const [recents, setRecents] = useState<CarListing[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const favRaw = await AsyncStorage.getItem(STORAGE_KEY);
        if (favRaw) setFavorites(JSON.parse(favRaw));
        const recRaw = await AsyncStorage.getItem(RECENTS_KEY);
        if (recRaw) setRecents(JSON.parse(recRaw));
      } catch (e) {
        console.warn("Failed to load favorites:", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist favorites
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
  }, [favorites, loaded]);

  // Persist recents
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(recents)).catch(() => {});
  }, [recents, loaded]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((c) => c.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((car: CarListing) => {
    setFavorites((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      if (exists) return prev.filter((c) => c.id !== car.id);
      return [car, ...prev];
    });
  }, []);

  const addToRecents = useCallback((car: CarListing) => {
    setRecents((prev) => {
      const filtered = prev.filter((c) => c.id !== car.id);
      return [car, ...filtered].slice(0, 20);
    });
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  return {
    favorites,
    recents,
    isFavorite,
    toggleFavorite,
    addToRecents,
    clearFavorites,
    loaded,
  };
}

export const [FavoritesProvider, useFavorites] =
  createContextHook(useFavoritesState);
