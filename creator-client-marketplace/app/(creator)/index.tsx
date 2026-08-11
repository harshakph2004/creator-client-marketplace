import { router, Stack } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { getProjects } from "../../services/api";
import { clearAuth, getToken } from "../../services/auth";
import {
  Colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

type Project = {
  id: number;
  title: string;
  description: string;
  platform: string | null;
  contentType: string | null;
  niche: string | null;
  deliverables: string | null;
  budget: number | null;
  minFollowers: number | null;
  deadline: string | null;
  client: {
    id: number;
    name: string;
    brandProfile?: {
      companyName: string | null;
    } | null;
  };
};

const colors = Colors.light;

const filters = ["All", "Instagram", "YouTube", "TikTok"];

export default function CreatorHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const loadProjects = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const result = await getProjects(token);

      console.log("CAMPAIGNS:", result);

      setProjects(result.projects || []);
    } catch (error) {
      console.error("CAMPAIGN LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      project.title.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText) ||
      project.niche?.toLowerCase().includes(searchText) ||
      project.client.name.toLowerCase().includes(searchText) ||
      project.client.brandProfile?.companyName
        ?.toLowerCase()
        .includes(searchText);

    const matchesFilter =
      selectedFilter === "All" ||
      project.platform?.toLowerCase() === selectedFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Find Campaigns</Text>

              <Text style={styles.subtitle}>
                Discover opportunities from brands.
              </Text>
            </View>

            <Pressable
              style={styles.profileButton}
              onPress={() => {
                console.log("PROFILE CLICKED");
                router.push("/(creator)/profile");
              }}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </Pressable>
          </View>

          {/* Search */}

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>⌕</Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search campaigns..."
              placeholderTextColor={colors.mutedText}
              style={styles.searchInput}
            />
          </View>

          {/* Filters */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {filters.map((filter) => {
              const active = selectedFilter === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={[
                    styles.filterChip,
                    active && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      active && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Section */}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Recommended Campaigns
              </Text>

              <Text style={styles.sectionSubtitle}>
                Find the right opportunity for you.
              </Text>
            </View>
          </View>

          {/* Loading */}

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
                color={colors.primary}
              />

              <Text style={styles.loadingText}>
                Loading campaigns...
              </Text>
            </View>
          ) : filteredProjects.length === 0 ? (
            /* Empty */

            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Text>🔎</Text>
              </View>

              <Text style={styles.emptyTitle}>
                No campaigns found
              </Text>

              <Text style={styles.emptyText}>
                Try changing your search or filter.
              </Text>
            </View>
          ) : (
            /* Campaigns */

            filteredProjects.map((project) => {
              const companyName =
                project.client.brandProfile?.companyName ||
                project.client.name;

              return (
                <Pressable
                  key={project.id}
                  style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() =>
                     //console.log("🔥 CAMPAIGN PRESSED")
                    router.push({
                      pathname: "/(creator)/project-details",
                      params: {
                        id: String(project.id),
                      },
                    })
                  }
                >
                  {/* Brand */}

                  <View style={styles.brandRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {companyName.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.brandInfo}>
                      <Text style={styles.brandName}>
                        {companyName}
                      </Text>

                      <Text style={styles.postedText}>
                        Campaign opportunity
                      </Text>
                    </View>

                    {project.platform && (
                      <View style={styles.platformBadge}>
                        <Text style={styles.platformText}>
                          {project.platform}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Campaign title */}

                  <Text style={styles.projectTitle}>
                    {project.title}
                  </Text>

                  {/* Niche */}

                  {project.niche && (
                    <View style={styles.nicheChip}>
                      <Text style={styles.nicheText}>
                        {project.niche}
                      </Text>
                    </View>
                  )}

                  {/* Description */}

                  <Text
                    style={styles.description}
                    numberOfLines={3}
                  >
                    {project.description}
                  </Text>

                  {/* Content / Deliverables */}

                  {(project.contentType ||
                    project.deliverables) && (
                    <View style={styles.details}>
                      {project.contentType && (
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>
                            CONTENT
                          </Text>

                          <Text
                            style={styles.detailValue}
                            numberOfLines={1}
                          >
                            {project.contentType}
                          </Text>
                        </View>
                      )}

                      {project.deliverables && (
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>
                            DELIVERABLES
                          </Text>

                          <Text
                            style={styles.detailValue}
                            numberOfLines={1}
                          >
                            {project.deliverables}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Stats */}

                  <View style={styles.stats}>
                    {project.minFollowers !== null && (
                      <View style={styles.stat}>
                        <Text style={styles.statLabel}>
                          FOLLOWERS
                        </Text>

                        <Text style={styles.statValue}>
                          {project.minFollowers.toLocaleString()}+
                        </Text>
                      </View>
                    )}

                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>
                        BUDGET
                      </Text>

                      <Text style={styles.statValue}>
                        {project.budget
                          ? `₹${project.budget.toLocaleString()}`
                          : "Negotiable"}
                      </Text>
                    </View>

                    {project.deadline && (
                      <View style={styles.stat}>
                        <Text style={styles.statLabel}>
                          DEADLINE
                        </Text>

                        <Text style={styles.statValue}>
                          {new Date(
                            project.deadline
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* CTA */}

                  <View style={styles.viewRow}>
                    <Text style={styles.viewText}>
                      View Campaign
                    </Text>

                    <Text style={styles.arrow}>→</Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>

        {/* Bottom Navigation */}

       
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 56,
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  headerContent: {
    flex: 1,
  },

  title: {
    color: colors.text,
    ...typography.screenTitle,
  },

  subtitle: {
    marginTop: spacing.sm,
    color: colors.secondaryText,
    fontSize: 14,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  profileIcon: {
    fontSize: 19,
  },

  searchContainer: {
    height: 52,
    marginTop: spacing.xl,
    borderRadius: radius.input,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },

  searchIcon: {
    fontSize: 25,
    color: colors.mutedText,
    marginRight: spacing.sm,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    color: colors.text,
    fontSize: 15,
  },

  filters: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },

  filterChip: {
    paddingHorizontal: spacing.lg,
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },

  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },

  filterTextActive: {
    color: colors.card,
  },

  sectionHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    color: colors.text,
    ...typography.sectionTitle,
  },

  sectionSubtitle: {
    marginTop: 4,
    color: colors.secondaryText,
    fontSize: 13,
  },

  loading: {
    alignItems: "center",
    paddingTop: spacing.xxl,
  },

  loadingText: {
    marginTop: spacing.md,
    color: colors.secondaryText,
    fontSize: 14,
  },

  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  cardPressed: {
    opacity: 0.92,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800",
  },

  brandInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  brandName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  postedText: {
    marginTop: 2,
    color: colors.mutedText,
    fontSize: 12,
  },

  platformBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "#F0EEFF",
  },

  platformText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  projectTitle: {
    marginTop: spacing.lg,
    color: colors.text,
    ...typography.cardTitle,
  },

  nicheChip: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "#F3F3F4",
  },

  nicheText: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
  },

  description: {
    marginTop: spacing.md,
    color: "#4B4B4B",
    fontSize: 14,
    lineHeight: 21,
  },

  details: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  detailItem: {
    marginBottom: spacing.sm,
  },

  detailLabel: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  detailValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  stat: {
    flex: 1,
  },

  statLabel: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  statValue: {
    marginTop: 4,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  viewRow: {
    marginTop: spacing.lg,
    height: 44,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  viewText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: "700",
  },

  arrow: {
    marginLeft: spacing.sm,
    color: colors.card,
    fontSize: 18,
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: spacing.sm,
    color: colors.secondaryText,
    fontSize: 14,
    textAlign: "center",
  },

});