import React from 'react';
import Navbar from './components/Navbar';
import './assets/css/bootstrap.min.css';
import './assets/css/font-awesome.min.css';
import './assets/css/animate.css';
import './assets/css/main.css';
import './assets/css/responsive.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container mt-5">
        <h1>EventFlow'a Hoş Geldin!</h1>
        <p>Bu, ilk canlı görünümümüz 🎉</p>
      </main>
    </div>
  );
}

export default App;
