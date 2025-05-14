import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // firebase.js ile aynı klasördeyse ./firebase

const sampleEvents = [
    {
      title: "Summer Beats Festival",
      description: "Yazın en büyük müzik festivali!",
      date: "2025-07-15",
      time: "18:00",
      location: "İstanbul Park",
      image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8e1",
      category: "Müzik"
    },
    {
      title: "Rock Night Live",
      description: "Ünlü rock grupları sahnede!",
      date: "2025-08-05",
      time: "20:00",
      location: "IF Performance Hall",
      image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
      category: "Müzik"
    },
    {
      title: "Jazz & Blues Evening",
      description: "Keyifli bir caz akşamı sizi bekliyor.",
      date: "2025-09-12",
      time: "19:30",
      location: "Moda Sahnesi",
      image: "https://images.unsplash.com/photo-1588580000550-51f3511cfb5a",
      category: "Müzik"
    },
    {
      title: "City Run Marathon",
      description: "Şehrin sokaklarında unutulmaz bir maraton!",
      date: "2025-09-05",
      time: "09:00",
      location: "Ankara",
      image: "https://images.unsplash.com/photo-1509228627159-6451950b2d43",
      category: "Spor"
    },
    {
      title: "Basketbol Turnuvası",
      description: "Genç yıldızlar sahaya çıkıyor!",
      date: "2025-10-18",
      time: "17:00",
      location: "Ülker Spor Arena",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6951",
      category: "Spor"
    },
    {
      title: "Yoga Günleri",
      description: "Doğayla iç içe sabah yogası.",
      date: "2025-08-20",
      time: "08:00",
      location: "Belgrad Ormanı",
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07d",
      category: "Spor"
    },
    {
      title: "Modern Art Exhibition",
      description: "Genç sanatçılardan ilham veren eserler.",
      date: "2025-10-01",
      time: "11:00",
      location: "İstanbul Resim ve Heykel Müzesi",
      image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48",
      category: "Sanat"
    },
    {
      title: "Fotoğrafçılık Atölyesi",
      description: "Kompozisyon ve ışık üzerine uygulamalı atölye.",
      date: "2025-09-10",
      time: "14:00",
      location: "Karaköy Studio",
      image: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135",
      category: "Sanat"
    },
    {
      title: "Açık Hava Tiyatro",
      description: "Klasik tiyatro eserlerinden bir seçki.",
      date: "2025-08-25",
      time: "21:00",
      location: "Harbiye Cemil Topuzlu",
      image: "https://images.unsplash.com/photo-1508087621823-5a8d37d2b62e",
      category: "Sanat"
    },
    {
      title: "Future Tech 2025",
      description: "Yapay zeka, robotik ve inovasyon zirvesi.",
      date: "2025-08-22",
      time: "10:00",
      location: "Bilişim Vadisi",
      image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769",
      category: "Teknoloji"
    },
    {
      title: "Girişimcilik Günü",
      description: "Startup sunumları ve networking fırsatları.",
      date: "2025-09-18",
      time: "13:00",
      location: "ITU ARI Teknokent",
      image: "https://images.unsplash.com/photo-1603570419988-ff6aeca74ecb",
      category: "Teknoloji"
    },
    {
      title: "Web Development Workshop",
      description: "React ve Firebase ile web uygulamaları geliştirin.",
      date: "2025-09-29",
      time: "15:00",
      location: "Kodluyoruz İstanbul",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981d",
      category: "Teknoloji"
    },
  
   

  ];
  
  sampleEvents.forEach(async (event) => {
    try {
      const docRef = await addDoc(collection(db, "events"), event);
      console.log("Eklendi:", docRef.id);
    } catch (e) {
      console.error("Hata:", e);
    }
  });
  
