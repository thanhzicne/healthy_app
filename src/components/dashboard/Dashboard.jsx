import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { today, calcWaterGoal, calcStepGoal } from '../../utils/helpers';
import './Dashboard.css';

const QUICK_ACTIONS = [
  { label: 'Them nuoc', icon: '??', path: '/water' },
  { label: 'Can nang', icon: '?', path: '/weight' },
  { label: 'Buoc chan', icon: '??', path: '/steps' },
  { label: 'Thong bao', icon: '?', path: '/profile' },
];

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const todayStr = today();
  const profile = state.profile || {};

  const todaySteps = state.steps.find((item) => item.date === todayStr)?.count || 8247;
  const todayWater = state.water.find((item) => item.date === todayStr)?.amount || 1500;
  const latestWeight = state.weight.length > 0 ? state.weight[state.weight.length - 1].value : profile.weight || 65;

  const stepGoal = calcStepGoal();
  const waterGoal = calcWaterGoal(latestWeight);
  const waterCupGoal = Math.max(1, Math.round(waterGoal / 250));
  const waterCups = Math.min(waterCupGoal, Math.max(0, Math.round(todayWater / 250)));

  const heroName = profile.name || 'Nguyen Minh Tuan';
  const pageName = profile.name || 'Dang Xuan Toan';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chao buoi sang' : hour < 18 ? 'Chao buoi chieu' : 'Chao buoi toi';

  return (
    <div className="dashboard-screen">
      <div className="dashboard-phone-frame">
        <div className="dashboard-title">[{pageName}] - Trang chu</div>

        <section className="dashboard-hero">
          <div className="dashboard-hero-overlay" />
          <div className="dashboard-hero-header">
            <div>
              <div className="dashboard-hero-name">{heroName}</div>
              <div className="dashboard-hero-greeting">{greeting}</div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="dashboard-bell-button"
              aria-label="Mo ho so"
            >
              ??
            </button>
          </div>

          <button type="button" onClick={() => navigate('/steps')} className="dashboard-step-card">
            <div className="dashboard-step-label">Buoc chan hom nay</div>
            <div className="dashboard-step-value">
              {todaySteps.toLocaleString('vi-VN')} <span className="dashboard-step-divider">/</span> {stepGoal.toLocaleString('vi-VN')}
            </div>
          </button>
        </section>

        <section className="dashboard-stats-row">
          <button type="button" onClick={() => navigate('/weight')} className="dashboard-info-card">
            <div className="dashboard-info-title">Can nang</div>
            <div className="dashboard-info-value">{latestWeight}kg</div>
          </button>

          <button type="button" onClick={() => navigate('/water')} className="dashboard-info-card">
            <div className="dashboard-info-title">Nuoc uong</div>
            <div className="dashboard-info-value">{waterCups}/{waterCupGoal} coc</div>
          </button>
        </section>

        <section>
          <div className="dashboard-section-title">Thao tac nhanh</div>
          <div className="dashboard-quick-grid">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate(action.path)}
                className="dashboard-quick-card"
              >
                <div className="dashboard-quick-icon-wrap">
                  <span className="dashboard-quick-icon">{action.icon}</span>
                </div>
                <div className="dashboard-quick-label">{action.label}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
