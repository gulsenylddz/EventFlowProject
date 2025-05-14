import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function EventDetail({ user }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchEvent = async () => {
      const eventDoc = await getDoc(doc(db, "events", id));
      if (eventDoc.exists()) {
        setEvent({ id: eventDoc.id, ...eventDoc.data() });
      }
    };

    fetchEvent();
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("eventId", "==", id),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(list);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    if (newComment.trim() === "") return;

    await addDoc(collection(db, "comments"), {
      eventId: id,
      userName: user.name || user.email,
      userId: user.uid,
      comment: newComment,
      timestamp: serverTimestamp()
    });

    setNewComment("");
    fetchComments();
  };

  const handleDeleteComment = async (comment) => {
    try {
      await deleteDoc(doc(db, "comments", comment.id));
      fetchComments();
    } catch (error) {
      console.error("Yorum silme hatası:", error);
    }
  };

  const handleTicket = () => {
    if (!user) {
      alert("Bilet almak için giriş yapmalısınız.");
      return;
    }
  
    navigate(`/checkout/${event.id}`);
  };

  if (!event) return <p className="text-center pt-20">Yükleniyor...</p>;

  return (
    <div className="pt-28 px-6 pb-10 max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-xl shadow-lg">
        <img src={event.image} alt={event.title} className="rounded-xl w-full lg:w-1/2 h-72 object-cover" />
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-3xl font-bold text-gray-800">{event.title}</h2>
          <p className="text-gray-600">{event.date} – {event.location}</p>
          <p className="text-gray-700">{event.description}</p>

          <button
            onClick={handleTicket}
            className="w-fit mt-4 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
          >
             Bilet Al
          </button>
        </div>
      </div>

      

      {/* 💬 Yorumlar */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Yorumlar</h3>

        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            rows="3"
            placeholder="Yorumunuzu yazın..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Yorum Ekle
          </button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-gray-500">Henüz yorum yapılmamış.</p>
          )}
          {comments.map((c, index) => (
            <div key={index} className="border-b pb-2 relative">
              <p className="text-sm text-gray-800 font-semibold">{c.userName}</p>
              <p className="text-gray-600">{c.comment}</p>

              {user?.uid === c.userId && (
                <button
                  onClick={() => handleDeleteComment(c)}
                  className="absolute top-1 right-2 text-red-500 text-xs hover:underline"
                >
                  Sil
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
