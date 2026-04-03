import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  DropletIcon,
  HomeIcon,
  NewsIcon,
  ScaleIcon,
  StepsIcon,
  UserIcon,
} from './Icons';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Trang chủ', Icon: HomeIcon },
  { path: '/steps', label: 'Bước chân', Icon: StepsIcon },
  { path: '/weight', label: 'Cân nặng', Icon: ScaleIcon },
  { path: '/water', label: 'Nước uống', Icon: DropletIcon },
  { path: '/news', label: 'Tin tức', Icon: NewsIcon },
  { path: '/profile', label: 'Hồ sơ', Icon: UserIcon },
];

export default function Sidebar() {
  return (
    <aside className="sidebar-shell">
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-icon">
              <Icon size={18} />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
