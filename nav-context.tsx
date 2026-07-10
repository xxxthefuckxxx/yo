// Search & advanced filter bottom sheet

import { Search, X } from "lucide-react-native";
import { memo, useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { fetchRegions } from "@/lib/api";
import type { CarFilters, Region } from "@/types/car";

type Props = {
  visible: boolean;
  filters: CarFilters;
  onClose: () => void;
  onApply: (filters: CarFilters) => void;
};

function FilterSheetBase({ visible, filters, onClose, onApply }: Props) {
  const [local, setLocal] = useState<CarFilters>(filters);
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionsLoaded, setRegionsLoaded] = useState(false);

  useEffect(() => {
    setLocal(filters);
  }, [filters, visible]);

  useEffect(() => {
    if (visible && !regionsLoaded) {
      fetchRegions()
        .then(setRegions)
        .catch(() => {})
        .finally(() => setRegionsLoaded(true));
    }
  }, [visible, regionsLoaded]);

  const apply = useCallback(() => {
    onApply(local);
    onClose();
  }, [local, onApply, onClose]);

  const reset = useCallback(() => {
    setLocal({
      q: "",
      regionSlug: null,
      priceMin: "",
      priceMax: "",
      hasPictures: false,
      sortBy: "newest",
    });
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filtres</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <X size={20} color={theme.text} />
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.section}>
          <Text style={styles.label}>Recherche</Text>
          <View style={styles.searchWrap}>
            <Search size={16} color={theme.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Marque, modèle, mot-clé..."
              placeholderTextColor={theme.textMuted}
              value={local.q}
              onChangeText={(q) => setLocal((p) => ({ ...p, q }))}
              returnKeyType="search"
              autoCorrect={false}
            />
            {local.q.length > 0 && (
              <Pressable onPress={() => setLocal((p) => ({ ...p, q: "" }))} hitSlop={8}>
                <X size={14} color={theme.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Region */}
        <View style={styles.section}>
          <Text style={styles.label}>Wilaya</Text>
          {regions.length > 0 ? (
            <View style={styles.regionGrid}>
              <Pressable
                onPress={() => setLocal((p) => ({ ...p, regionSlug: null }))}
                style={({ pressed }) => [
                  styles.regionChip,
                  !local.regionSlug && styles.regionChipActive,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text
                  style={[
                    styles.regionChipText,
                    !local.regionSlug && styles.regionChipTextActive,
                  ]}
                >
                  Toutes les wilayas
                </Text>
              </Pressable>
              {regions.map((r) => (
                <Pressable
                  key={r.slug}
                  onPress={() => setLocal((p) => ({ ...p, regionSlug: r.slug }))}
                  style={({ pressed }) => [
                    styles.regionChip,
                    local.regionSlug === r.slug && styles.regionChipActive,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.regionChipText,
                      local.regionSlug === r.slug && styles.regionChipTextActive,
                    ]}
                  >
                    {r.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={styles.loadingText}>Chargement des wilayas...</Text>
          )}
        </View>

        {/* Price range */}
        <View style={styles.section}>
          <Text style={styles.label}>Prix (DA)</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              placeholderTextColor={theme.textMuted}
              value={local.priceMin}
              onChangeText={(v) => setLocal((p) => ({ ...p, priceMin: v }))}
              keyboardType="numeric"
            />
            <Text style={styles.priceDash}>—</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              placeholderTextColor={theme.textMuted}
              value={local.priceMax}
              onChangeText={(v) => setLocal((p) => ({ ...p, priceMax: v }))}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Has pictures toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <Text style={styles.labelInline}>Avec photos uniquement</Text>
            <Switch
              value={local.hasPictures}
              onValueChange={(v) => setLocal((p) => ({ ...p, hasPictures: v }))}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor={theme.text}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={reset}
            style={({ pressed }) => [styles.resetBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.resetText}>Réinitialiser</Text>
          </Pressable>
          <Pressable
            onPress={apply}
            style={({ pressed }) => [styles.applyBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.applyText}>Appliquer</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export const FilterSheet = memo(FilterSheetBase);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.bgElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: theme.border,
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "800",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.card,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    gap: 10,
    marginBottom: 20,
  },
  label: {
    color: theme.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  labelInline: {
    color: theme.text,
    fontSize: 15,
    fontWeight: "600",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchInput: {
    flex: 1,
    color: theme.text,
    fontSize: 15,
    padding: 0,
  },
  regionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  regionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  regionChipActive: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
  regionChipText: {
    color: theme.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  regionChipTextActive: {
    color: theme.bg,
    fontWeight: "700",
  },
  loadingText: {
    color: theme.textMuted,
    fontSize: 13,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceInput: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  priceDash: {
    color: theme.textMuted,
    fontSize: 18,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: "center",
  },
  resetText: {
    color: theme.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },
  applyBtn: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.accent,
    alignItems: "center",
  },
  applyText: {
    color: theme.bg,
    fontSize: 15,
    fontWeight: "800",
  },
  btnPressed: {
    opacity: 0.7,
  },
});
