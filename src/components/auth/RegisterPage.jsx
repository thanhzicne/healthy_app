import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './AuthPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state.user) navigate('/dashboard', { replace: true });
  }, [navigate, state.user]);

  function updateField(key, value) {
    setForm(current => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Mat khau xac nhan khong khop');
      return;
    }

    setIsSubmitting(true);

    try {
      await actions.register({
        email: form.email,
        password: form.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__user" aria-hidden="true">
            <div className="auth-brand__plus">+</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="auth-title">Chao mung ban tro lai</div>
            <div className="auth-subtitle">Dang ky de su dung</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <span className="auth-field__icon">@</span>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={event => updateField('email', event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <span className="auth-field__icon">*</span>
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={event => updateField('password', event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <span className="auth-field__icon">*</span>
            <input
              className="auth-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={event => updateField('confirmPassword', event.target.value)}
              required
            />
            <button
              type="button"
              className="auth-field__action"
              aria-label="Hien thi mat khau"
              onClick={() => setShowPassword(value => !value)}
            >
              {showPassword ? '◐' : '◉'}
            </button>
          </div>

          {error ? <div className="auth-error">{error}</div> : null}

          <button className="auth-submit auth-submit--register" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Dang ky...' : 'Dang ky ->'}
          </button>

          <div className="auth-divider">hoac</div>
          <div className="auth-footer">
            Da co tai khoan? <Link className="auth-link" to="/login">Dang nhap</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
