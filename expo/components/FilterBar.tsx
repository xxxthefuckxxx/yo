// Filter bar + sort + make quick chips for the home screen

import { ChevronDown, SlidersHorizontal, X } from "lucide-react-native";
import { memo, useCallback, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import type { CarFilters, SortOption } from "@/types/car";

type Props = {
  filters: CarFilters;
  onChange: (filters: CarFilters) => void;
  totalCount: number;
};

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Plus récents",
  priceLow: "Prix croissant",
  priceHigh: "Prix décroissant",
};

function FilterBarBase({ filters, onChange, totalCount }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const hasActiveFilters =
    filters.q !== "" ||
    filters.regionSlug !== null ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.hasPictures;

  const updateSort = useCallback(
    (sortBy: SortOption) => {
      onChange({ ...filters, sortBy });
      setSortOpen(false);
    },
    [filters, onChange]
  );

  const clearFilters = useCallback(() => {
    onChange({
      ...filters,
      q: "",
      regionSlug: null,
      priceMin: "",
      priceMax: "",
      hasPictures: false,
    });
  }, [filters, onChange]);

  return (
    <View style={styles.container}>
      {/* Row 1: count + sort */}
      <View style={styles.topRow}>
        <Text style={styles.countText}>
          {totalCount > 0
            ? `${totalCount} annonce${totalCount > 1 ? "s" : ""}`
            : "Aucune annonce"}
        </Text>

        <View style={styles.sortWrap}>
          {hasActiveFilters && (
            <Pressable
              onPress={clearFilters}
              hitSlop={8}
              style={({ pressed }) => [styles.clearBtn, pressed && styles.btnPressed]}
            >
              <X size={13} color={theme.textSecondary} />
              <Text style={styles.clearText}>Effacer</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => setSortOpen((v) => !v)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.sortBtn,
              sortOpen && styles.sortBtnActive,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.sortText}>{SORT_LABELS[filters.sortBy]}</Text>
            <ChevronDown
              size={14}
              color={theme.textSecondary}
              style={{ transform: [{ rotate: sortOpen ? "180deg" : "0deg" }] }}
            />
          </Pressable>
        </View>
      </View>

      {/* Sort dropdown */}
      {sortOpen && (
        <View style={styles.sortDropdown}>
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <Pressable
              key={key}
              onPress={() => updateSort(key)}
              style={({ pressed }) => [
                styles.sortOption,
                filters.sortBy === key && styles.sortOptionActive,
                pressed && styles.btnPressed,
              ]}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  filters.sortBy === key && styles.sortOptionTextActive,
                ]}
              >
                {SORT_LABELS[key]}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export const FilterBar = memo(FilterBarBase);

type RegionFilterProps = {
  selectedRegion: string | null;
  onSelect: (slug: string | null) => void;
};

// Inline region quick-pick (horizontal scroll of wilaya chips)
export function RegionChips({ selectedRegion, onSelect }: RegionFilterProps) {
  const regions = [
    { slug: "alger", name: "Alger" },
    { slug: "oran", name: "Oran" },
    { slug: "constantine", name: "Constantine" },
    { slug: "annaba", name: "Annaba" },
    { slug: "setif", name: "Sétif" },
    { slug: "blida", name: "Blida" },
    { slug: "tizi", name: "Tizi Ouzou" },
    { slug: "bejaia", name: "Béjaïa" },
    { slug: "tlemcen", name: "Tlemcen" },
    { slug: "batna", name: "Batna" },
    { slug: "djelfa", name: "Djelfa" },
    { slug: "ouargla", name: "Ouargla" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsScroll}
      style={styles.chipsContainer}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={({ pressed }) => [
          styles.chip,
          !selectedRegion && styles.chipActive,
          pressed && styles.btnPressed,
        ]}
      >
        <SlidersHorizontal size={12} color={!selectedRegion ? theme.bg : theme.textSecondary} />
        <Text
          style={[
            styles.chipText,
            !selectedRegion && styles.chipTextActive,
          ]}
        >
          Toutes
        </Text>
      </Pressable>
      {regions.map((r) => (
        <Pressable
          key={r.slug}
          onPress={() => onSelect(r.slug)}
          style={({ pressed }) => [
            styles.chip,
            selectedRegion === r.slug && styles.chipActive,
            pressed && styles.btnPressed,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              selectedRegion === r.slug && styles.chipTextActive,
            ]}
          >
            {r.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  countText: {
    color: theme.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  sortWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  clearText: {
    color: theme.textSecondary,
    fontSize: 11,
    fontWeight: "500",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sortBtnActive: {
    borderColor: theme.accent,
  },
  sortText: {
    color: theme.text,
    fontSize: 12,
    fontWeight: "600",
  },
  sortDropdown: {
    marginHorizontal: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: "hidden",
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sortOptionActive: {
    backgroundColor: "rgba(232,112,58,0.12)",
  },
  sortOptionText: {
    color: theme.textSecondary,
    fontSize: 13,
  },
  sortOptionTextActive: {
    color: theme.accentBright,
    fontWeight: "700",
  },
  btnPressed: {
    opacity: 0.7,
  },
  chipsContainer: {
    maxHeight: 38,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    height: 32,
  },
  chipActive: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
  chipText: {
    color: theme.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: theme.bg,
    fontWeight: "700",
  },
});
