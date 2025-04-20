import React from 'react';

function Footer() {
  return (
    <footer className="footer_section">
      <div className="container">
        <p>© {new Date().getFullYear()} EventFlow. Tüm Hakları Saklıdır.</p>
      </div>
    </footer>
  );
}

export default Footer;
