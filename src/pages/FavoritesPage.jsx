import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function FavoritesPage({ user }) {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const eventIds = snapshot.docs.map(doc => doc.data().eventId);

        const eventPromises = eventIds.map(id => getDoc(doc(db, "events", id)));
        const eventDocs = await Promise.all(eventPromises);
        const eventsData = eventDocs
          .filter(doc => doc.exists())
          .map(doc => ({ id: doc.id, ...doc.data() }));

        setFavoriteEvents(eventsData);
      } catch (error) {
        console.error("Favoriler alınırken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return <div className="pt-24 text-center">Yükleniyor...</div>;
  }

  if (!user) {
    return <div className="pt-24 text-center text-gray-700">Favorileri görmek için giriş yapmalısınız.</div>;
  }

  return (
    <div className="pt-24 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Favori Etkinliklerim</h1>

      {favoriteEvents.length === 0 ? (
        <p className="text-center text-gray-500">Hiç favori etkinliğiniz yok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteEvents.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105">
              <Link to={`/event/${event.id}`}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-60 object-cover rounded-t-xl"
                />
              </Link>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                <p className="text-gray-500">{event.location}, {event.date}</p>
                <p className="text-gray-600 text-sm mt-2">{event.description?.slice(0, 100)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
