import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="/">
          <strong>EventFlow</strong>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">Anasayfa</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Etkinlikler</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">İletişim</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
