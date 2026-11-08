import React, { useState } from 'react';
import { useAtelier } from '../context/AtelierContext';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCurationDrawer, curatedPieces, cartCount, showToast } = useAtelier();

  const toggleMenu = () => {
    const nextState = !menuOpen;
    setMenuOpen(nextState);
    document.body.classList.toggle('menu-open', nextState);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.body.classList.remove('menu-open');
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile Overlay Menu */}
      <div className={`mmenu ${menuOpen ? 'open' : ''}`} id="mmenu">
        <a href="#product" onClick={(e) => handleLinkClick(e, '#product')}>
          Sera.ji Clothing
        </a>
        <a href="#features" onClick={(e) => handleLinkClick(e, '#features')}>
          Handpicked Craft
        </a>
        <a href="#pricing" onClick={(e) => handleLinkClick(e, '#pricing')}>
          Collections
        </a>
        <a href="#acclaim" onClick={(e) => handleLinkClick(e, '#acclaim')}>
          Press &amp; Acclaim
        </a>
        <a href="#inquiries" onClick={(e) => handleLinkClick(e, '#inquiries')}>
          Inquiries &amp; FAQ
        </a>

        {/* Mobile Account Row */}
        <div className="mobile-acct-row wide">
          <button
            type="button"
            className="mobile-acct-btn"
            onClick={() => {
              setMenuOpen(false);
              showToast('Client Portal: VIP guestbook access active.', 'gold');
            }}
          >
            <span>Login</span>
            <span>→</span>
          </button>
          <button
            type="button"
            className="mobile-acct-btn"
            onClick={() => {
              setMenuOpen(false);
              openCurationDrawer();
            }}
          >
            <span>Saved Trunk Show</span>
            <span>({curatedPieces.length})</span>
          </button>
          <button
            type="button"
            className="mobile-acct-btn"
            onClick={() => {
              setMenuOpen(false);
              openCurationDrawer();
            }}
          >
            <span>Cart</span>
            <span>({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Fixed Header */}
      <header className="nav" id="nav">
        <div className="wrap">
          <div className="nav-l">
            <a className="pill" href="#product" onClick={(e) => handleLinkClick(e, '#product')}>
              Collection
            </a>
            <a className="pill" href="#features" onClick={(e) => handleLinkClick(e, '#features')}>
              Craftsmanship
            </a>
            <a className="pill" href="#pricing" onClick={(e) => handleLinkClick(e, '#pricing')}>
              Editions
            </a>
            <a className="pill" href="#acclaim" onClick={(e) => handleLinkClick(e, '#acclaim')}>
              Acclaim
            </a>
            <a className="pill" href="#inquiries" onClick={(e) => handleLinkClick(e, '#inquiries')}>
              FAQ
            </a>
          </div>

          <a className="logo" href="#" aria-label="Sera.ji Clothing Brand">
            <svg viewBox="0 0 40 40" fill="#2a1a12">
              <path d="M5 5h13v13H5zM22 22h13v13H22z" />
              <path d="M22 5a13 13 0 0 1 13 13H22zM18 35A13 13 0 0 1 5 22h13z" />
            </svg>
            <span className="brand-name">SERA.JI</span>
          </a>

          <div className="nav-r">
            {/* Account Suite: Login, Search, Heart (Saved), Bag, Cart */}
            <div className="acct wide">
              <button
                className="acct-link"
                type="button"
                onClick={() => showToast('Client Portal: VIP guestbook access active.', 'gold')}
                aria-label="Client Login"
              >
                Login
              </button>

              <button
                className="acct-icon-btn"
                type="button"
                onClick={() => showToast('Search: Browse the 2027 Runway & Studio cuts.', 'info')}
                aria-label="Search Collection"
                title="Search"
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m15.5 15.5 5 5" />
                </svg>
              </button>

              <button
                className="acct-icon-btn"
                type="button"
                onClick={openCurationDrawer}
                aria-label="Saved pieces in Trunk Show"
                title="Saved Pieces"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.500 9C20.500 15 12 20 12 20Z" />
                </svg>
                {curatedPieces.length > 0 && (
                  <span className="acct-badge">{curatedPieces.length}</span>
                )}
              </button>

              <button
                className="acct-icon-btn acct-bag-btn"
                type="button"
                onClick={openCurationDrawer}
                aria-label="Order Commission Bag"
                title="Bag"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M5 8h14l1 13H4Z" />
                  <path d="M9 10V6a3 3 0 0 1 6 0v4" />
                </svg>
                {cartCount > 0 && (
                  <span className="acct-badge">{cartCount}</span>
                )}
              </button>

              <button
                className="acct-link"
                type="button"
                onClick={openCurationDrawer}
                aria-label={`Cart with ${cartCount} items`}
                title="View Cart"
              >
                Cart (<span id="cart">{cartCount}</span>)
              </button>
            </div>

            <button className="burger" id="burger" aria-label="Toggle menu" onClick={toggleMenu}>
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
