
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const markAsRead = async (id, readBy = []) => {
    if (!readBy.includes(userId)) {
      await firestore().collection('notifications').doc(id).update({
        readBy: [...readBy, userId]
      });
    }
  };

  const renderItem = ({ item }) => {
    const isRead = item.readBy?.includes(userId);

    return (
      <TouchableOpacity
        onPress={() => markAsRead(item.id, item.readBy || [])}
        activeOpacity={0.8}
      >
        <View style={[styles.card, !isRead && styles.unread]}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {!isRead && <View style={styles.dot} />}
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Bildirimler</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Hiç bildirim yok.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 20 },
  card: {
    backgroundColor: '#fefefe',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  unread: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  message: { fontSize: 14, color: '#555', marginTop: 6 },
  date: { fontSize: 12, color: '#999', marginTop: 8, fontStyle: 'italic' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
});
