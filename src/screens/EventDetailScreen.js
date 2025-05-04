import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';  // 🔑 auth'u da import ettik

const EventDetail = ({ route }) => {
  const { event } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Şu anki kullanıcıyı al
    const user = auth.currentUser;
    setCurrentUser(user);

    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const q = query(collection(db, 'comments'), where('eventId', '==', event.id));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(docItem => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setComments(data);
    } catch (error) {
      console.error('Yorumları çekme hatası:', error);
    }
  };

  const handleAddComment = async () => {
    if (comment.trim() === '' || !currentUser) return;
    try {
      const newComment = {
        eventId: event.id,
        text: comment.trim(),
        userName: currentUser.email,  // 👤 kullanıcı email kaydediyoruz
        userId: currentUser.uid,      // 🔑 kullanıcı uid kaydediyoruz
        timestamp: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'comments'), newComment);
      setComments(prev => [...prev, { ...newComment, id: docRef.id, timestamp: new Date() }]);
      setComment('');
    } catch (error) {
      console.error('Yorum ekleme hatası:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      setComments(prev => prev.filter(c => c.id !== commentId));
      Alert.alert('Başarılı', 'Yorum silindi');
    } catch (error) {
      console.error('Yorum silme hatası:', error);
      Alert.alert('Hata', 'Yorum silinemedi');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return dateObj.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: event.image }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{event.title}</Text>
            <TouchableOpacity style={styles.ticketButton}>
              <Text style={styles.ticketButtonText}>🎫 Bilet Al</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.info}><Text style={styles.emoji}>⏰</Text> {event.date} - {event.time}</Text>
          <Text style={styles.info}><Text style={styles.emoji}>📍</Text> {event.location}</Text>

          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Yorumlar</Text>

            <TextInput
              placeholder="Yorumunuzu yazın..."
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
              style={styles.input}
              multiline
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
              <Text style={styles.addButtonText}>Yorum Ekle</Text>
            </TouchableOpacity>

            {comments.length === 0 ? (
              <Text style={styles.noComment}>Henüz yorum yapılmamış.</Text>
            ) : (
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Text style={styles.commentUser}>👤 {item.userName}</Text>
                    <Text style={styles.commentText}>💬 {item.comment}</Text>
                    <Text style={styles.commentTime}>{formatDate(item.timestamp)}</Text>

                    {/* 🔥 YALNIZCA YORUMUN SAHİBİ GÖRSÜN */}
                    {currentUser && item.userId === currentUser.uid && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteComment(item.id)}
                      >
                        <Text style={styles.deleteButtonText}>Sil</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EventDetail;

// styles KISMI AYNI KALABİLİR (önceki gibi)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { paddingBottom: 20 },
  image: { width: '100%', height: 230 },
  content: { padding: 18 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#222', flex: 1, flexWrap: 'wrap' },
  ticketButton: { backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, elevation: 2 },
  ticketButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  info: { fontSize: 16, color: '#555', marginTop: 8 },
  emoji: { fontSize: 16 },
  description: { fontSize: 16, color: '#444', lineHeight: 22, marginTop: 14 },
  commentsSection: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginTop: 18, elevation: 1 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  input: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12, marginBottom: 10, minHeight: 60, color: '#000' },
  addButton: { backgroundColor: '#3B82F6', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontSize: 16 },
  noComment: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 8 },
  commentItem: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 10, marginBottom: 10 },
  commentUser: { color: '#333', fontWeight: 'bold', marginBottom: 4 },
  commentText: { color: '#000', marginBottom: 4 },
  commentTime: { color: '#777', fontSize: 12, marginBottom: 6 },
  deleteButton: { backgroundColor: '#FF4D4D', borderRadius: 6, padding: 6, alignSelf: 'flex-start' },
  deleteButtonText: { color: '#fff', fontSize: 12 },
});