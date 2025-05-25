import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const mockTickets = [
  { id: '1', title: 'Rock Festivali', date: '2025-07-21', location: 'İstanbul' },
  { id: '2', title: 'Teknoloji Zirvesi', date: '2025-08-10', location: 'Ankara' },
];

const TicketsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Satın Aldığınız Biletler</Text>

      <FlatList
        data={mockTickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Icon name="ticket-outline" size={24} color="#4CAF50" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.info}>📍 {item.location}   📅 {item.date}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Henüz bilet alınmamış.</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

export default TicketsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  iconBox: {
    backgroundColor: '#e0f2f1',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  title: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  info: { fontSize: 14, color: '#666', marginTop: 4 },
  empty: { fontStyle: 'italic', textAlign: 'center', color: '#999', marginTop: 40 },
});
