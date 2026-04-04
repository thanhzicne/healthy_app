import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calcBMI, getBMICategory, calcWaterGoal } from '../../utils/helpers';

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({
    name: '', email: '', age: '', height: '', weight: '', gender: 'male', goal: 'maintain',
  });
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (state.profile) setForm({ ...form, ...state.profile });
  }, [state.profile]);

  const bmi = calcBMI(form.weight, form.height);
  const bmiCat = getBMICategory(bmi);
  const waterGoal = calcWaterGoal(+form.weight);

  const handleSave = (e) => {
    e.preventDefault();
    const profile = {
      name: form.name, email: form.email,
      age: +form.age, height: +form.height,
      weight: +form.weight, gender: form.gender,
      goal: form.goal,
    };
    dispatch({ type: 'SET_PROFILE', payload: profile });
    localStorage.setItem(`health_profile_${state.user?.email}`, JSON.stringify(profile));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const infoRows = [
    { icon: '👤', label: 'Giới tính', value: form.gender === 'male' ? 'Nam' : 'Nữ' },
    { icon: '🎂', label: 'Tuổi', value: form.age ? `${form.age} tuổi` : 'Chưa cập nhật' },
    { icon: '📏', label: 'Chiều cao', value: form.height ? `${form.height} cm` : 'Chưa cập nhật' },
    { icon: '⚖️', label: 'Cân nặng', value: form.weight ? `${form.weight} kg` : 'Chưa cập nhật' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.pageTitle}>Hồ sơ</div>
        <button type="button" style={styles.topIcon}>⚙️</button>
      </div>

      <div style={styles.cardPrimary}>
        <div style={styles.avatar}>{(form.name || 'U')[0].toUpperCase()}</div>
        <div style={styles.profileName}>{form.name || 'Chưa đặt tên'}</div>
        <div style={styles.profileEmail}>{state.user?.email || 'Chưa có email'}</div>
      </div>

      <div style={styles.infoCard}>
        {infoRows.map((item) => (
          <div key={item.label} style={styles.infoRow}>
            <span style={styles.infoIcon}>{item.icon}</span>
            <div style={styles.infoText}>
              <div style={styles.infoLabel}>{item.label}</div>
              <div style={styles.infoValue}>{item.value}</div>
            </div>
            <span style={styles.infoArrow}>›</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={styles.actionBtn}
        onClick={() => setEditing(true)}
      >
        ✏️ Sửa thông tin
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        style={styles.logoutBtn}
        onClick={() => dispatch({ type: 'LOGOUT' })}
      >
        ↩️ Đăng xuất
      </button>

      {editing && (
        <div className="card" style={styles.editCard}>
          <div style={styles.formHeader}>
            <div style={styles.sectionTitle}>Chỉnh sửa hồ sơ</div>
            <button type="button" className="btn btn-ghost btn-sm" style={{ color: '#ff4f8b' }} onClick={() => setEditing(false)}>✕ Hủy</button>
          </div>

          <form onSubmit={handleSave} style={styles.form}>
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">Họ và tên</label>
                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
              </div>
              <div className="input-group">
                <label className="input-label">Tuổi</label>
                <input type="number" className="input-field" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="25" />
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">Chiều cao (cm)</label>
                <input type="number" className="input-field" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} placeholder="170" />
              </div>
              <div className="input-group">
                <label className="input-label">Cân nặng (kg)</label>
                <input type="number" step="0.1" className="input-field" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="65" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
              💾 Lưu thay đổi
            </button>
          </form>
        </div>
      )}

      {saved && (
        <div style={styles.savedBadge}>✓ Đã lưu thành công</div>
      )}
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 16, padding: 20, maxWidth: 420, margin: '0 auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#4465ee', borderRadius: 18, padding: '16px 20px', color: '#fff' },
  pageTitle: { fontSize: 18, fontWeight: 700 },
  topIcon: { border: 'none', background: 'rgba(255,255,255,0.16)', borderRadius: 12, width: 38, height: 38, fontSize: 18, color: '#fff', cursor: 'pointer' },
  cardPrimary: { background: '#5d7bff', borderRadius: 24, padding: '28px 20px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.15)' },
  avatar: { width: 76, height: 76, borderRadius: '50%', background: '#fff', color: '#1f2937', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, marginBottom: 14 },
  profileName: { fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  infoCard: { display: 'flex', flexDirection: 'column', gap: 12 },
  infoRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#5d7bff', borderRadius: 18, padding: '16px 18px', color: '#fff', cursor: 'pointer', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' },
  infoIcon: { fontSize: 18, marginRight: 14 },
  infoText: { flex: 1, display: 'flex', flexDirection: 'column' },
  infoLabel: { fontSize: 12, opacity: 0.8 },
  infoValue: { fontSize: 16, fontWeight: 700, marginTop: 2 },
  infoArrow: { fontSize: 20, opacity: 0.7 },
  actionBtn: { width: '100%', borderRadius: 18, padding: '14px 16px', fontWeight: 700 },
  logoutBtn: { width: '100%', borderRadius: 18, padding: '14px 16px', fontWeight: 700, background: '#fb923c', borderColor: '#fb923c', color: '#fff' },
  editCard: { marginTop: 8, padding: 20, borderRadius: 20, background: '#1e293b' },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#f0f4ff' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  savedBadge: {
    background: 'rgba(0,229,160,0.12)', border: '1px solid rgba(0,229,160,0.3)',
    borderRadius: 20, padding: '8px 16px',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: '#00e5a0',
    alignSelf: 'center',
  },
};
