import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EventDetail from './pages/EventDetail';
import AdminPanel from './pages/AdminPanel';
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ProfilePage from './pages/ProfilePage';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Chatbot from './components/ChatBot';
import CheckoutPage from './pages/CheckoutPage';
import FavoritesPage from "./pages/FavoritesPage";
import PhotoUploadPage from "./pages/PhotoUploadPage";
import TicketsPage from "./pages/TicketsPage";

function App() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔄 Etkinlikleri çek
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

    fetchEvents();

    // 🔐 Kullanıcıyı dinle
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email?.split("@")[0],
          isAdmin: false
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar key={user?.email || "guest"} user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={
          <>
            <HomePage events={events} user={user} />
            <Chatbot />
          </>
        } />
        <Route path="/event/:id" element={<EventDetail events={events} user={user} />} />
        <Route path="/login" element={<LoginPage type="user" setUser={setUser} />} />
        <Route path="/admin-login" element={<LoginPage type="admin" setUser={setUser} />} />
        <Route path="/admin" element={<AdminPanel user={user} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/checkout/:eventId" element={<CheckoutPage user={user} />} />
        <Route path="/favoriler" element={<FavoritesPage user={user} />} />
        <Route path="/fotoarsiv" element={<PhotoUploadPage user={user} />} />
        <Route path="/biletlerim" element={<TicketsPage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
