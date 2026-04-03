import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '⬡', label: 'Tổng quan' },
  { path: '/steps', icon: '👟', label: 'Bước chân' },
  { path: '/water', icon: '💧', label: 'Nước uống' },
  { path: '/weight', icon: '⚖️', label: 'Cân nặng' },
  { path: '/profile', icon: '👤', label: 'Hồ sơ' },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const profile = state.profile;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <span style={{ fontSize: 20 }}>♥</span>
        </div>
        <div>
          <div style={styles.logoName}>VitaTrack</div>
          <div style={styles.logoTag}>Health Monitor</div>
        </div>
      </div>

      {/* User mini card */}
      {profile && (
        <div style={styles.userCard}>
          <div style={styles.avatar}>{(profile.name || 'U')[0].toUpperCase()}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{profile.name || 'Người dùng'}</div>
            <div style={styles.userMeta}>{profile.age || '--'} tuổi · {profile.gender === 'male' ? 'Nam' : 'Nữ'}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>MENU</div>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel2}>{item.label}</span>
            {item.path === '/dashboard' && <span style={styles.navBadge}>●</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        <span>⬡</span>
        <span>Đăng xuất</span>
      </button>

      {/* Bottom decoration */}
      <div style={styles.sidebarDecor} />
    </aside>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '240px',
    background: 'linear-gradient(180deg, #0d1321 0%, #111827 100%)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    zIndex: 100,
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    paddingBottom: 24,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logoIcon: {
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    fontWeight: 800,
    boxShadow: '0 4px 16px rgba(0,212,255,0.3)',
  },
  logoName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 16,
    color: '#f0f4ff',
    letterSpacing: '-0.3px',
  },
  logoTag: {
    fontSize: 10,
    color: '#4a5568',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: 'rgba(0,212,255,0.06)',
    borderRadius: 12,
    border: '1px solid rgba(0,212,255,0.12)',
    marginBottom: 24,
  },
  avatar: {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 14,
    color: '#000',
    flexShrink: 0,
  },
  userInfo: { overflow: 'hidden' },
  userName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 13,
    color: '#f0f4ff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userMeta: { fontSize: 11, color: '#4a5568' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  navLabel: {
    fontSize: 10,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: '#4a5568',
    letterSpacing: '1.5px',
    marginBottom: 8,
    paddingLeft: 12,
  },
  navLabel2: { flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 14px',
    borderRadius: 10,
    color: '#8892aa',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontSize: 14,
  },
  navItemActive: {
    background: 'rgba(0,212,255,0.1)',
    color: '#00d4ff',
    borderLeft: '2px solid #00d4ff',
  },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  navBadge: { fontSize: 8, color: '#00e5a0', animation: 'pulse-glow 2s infinite' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 14px',
    borderRadius: 10,
    background: 'transparent',
    border: '1px solid rgba(255,79,139,0.2)',
    color: '#ff4f8b',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 13,
    transition: 'all 0.2s ease',
    marginTop: 16,
    width: '100%',
  },
  sidebarDecor: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
};
