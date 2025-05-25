import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { PieChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const AdminHomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    topCategory: '',
    topCity: '',
    favorites: 0,
    comments: 0,
    tickets: 0,
    categoryDist: [],
    cityDist: [],
    topInterest: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const eventsSnap = await firestore().collection('events').get();
      const allEvents = eventsSnap.docs.map(doc => doc.data());

      const categoryCounts = {};
      const cityCounts = {};

      allEvents.forEach(event => {
        categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
        cityCounts[event.city] = (cityCounts[event.city] || 0) + 1;
      });

      const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
      const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

      // 🔮 AI Skor Hesaplama
      const interestScored = allEvents.map(ev => {
        let score = 0;
        if (['müzik', 'festival', 'konser'].some(k => ev.title?.toLowerCase().includes(k))) score += 3;
        if (['İstanbul', 'Ankara'].includes(ev.city)) score += 2;
        score += Math.min(ev.description?.length || 0, 300) / 30;
        return { title: ev.title, category: ev.category, city: ev.city, score };
      }).sort((a, b) => b.score - a.score).slice(0, 5);

      const favoritesSnap = await firestore().collection('favorites').get();
      const commentsSnap = await firestore().collection('comments').get();
      const ticketsSnap = await firestore().collection('tickets').get();

      setStats({
        topCategory,
        topCity,
        favorites: favoritesSnap.size,
        comments: commentsSnap.size,
        tickets: ticketsSnap.size,
        categoryDist: Object.entries(categoryCounts).map(([k, v], i) => ({
          name: k, population: v, color: randomColor(i), legendFontColor: "#444", legendFontSize: 12
        })),
        cityDist: Object.entries(cityCounts).map(([k, v]) => ({ city: k, count: v })),
        topInterest: interestScored,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  const randomColor = (i) => {
    const palette = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0'];
    return palette[i % palette.length];
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>İstatistikler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📊 İstatistiksel Özet</Text>

      <View style={styles.card}><Text>EN POPÜLER KATEGORİ: {stats.topCategory}</Text></View>
      <View style={styles.card}><Text>HANGİ ŞEHİRDE ETKİNLİK YAPMAK DAHA AVANTAJLI: {stats.topCity}</Text></View>

      <Text style={styles.chartTitle}>KATEGORİ DAĞILIMI</Text>
      <PieChart
        data={stats.categoryDist}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        style={styles.chart}
      />

      <Text style={styles.chartTitle}>ŞEHİRLERE GÖRE ETKİNLİK DAĞILIMI</Text>
      <BarChart
        data={{
          labels: stats.cityDist.map(c => c.city),
          datasets: [{ data: stats.cityDist.map(c => c.count) }]
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero
      />

      <Text style={styles.chartTitle}>KULLANICI ETKİLEŞİMLERİ</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statText}>❤️ {stats.favorites}</Text><Text style={styles.statLabel}>Favoriler</Text></View>
        <View style={styles.statBox}><Text style={styles.statText}>💬 {stats.comments}</Text><Text style={styles.statLabel}>Yorumlar</Text></View>
        <View style={styles.statBox}><Text style={styles.statText}>🎫 {stats.tickets}</Text><Text style={styles.statLabel}>Biletler</Text></View>
      </View>

      <Text style={styles.chartTitle}>🧠 Tahmini İlgi Yoğunluğu </Text>
      {stats.topInterest.length === 0 ? (
        <Text style={styles.empty}>Yeterli veri yok.</Text>
      ) : (
        stats.topInterest.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.city} - {item.category}</Text>
            <Text>📊 Skor: {item.score.toFixed(1)} / 10</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default AdminHomeScreen;

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#4CAF50' },
  propsForBackgroundLines: { strokeDasharray: '' },
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  chartTitle: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
  card: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  statText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 13, color: '#777', marginTop: 4 },
  empty: { textAlign: 'center', fontStyle: 'italic', color: '#888', marginVertical: 12 },
});
