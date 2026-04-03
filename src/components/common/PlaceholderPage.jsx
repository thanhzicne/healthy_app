import React from 'react';
import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, description }) {
  return (
    <section className="placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-eyebrow">Đang hoàn thiện</div>
        <h1>{title}</h1>
        <p>
          {description || 'Màn hình này chưa phải trọng tâm trong lần chỉnh UI này. Mình giữ route để ứng dụng chạy ổn định và tập trung hoàn thiện trang Nước uống theo ảnh mẫu.'}
        </p>
        <Link className="placeholder-link" to="/water">
          Quay lại màn Nước uống
        </Link>
      </div>
    </section>
  );
}
