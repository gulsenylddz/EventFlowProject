import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc
} from "firebase/firestore";
import { db } from "../firebase";

function AdminPanel({ user }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
    category: ""
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
    } else {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(data);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm(event);
  };

  const handleSave = async () => {
    if (editingEvent) {
      await updateDoc(doc(db, "events", editingEvent.id), form);
    } else {
      await addDoc(collection(db, "events"), form);
    }
    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: "",
      category: ""
    });
    setEditingEvent(null);
    fetchEvents();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const categories = ["Tümü", "Müzik", "Spor", "Sanat", "Teknoloji"];

  const filteredEvents =
    selectedCategory === "Tümü"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="pt-24 px-6 pb-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        Etkinlik Ekle
      </h1>

      {/* Form */}
      <div className="bg-white shadow-xl p-6 rounded-xl mb-10 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(form).map((key) =>
          key !== "image" ? (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="border p-3 rounded-lg"
            />
          ) : null
        )}

        {/* Görsel */}
        <div className="col-span-full">
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Görsel URL"
            className="border p-3 rounded-lg w-full mb-2"
          />
          {form.image && (
            <img
              src={form.image}
              alt="Önizleme"
              className="w-full h-60 object-cover rounded-lg shadow"
            />
          )}
        </div>

        <button
          onClick={handleSave}
          className="col-span-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          {editingEvent ? "Güncelle" : "Ekle"}
        </button>
      </div>

      {/* Kategori Filtresi */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Etkinlik Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between"
          >
            <img
              src={event.image}
              alt={event.title}
              className="h-40 w-full object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {event.date} – {event.category}
            </p>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleEdit(event)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
