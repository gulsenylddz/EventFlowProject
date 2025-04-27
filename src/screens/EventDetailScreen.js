import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { ToastAndroid } from 'react-native';

const { width } = Dimensions.get('window');

const EventDetailScreen = ({ route }) => {
  const { event } = route.params;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={event.image} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.infoText}>{event.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🕒</Text>
          <Text style={styles.infoText}>{event.time}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        {/* Açıklama Animasyonu */}
        <Animated.Text style={[styles.description, { opacity: fadeAnim }]}>
          {event.description}
        </Animated.Text>

        {/* Bilet Al Butonu */}
        <TouchableOpacity
  style={styles.button}
  onPress={() => {
    ToastAndroid.show('🎉 Biletiniz başarıyla alınmıştır!', ToastAndroid.SHORT);
  }}
>
  <Text style={styles.buttonText}>🎟️ Bilet Al</Text>
</TouchableOpacity>


      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
  },
  image: {
    width: width,
    height: 300,
  },
  content: {
    backgroundColor: '#fff',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#555',
  },
  description: {
    fontSize: 17,
    color: '#666',
    marginTop: 20,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#5D5FEE', // Güzel bir mavi-mor arası renk
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
