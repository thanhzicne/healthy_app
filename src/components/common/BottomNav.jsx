import React from 'react';
import { NavLink } from 'react-router-dom';

const TABS = [
  { path: '/dashboard', icon: '⬡', label: 'Home' },
  { path: '/steps', icon: '👟', label: 'Bước' },
  { path: '/water', icon: '💧', label: 'Nước' },
  { path: '/weight', icon: '⚖️', label: 'Cân' },
  { path: '/profile', icon: '👤', label: 'Hồ sơ' },
];

export default function BottomNav() {
  return (
    <nav style={styles.nav}>
      {TABS.map(tab => (
        <NavLink key={tab.path} to={tab.path} style={({ isActive }) => ({
          ...styles.tab,
          ...(isActive ? styles.tabActive : {}),
        })}>
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <span style={styles.label}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'none',
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    background: 'rgba(13,19,33,0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    zIndex: 200,
    padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    '@media (maxWidth: 768px)': { display: 'flex' },
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    textDecoration: 'none',
    color: '#4a5568',
    transition: 'all 0.2s ease',
    padding: '4px 0',
  },
  tabActive: { color: '#00d4ff' },
  label: {
    fontSize: 10,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.3px',
  },
};
