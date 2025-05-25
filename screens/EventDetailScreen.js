// Tüm component içeriği
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EventDetail = ({ route, navigation }) => {
  const { event } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [suggestedEvents, setSuggestedEvents] = useState([]);

  useEffect(() => {
    const user = auth().currentUser;
    setCurrentUser(user);
    fetchComments();
    fetchSuggestedEvents();
  }, []);

  const fetchComments = async () => {
    try {
      const snapshot = await firestore()
        .collection('comments')
        .where('eventId', '==', event.id)
        .get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(data);
    } catch (error) {
      console.error('❌ Yorum çekme hatası:', error);
    }
  };

  const fetchSuggestedEvents = async () => {
    try {
      const snapshot = await firestore()
        .collection('events')
        .where('category', '==', event.category)
        .where('city', '==', event.city)
        .get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(e => e.id !== event.id);
      setSuggestedEvents(data);
    } catch (error) {
      console.error('❌ Öneri etkinlik hatası:', error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !currentUser) return;
    try {
      const newComment = {
        eventId: event.id,
        text: comment.trim(),
        userName: currentUser.email,
        userId: currentUser.uid,
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      const docRef = await firestore().collection('comments').add(newComment);
      setComments(prev => [...prev, { ...newComment, id: docRef.id, timestamp: new Date() }]);
      setComment('');
    } catch (error) {
      console.error('❌ Yorum ekleme hatası:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await firestore().collection('comments').doc(commentId).delete();
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('❌ Silme hatası:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return dateObj.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={{ uri: event.image }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{event.title}</Text>
            <TouchableOpacity style={styles.ticketButton} onPress={() => navigation.navigate('Checkout', { event })}>
              <Text style={styles.ticketButtonText}>SATIN AL</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.info}>📅 {event.date} - {event.time}</Text>
          <Text style={styles.info}>📍 {event.location}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Yorumlar</Text>
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Yorumunuzu yazın..."
              multiline
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
              <Text style={styles.addButtonText}>+ Yorumunuzu Ekleyin</Text>
            </TouchableOpacity>

            {comments.length === 0 ? (
              <Text style={styles.noComment}>Henüz yorum yok.</Text>
            ) : (
              comments.map(item => (
                <View key={item.id} style={styles.commentItem}>
                  <Text style={styles.commentUser}>👤 {item.userName}</Text>
                  <Text style={styles.commentText}>💬 {item.text}</Text>
                  <Text style={styles.commentTime}>{formatDate(item.timestamp)}</Text>
                  {currentUser?.uid === item.userId && (
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteComment(item.id)}>
                      <Text style={styles.deleteButtonText}>Sil</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>

          {suggestedEvents.length > 0 && (
            <View style={{ marginTop: 30 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Size Özel Öneriler</Text>
              <FlatList
                data={suggestedEvents}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      console.log("🟢 Kart tıklandı:", item.title);
                      navigation.push('EventDetail', { event: item });
                    }}
                  >
                    <Image source={{ uri: item.image }} style={styles.suggestionImage} />
                    <Text style={styles.suggestionTitle}>{item.title}</Text>
                    <Text style={styles.suggestionInfo}>{item.date} - {item.time}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EventDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  image: { width: '100%', height: 220 },
  content: { padding: 18 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', flex: 1 },
  ticketButton: { backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  ticketButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  info: { fontSize: 15, color: '#444', marginVertical: 3 },
  description: { fontSize: 16, color: '#555', marginTop: 10 },
  commentSection: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 20 },
  commentTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#f1f1f1', borderRadius: 10, padding: 12, minHeight: 60, color: '#000', marginBottom: 10 },
  addButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  noComment: { color: '#aaa', fontStyle: 'italic', textAlign: 'center' },
  commentItem: { backgroundColor: '#f4f4f4', padding: 12, borderRadius: 10, marginBottom: 10 },
  commentUser: { fontWeight: 'bold', color: '#333' },
  commentText: { color: '#000', marginTop: 4 },
  commentTime: { color: '#777', fontSize: 12, marginTop: 4 },
  deleteButton: { backgroundColor: '#FF3B30', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start', marginTop: 6 },
  deleteButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  suggestionCard: { width: 180, backgroundColor: '#fff', borderRadius: 10, marginRight: 12, padding: 10, elevation: 3 },
  suggestionImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 6 },
  suggestionTitle: { fontWeight: 'bold', fontSize: 14, color: '#222', marginBottom: 2 },
  suggestionInfo: { fontSize: 12, color: '#666' }
});
