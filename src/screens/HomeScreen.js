
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// LOKAL GÖRSELLERİ İMPORT EDİYORUZ
import MusicImage from '../assets/hanny-naibaho-aWXVxy8BSzc-unsplash.jpg';
import TechImage from '../assets/alex-knight-2EJCSULRwC8-unsplash.jpg';
import SportImage from '../assets/austris-augusts-52p1K0d0euM-unsplash.jpg';
import ArtImage from '../assets/dan-farrell-fT49QnFucQ8-unsplash.jpg';

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();
  const handleLogout = () => {
    navigation.navigate('Welcome');
  };
  useEffect(() => {
    fetch('https://680e5f6967c5abddd191ede6.mockapi.io/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('API ERROR:', error));
  }, []);

  const getImage = (title) => {
    if (title.includes('Music') || title.includes('Müzik')) return MusicImage;
    if (title.includes('Tech') || title.includes('Teknoloji')) return TechImage;
    if (title.includes('Run') || title.includes('Spor') || title.includes('Maraton')) return SportImage;
    if (title.includes('Art') || title.includes('Sanat')) return ArtImage;
    return MusicImage; // fallback default resim
  };

  const filteredEvents = selectedCategory === 'Tümü'
  ? events
  : events.filter(event => {
      if (selectedCategory === 'Müzik') return event.title.includes('Music') || event.title.includes('Müzik');
      if (selectedCategory === 'Teknoloji') return event.title.includes('Tech') || event.title.includes('Teknoloji');
      if (selectedCategory === 'Spor') return event.title.includes('Run') || event.title.includes('Spor') || event.title.includes('Marathon');
      if (selectedCategory === 'Sanat') return event.title.includes('Art') || event.title.includes('Sanat');
      return true;
    });


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { event: { ...item, image: getImage(item.title) } })}
    >
      <Image source={getImage(item.title)} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date} - {item.time}</Text>
      <Text style={styles.location}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Etkinlikler</Text>
      <View style={styles.categoryContainer}>
  {['Tümü', 'Müzik', 'Teknoloji', 'Spor', 'Sanat'].map(category => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category && styles.selectedCategoryButtonText
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  ))}

<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
    <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
  </TouchableOpacity>
</View>

      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    margin: 10,
    color: '#222',
  },
  date: {
    fontSize: 16,
    marginHorizontal: 10,
    marginBottom: 4,
    color: '#555',
  },
  location: {
    fontSize: 16,
    marginHorizontal: 10,
    marginBottom: 10,
    color: '#777',
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },

  logoutContainer: {
    alignItems: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  
});
