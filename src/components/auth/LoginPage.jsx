import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DropletIcon } from '../common/Icons';

const demoUser = {
  email: 'demo@healthy.app',
  name: 'Người dùng',
};

const demoProfile = {
  name: 'Người dùng',
  gender: 'female',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.user) {
      navigate('/water', { replace: true });
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      dispatch({ type: 'LOGIN', payload: demoUser });
      if (!state.profile) {
        dispatch({ type: 'SET_PROFILE', payload: demoProfile });
      }
      navigate('/water', { replace: true });
    }, 180);

    return () => window.clearTimeout(timerId);
  }, [dispatch, navigate, state.profile, state.user]);

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <div className="auth-icon-wrap">
          <DropletIcon size={30} />
        </div>
        <h1>Đang mở giao diện mẫu</h1>
        <p>
          Mình tự đăng nhập bằng tài khoản demo để vào thẳng màn Nước uống và giúp bạn kiểm tra UI nhanh hơn.
        </p>
        <div className="auth-loader" />
      </div>
    </section>
  );
}
