import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";

function HomePage({ user }) {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventList);
      } catch (error) {
        console.error("Firestore Veri Çekme Hatası:", error);
      }
    };

    const fetchFavorites = async () => {
      if (user) {
        const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        setFavorites(snapshot.docs.map(doc => doc.data().eventId));
      }
    };

    fetchEvents();
    fetchFavorites();
  }, [user]);

  const getCategory = (event) => {
    return event.category || 'Diğer';
  };

  const categories = ['Tümü', 'Müzik', 'Teknoloji', 'Spor', 'Sanat'];

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === 'Tümü' || getCategory(event) === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = async (event) => {
    if (!user) {
      alert("Favoriye eklemek için giriş yapmalısınız");
      return;
    }

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid),
      where("eventId", "==", event.id)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
      setFavorites(favorites.filter(id => id !== event.id));
    } else {
      await addDoc(collection(db, "favorites"), {
        userId: user.uid,
        eventId: event.id,
        title: event.title,
        image: event.image
      });
      setFavorites([...favorites, event.id]);
    }
  };

  return (
    <div className="pt-24 px-6 bg-gray-50 min-h-screen">
      {/* Arama kutusu */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Etkinlik Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Kategori Butonları */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            } transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Etkinlik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Link to={`/event/${event.id}`}>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-60 object-cover rounded-t-xl"
              />
            </Link>

            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                <button
                  onClick={() => toggleFavorite(event)}
                  className="text-2xl ml-2"
                  title={favorites.includes(event.id) ? "Favoriden kaldır" : "Favorilere ekle"}
                >
                  <span className={favorites.includes(event.id) ? "text-yellow-400" : "text-gray-400"}>
                    {favorites.includes(event.id) ? "⭐" : "☆"}
                  </span>
                </button>
              </div>
              <p className="text-gray-500 mb-1">{event.location}, {event.date}</p>
              <p className="text-gray-600 text-sm mt-2">{event.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Girişi */}
      <div className="fixed bottom-6 right-6">
        <a
          href="/admin-login"
          className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-black transition"
        >
          Admin Girişi
        </a>
      </div>
    </div>
  );
}

export default HomePage;
