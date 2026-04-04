import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const profile = state.profile || {};
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState({
    name: profile.name || '',
    email: profile.email || state.user?.email || '',
    gender: profile.gender || 'Nam',
    age: profile.age || 21,
    height: profile.height || 165,
  });

  const avatarFallback = useMemo(
    () => (draft.name || profile.name || 'U').trim().charAt(0).toUpperCase(),
    [draft.name, profile.name]
  );

  function updateDraft(key, value) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    const payload = {
      ...profile,
      ...draft,
      age: Number(draft.age),
      height: Number(draft.height),
    };

    await actions.saveProfile(payload);
    setMessage('Da cap nhat thong tin');
    setIsEditing(false);
    window.setTimeout(() => setMessage(''), 2000);
  }

  function handleLogout() {
    actions.logout();
    navigate('/login');
  }

  const items = [
    { icon: 'O', label: 'Gioi tinh', value: profile.gender || 'Nam' },
    { icon: '#', label: 'Tuoi', value: `${profile.age || 21} tuoi` },
    { icon: '|', label: 'Chieu cao', value: `${profile.height || 165} cm` },
  ];

  return (
    <section className="profile-page">
      <div className="profile-shell">
        <div className="profile-header">
          <div className="profile-header__title">Ho so</div>
          <button type="button" className="profile-gear" onClick={() => setIsEditing(value => !value)}>
            *
          </button>
        </div>

        <div className="profile-hero">
          {profile.avatar ? (
            <img className="profile-avatar" src={profile.avatar} alt={profile.name || 'Avatar'} />
          ) : (
            <div className="profile-avatar profile-avatar--fallback">{avatarFallback}</div>
          )}
          <div className="profile-name">{profile.name || 'Pham Cong Vinh'}</div>
          <div className="profile-mail">@ {profile.email || state.user?.email || 'demo@vitatrack.local'}</div>
        </div>

        <div className="profile-stack">
          {items.map(item => (
            <div className="profile-item" key={item.label}>
              <div className="profile-item__icon">{item.icon}</div>
              <div>
                <div className="profile-item__label">{item.label}</div>
                <div className="profile-item__value">{item.value}</div>
              </div>
              <div className="profile-item__arrow">-</div>
            </div>
          ))}
        </div>

        {isEditing ? (
          <div className="profile-form">
            <div className="profile-form__grid">
              <div className="profile-form__field">
                <label>Ho ten</label>
                <input value={draft.name} onChange={event => updateDraft('name', event.target.value)} />
              </div>
              <div className="profile-form__field">
                <label>Email</label>
                <input value={draft.email} onChange={event => updateDraft('email', event.target.value)} />
              </div>
              <div className="profile-form__field">
                <label>Gioi tinh</label>
                <select value={draft.gender} onChange={event => updateDraft('gender', event.target.value)}>
                  <option value="Nam">Nam</option>
                  <option value="Nu">Nu</option>
                </select>
              </div>
              <div className="profile-form__field">
                <label>Tuoi</label>
                <input type="number" value={draft.age} onChange={event => updateDraft('age', event.target.value)} />
              </div>
              <div className="profile-form__field">
                <label>Chieu cao</label>
                <input type="number" value={draft.height} onChange={event => updateDraft('height', event.target.value)} />
              </div>
            </div>

            <div className="profile-form__actions">
              <button type="button" className="profile-button profile-button--save" onClick={handleSave}>
                Luu thong tin
              </button>
              <button type="button" className="profile-button profile-button--cancel" onClick={() => setIsEditing(false)}>
                Huy
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="profile-button profile-button--edit" onClick={() => setIsEditing(true)}>
            Sua thong tin
          </button>
        )}

        {message ? <div className="profile-status">{message}</div> : null}

        <button type="button" className="profile-button profile-button--logout" onClick={handleLogout}>
          Dang xuat
        </button>
      </div>
    </section>
  );
}
