import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { state, actions, isBootstrapping } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('demo@vitatrack.local');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state.user) navigate('/dashboard', { replace: true });
  }, [navigate, state.user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await actions.login(email, password);
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
          <div className="auth-brand__icon" aria-hidden="true">
            <div className="auth-brand__cross" />
            <div className="auth-brand__heart">❤</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="auth-title">Chao mung ban tro lai</div>
            <div className="auth-subtitle">Dang nhap de tiep tuc</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <span className="auth-field__icon">@</span>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <span className="auth-field__icon">*</span>
            <input
              className="auth-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={event => setPassword(event.target.value)}
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
          {!error && !isBootstrapping ? (
            <div className="auth-demo">
              Tai khoan mau: <strong>demo@vitatrack.local</strong> / <strong>123456</strong>
            </div>
          ) : null}

          <button className="auth-submit auth-submit--login" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Dang nhap...' : 'Dang nhap ->'}
          </button>

          <div className="auth-divider">hoac</div>
          <div className="auth-footer">
            Chua co tai khoan? <Link className="auth-link" to="/register">Dang ky</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
