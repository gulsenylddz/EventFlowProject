import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firebaseAuth, db } from '../firebase';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from '@react-native-firebase/firestore';

const CheckoutScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params;

  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });

  const handleChange = (name, value) => {
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    const user = firebaseAuth.currentUser;

    if (!user || !event) {
      Alert.alert('Hata', 'Kullanıcı veya etkinlik bilgisi eksik.');
      return;
    }

    if (typeof event.stock !== 'number' || event.stock <= 0) {
      Alert.alert('Üzgünüz', 'Etkinliğe ait bilet kalmamış.');
      return;
    }

    try {
      await db.collection('events').doc(event.id).update({
        stock: increment(-1),
      });

      await db.collection('tickets').add({
        userId: user.uid,
        eventId: event.id,
        timestamp: serverTimestamp(),
        price: event.price,
      });

      Alert.alert('🎉 Başarılı', 'Bilet satın alındı.');
      navigation.navigate('MyTickets');
    } catch (err) {
      console.error('Bilet alma hatası:', err);
      Alert.alert('Hata', 'Bilet satın alma sırasında bir sorun oluştu.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.label}>📅 {event.date}</Text>
        <Text style={styles.label}>⏰ {event.time}</Text>
        <Text style={styles.label}>📍 {event.location}</Text>
        <Text style={styles.price}>💳 {event.price} TL</Text>
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.sectionTitle}>Kart Bilgileri</Text>

        <Text style={styles.inputLabel}>Kart Numarası</Text>
        <TextInput
          placeholder="1234 5678 9012 3456"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={16}
          onChangeText={(val) => handleChange('number', val)}
        />

        <Text style={styles.inputLabel}>Kart Sahibi</Text>
        <TextInput
          placeholder="Ad Soyad"
          style={styles.input}
          onChangeText={(val) => handleChange('name', val)}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Text style={styles.inputLabel}>Son Kullanma Tarihi</Text>
            <TextInput
              placeholder="MM/YY"
              style={styles.input}
              maxLength={5}
              onChangeText={(val) => handleChange('expiry', val)}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              placeholder="123"
              style={styles.input}
              maxLength={4}
              keyboardType="number-pad"
              onChangeText={(val) => handleChange('cvc', val)}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>💸 Satın Al</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ticketBox}>
        <Text style={styles.ticketText}>
          🎟️ Bilet No: EVT-{event.id.slice(0, 6).toUpperCase()}-{event.date.replace(/-/g, '')}
        </Text>
      </View>
    </ScrollView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  ticketBox: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  ticketText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
  },
});