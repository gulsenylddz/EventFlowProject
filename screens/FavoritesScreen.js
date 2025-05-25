import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const favorites = [
  { id: '1', title: 'Jazz Gecesi', date: '2025-06-30', location: 'İzmir' },
];

const FavoritesScreen = () => {
  const handleRemove = (title) => {
    Alert.alert('Favorilerden Kaldırıldı', `"${title}" favorilerinizden kaldırıldı.`);
    // TODO: Firestore’dan kaldırma işlemi yapılabilir
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❤️ Favori Etkinlikler</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Icon name="heart-outline" size={24} color="#E91E63" style={styles.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.info}>📅 {item.date}   📍 {item.location}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(item.title)}>
                <Icon name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Hiç favori etkinliğiniz yok.</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 16 },
  card: {
    backgroundColor: '#fefefe',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 12 },
  title: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  info: { fontSize: 14, color: '#666', marginTop: 4 },
  empty: { fontStyle: 'italic', textAlign: 'center', color: '#999', marginTop: 40 },
});
