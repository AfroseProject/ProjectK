import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import MapView, { Marker } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import { theme } from '../theme';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Listing } from '../types/schema';

const { width, height } = Dimensions.get('window');

export const DiscoveryFeedScreen = ({ navigation }: any) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const snapshot = await firestore()
          .collection('listings')
          .where('status', '==', 'active')
          .limit(20)
          .get();
        const data = snapshot.docs.map(doc => doc.data() as Listing);
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const renderItem = ({ item }: { item: Listing }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.vegetationType}</Text>
      <Text style={styles.cardSubtitle}>{item.district} • {item.landSize} Acres</Text>
      <TouchableOpacity 
        style={styles.contactButton}
        onPress={() => navigation.navigate('ContactEnquiry', { listingId: item.listingId })}
      >
        <Text style={styles.contactButtonText}>Contact</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkeleton = () => (
    <View style={styles.card}>
      <SkeletonLoader height={24} width="60%" style={{ marginBottom: 8 }} />
      <SkeletonLoader height={16} width="40%" style={{ marginBottom: 16 }} />
      <SkeletonLoader height={40} width="100%" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.tab, viewMode === 'list' && styles.activeTab]}>
          <Text style={[styles.tabText, viewMode === 'list' && styles.activeTabText]}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('map')} style={[styles.tab, viewMode === 'map' && styles.activeTab]}>
          <Text style={[styles.tabText, viewMode === 'map' && styles.activeTabText]}>Map</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <View style={styles.listContainer}>
          {loading ? (
            Array(5).fill(0).map((_, i) => <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>)
          ) : (
            // @ts-ignore
            <FlashList
              data={listings}
              renderItem={renderItem}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 11.1271, // Tamil Nadu approx
            longitude: 78.6569,
            latitudeDelta: 5.0,
            longitudeDelta: 5.0,
          }}
        >
          {listings.map(item => (
            <Marker
              key={item.listingId}
              coordinate={item.approximateLocation}
              title={item.vegetationType}
              description={`${item.landSize} Acres`}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', backgroundColor: theme.colors.surface, elevation: 4 },
  tab: { flex: 1, padding: theme.spacing.m, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  tabText: { ...theme.typography.button, color: theme.colors.textSecondary },
  activeTabText: { color: theme.colors.primary },
  listContainer: { flex: 1, padding: theme.spacing.s },
  map: { width, height: height - 60 },
  card: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, margin: theme.spacing.s, borderRadius: 8, elevation: 2 },
  cardTitle: { ...theme.typography.h3 },
  cardSubtitle: { ...theme.typography.body2, color: theme.colors.textSecondary, marginBottom: theme.spacing.m },
  contactButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.s, borderRadius: 4, alignItems: 'center' },
  contactButtonText: { ...theme.typography.button, color: theme.colors.surface, fontSize: 14 }
});
