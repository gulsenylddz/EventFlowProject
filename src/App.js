import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EventDetail from './pages/EventDetail';
import AdminPanel from './pages/AdminPanel';
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // doğru konumda olduğundan emin ol


function App() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null); // 👈 kullanıcı bilgisi

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventList);
        console.log("Firestore'dan gelen veriler:", eventList);
      } catch (error) {
        console.error("Firestore Veri Çekme Hatası:", error);
      }
    };
  
    fetchEvents(); // ✅ return'dan önce çağrılmalı
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          uid: currentUser.uid,
          name: currentUser.email.split("@")[0],
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
      <Navbar key={user?.email || Math.random()} user={user} setUser={setUser} />
      <Routes>
      <Route path="/" element={<HomePage events={events} user={user} />} />
        <Route path="/event/:id" element={<EventDetail events={events} user={user} />} />
        <Route path="/login" element={<LoginPage type="user" setUser={setUser} />} />
        <Route path="/admin-login" element={<LoginPage type="admin" setUser={setUser} />} />
        <Route path="/admin" element={<AdminPanel user={user} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );

  

}

export default App;
