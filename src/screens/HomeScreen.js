import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable, Animated, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const categories = ['Tümü', 'Müzik', 'Teknoloji', 'Spor', 'Sanat'];

const EventCard = ({ event, navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => navigation.navigate('EventDetail', { event })}
    >
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image source={{ uri: event.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.info}>{event.date} - {event.time}</Text>
          <Text style={styles.info}>{event.location}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,       // 🔥 önemli!
          ...doc.data(),
        }));
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Hata:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'Tümü') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => event.category === category);
      setFilteredEvents(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Etkinlikler</Text>

      <View style={styles.filterRow}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleFilter(category)}
            style={[
              styles.filterButtonFixed,
              selectedCategory === category && styles.selectedFilter,
            ]}
          >
            <Text style={selectedCategory === category ? styles.selectedText : styles.filterText}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} navigation={navigation} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign: 'center' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12, marginBottom: 12 },
  filterButtonFixed: { flex: 1, backgroundColor: '#E0E0E0', borderRadius: 20, paddingVertical: 10, marginHorizontal: 4, alignItems: 'center' },
  selectedFilter: { backgroundColor: '#4CAF50' },
  filterText: { color: '#333', fontWeight: '500', fontSize: 14 },
  selectedText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5 },
  image: { width: '100%', height: 180 },
  cardContent: { padding: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  info: { fontSize: 14, color: '#555' },
});
