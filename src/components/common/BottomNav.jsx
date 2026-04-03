import React from 'react';
import { NavLink } from 'react-router-dom';
import { DropletIcon, HomeIcon, ScaleIcon, StepsIcon, UserIcon } from './Icons';

const TABS = [
  { path: '/dashboard', label: 'Home', Icon: HomeIcon },
  { path: '/steps', label: 'Bước', Icon: StepsIcon },
  { path: '/water', label: 'Nước', Icon: DropletIcon },
  { path: '/weight', label: 'Cân', Icon: ScaleIcon },
  { path: '/profile', label: 'Hồ sơ', Icon: UserIcon },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ path, label, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/dashboard'}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
