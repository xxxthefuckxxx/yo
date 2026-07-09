// Favorites screen — saved car listings

import { Image } from "expo-image";
import { ArrowLeft, Heart, Trash2 } from "lucide-react-native";
import { useCallback } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { formatPrice, formatRelativeTime, getCarMake } from "@/lib/api";
import { useFavorites } from "@/lib/favorites-context";
import type { CarListing } from "@/types/car";

type Props = {
  onBack: () => void;
  onCarPress: (car: CarListing) => void;
};

export function FavoritesScreen({ onBack, onCarPress }: Props) {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();

  const renderFav = useCallback(
    ({ item }: { item: CarListing }) => {
      const make = getCarMake(item.title);
      return (
        <Pressable
          onPress={() => onCarPress(item)}
          style={({ pressed }) => [styles.card, pressed && styles.btnPressed]}
        >
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              contentFit="cover"
              recyclingKey={item.id}
            />
          ) : (
            <View style={[styles.cardImage, styles.cardPlaceholder]}>
              <Text style={styles.placeholderText}>No img</Text>
            </View>
          )}
          <View style={styles.cardBody}>
            <View style={styles.cardTopRow}>
              <View style={styles.cardMakeBadge}>
                <Text style={styles.cardMakeText}>{make}</Text>
              </View>
              <Pressable
                onPress={() => toggleFavorite(item)}
                hitSlop={10}
                style={styles.removeBtn}
              >
                <Trash2 size={14} color={theme.danger} />
              </Pressable>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardPrice} numberOfLines={1}>
              {formatPrice(item.price, item.pricePreview, item.priceUnit)}
            </Text>
            <View style={styles.cardFooter}>
              {item.cityName && (
                <Text style={styles.cardLocation} numberOfLines={1}>
                  {item.cityName}
                </Text>
              )}
              <Text style={styles.cardTime}>
                {formatRelativeTime(item.createdAt)}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [onCarPress, toggleFavorite]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
          >
            <ArrowLeft size={20} color={theme.text} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Heart size={18} color={theme.accent} fill={theme.accent} />
            <Text style={styles.headerTitle}>Favoris</Text>
          </View>
        </View>
        {favorites.length > 0 && (
          <Pressable
            onPress={clearFavorites}
            hitSlop={8}
            style={({ pressed }) => [styles.clearBtn, pressed && styles.btnPressed]}
          >
            <Trash2 size={13} color={theme.danger} />
            <Text style={styles.clearText}>Tout effacer</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFav}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Heart size={56} color={theme.border} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Aucun favori</Text>
            <Text style={styles.emptyMsg}>
              Touchez le cœur sur une annonce pour la sauvegarder ici
            </Text>
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [styles.browseBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.browseText}>Parcourir les voitures</Text>
            </Pressable>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {}}
            tintColor={theme.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "900",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(229,72,77,0.12)",
    borderWidth: 1,
    borderColor: "rgba(229,72,77,0.25)",
  },
  clearText: {
    color: theme.danger,
    fontSize: 12,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardImage: {
    width: 120,
    height: "100%",
    minHeight: 120,
  },
  cardPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.bgElevated,
  },
  placeholderText: {
    color: theme.textMuted,
    fontSize: 11,
  },
  cardBody: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardMakeBadge: {
    backgroundColor: "rgba(232,112,58,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(232,112,58,0.25)",
  },
  cardMakeText: {
    color: theme.accentBright,
    fontSize: 10,
    fontWeight: "800",
  },
  removeBtn: {
    padding: 4,
  },
  cardTitle: {
    color: theme.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },
  cardPrice: {
    color: theme.accentBright,
    fontSize: 16,
    fontWeight: "800",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardLocation: {
    color: theme.textSecondary,
    fontSize: 11,
    flexShrink: 1,
  },
  cardTime: {
    color: theme.textMuted,
    fontSize: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "800",
  },
  emptyMsg: {
    color: theme.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  browseBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.accent,
  },
  browseText: {
    color: theme.bg,
    fontSize: 14,
    fontWeight: "800",
  },
  btnPressed: {
    opacity: 0.7,
  },
});
