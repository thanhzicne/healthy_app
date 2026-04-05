import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const TABS = [
  { path: '/dashboard', icon: '\u2302', label: 'Trang chủ' },
  { path: '/steps', icon: '\u{1F6B6}', label: 'Bước chân' },
  { path: '/weight', icon: '\u2696', label: 'Cân nặng' },
  { path: '/water', icon: '\u{1F4A7}', label: 'Nước uống' },
  { path: '/profile', icon: '\u{1F464}', label: 'Hồ sơ' },
];

export default function BottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `mobile-bottom-nav__tab${isActive ? ' mobile-bottom-nav__tab--active' : ''}`
          }
        >
          <span className="mobile-bottom-nav__icon">{tab.icon}</span>
          <span className="mobile-bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
