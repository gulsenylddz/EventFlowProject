import React, { useState } from 'react';
import {
  View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const snapshot = await firestore().collection('events').get();
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event =>
          (event.title?.toLowerCase().includes(text.toLowerCase()) ||
            event.description?.toLowerCase().includes(text.toLowerCase()) ||
            event.city?.toLowerCase().includes(text.toLowerCase()) ||
            event.category?.toLowerCase().includes(text.toLowerCase()))
        );
      setResults(data);
    } catch (err) {
      console.error("🔴 Arama hatası:", err);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.header}> Etkinlik Ara</Text>

      <View style={styles.searchBox}>
        <Icon name="search-outline" size={22} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Etkinlik, kategori, şehir..."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => navigation.navigate('EventDetail', { event: item })}
            >
              <Text style={styles.resultText}>{item.title}</Text>
              <Text style={styles.meta}>{item.date} - {item.city}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length > 0 && !loading && (
              <Text style={styles.noResult}>Sonuç bulunamadı.</Text>
            )
          }
          contentContainerStyle={styles.resultList}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#222' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#000' },
  resultList: { marginTop: 20 },
  resultCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  resultText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  meta: { fontSize: 13, color: '#777', marginTop: 4 },
  noResult: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});
