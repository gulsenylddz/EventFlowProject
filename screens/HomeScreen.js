import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, PermissionsAndroid, Platform,
  Modal, Pressable
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native'; // Navigation için

const categories = ['Sana Özel', 'Teknoloji', 'Spor', 'Sanat', 'Tümü'];

const cityCoordinates = {
  "İstanbul": { lat: 41.0082, lon: 28.9784 },
  "Ankara": { lat: 39.9208, lon: 32.8541 },
  "İzmir": { lat: 38.4192, lon: 27.1287 },
  "Antalya": { lat: 36.8969, lon: 30.7133 },
  "Bursa": { lat: 40.1828, lon: 29.0665 },
  "Elazığ": { lat: 38.6743, lon: 39.2220 },
  "Trabzon": { lat: 41.0053, lon: 39.7225 },
  "Eskişehir": { lat: 39.7767, lon: 30.5206 },
  "Konya": { lat: 37.8714, lon: 32.4846 },
  "Adana": { lat: 37.0000, lon: 35.3213 },
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const HomeScreen = () => {
  const navigation = useNavigation(); // Navigation erişimi
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Sana Özel');
  const [userCity, setUserCity] = useState(null);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const snapshot = await db.collection('events').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(data);
        await tryGettingLocation(data);
      } catch (error) {
        console.error("Firestore HATASI:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Konum İzni',
          message: 'Yakın etkinlikleri göstermek için konum izni gerekli.',
          buttonPositive: 'Tamam',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const tryGettingLocation = async (eventList, retries = 3) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    let located = false;

    for (let i = 0; i < retries; i++) {
      await new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          (pos) => {
            console.log('✅ KONUM:', pos.coords);
            handleLocationSort(eventList, pos.coords.latitude, pos.coords.longitude);
            located = true;
            resolve();
          },
          (err) => {
            console.log(`❌ Deneme ${i + 1}:`, err.code, err.message);
            resolve();
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 10000,
          }
        );
      });
      if (located) break;
    }

    if (!located) {
      setCityModalVisible(true);
    }
  };

  const handleLocationSort = (eventList, latitude, longitude) => {
    const nearestCity = Object.entries(cityCoordinates)
      .map(([city, coords]) => ({
        city,
        distance: getDistance(latitude, longitude, coords.lat, coords.lon)
      }))
      .sort((a, b) => a.distance - b.distance)[0].city;

    setUserCity(nearestCity);
    filterEvents(activeCategory, eventList, nearestCity);
  };

  const filterEvents = (category, allEvents = events, city = userCity) => {
    let filtered;
    if (category === 'Tümü') {
      filtered = allEvents;
    } else if (category === 'Sana Özel') {
      filtered = allEvents.filter(e => e.city === city);
    } else {
      filtered = allEvents.filter(e => e.city === city && e.category === category);
    }
    setFilteredEvents(filtered);
  };

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    filterEvents(category);
  };

  const handleManualCitySelect = (city) => {
    const coords = cityCoordinates[city];
    setCityModalVisible(false);
    handleLocationSort(events, coords.lat, coords.lon);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Etkinlik Listesi</Text>

      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategoryPress(item)}
            style={[styles.filterButton, activeCategory === item && styles.selectedFilter]}
            activeOpacity={0.7}
          >
            <Text style={activeCategory === item ? styles.selectedText : styles.filterText}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EventDetail', { event: item })}
            activeOpacity={0.8}
          >
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date} - {item.time}</Text>
                <Text style={styles.location}>{item.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <Modal
        transparent
        visible={cityModalVisible}
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Şehrinizi Seçin</Text>
            {Object.keys(cityCoordinates).map((city) => (
              <Pressable key={city} onPress={() => handleManualCitySelect(city)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>{city}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign: 'center' },
  filterRow: { paddingHorizontal: 12, paddingBottom: 12 },
  filterButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFilter: { backgroundColor: '#4CAF50' },
  filterText: { color: '#333', fontWeight: '500', fontSize: 14 },
  selectedText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: { width: '100%', height: 180 },
  cardContent: { padding: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  date: { fontSize: 14, color: '#555' },
  location: { fontSize: 14, color: '#777' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  modalButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center'
  }
});

export default HomeScreen;
