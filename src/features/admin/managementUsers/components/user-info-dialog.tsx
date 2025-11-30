import React, { useState, useEffect } from 'react';
import { User, CreateUserDto, UpdateUserDto } from '../../../../api/admin.api';
import './user-info-dialog.scss';

interface UserInfoDialogProps {
  user: User | null;
  mode: 'view' | 'create' | 'edit';
  onClose: () => void;
  onSave: (data: CreateUserDto | UpdateUserDto) => void;
}

export default function UserInfoDialog({ user, mode, onClose, onSave }: UserInfoDialogProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'USER',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        email: user.email,
        password: '',
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      onSave({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
      } as CreateUserDto);
    } else if (mode === 'edit') {
      onSave({
        fullName: formData.fullName,
        role: formData.role,
        status: formData.status,
      } as UpdateUserDto);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog__header">
          <h2>
            {mode === 'view' && 'Thông tin người dùng'}
            {mode === 'create' && 'Thêm người dùng mới'}
            {mode === 'edit' && 'Chỉnh sửa người dùng'}
          </h2>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog__content">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isViewMode || mode === 'edit'}
                required
              />
            </div>

            {mode === 'create' && (
              <div className="form-group">
                <label>Mật khẩu *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            )}

            <div className="form-group">
              <label>Họ tên *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="form-group">
              <label>Vai trò *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isViewMode}
                required
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {mode !== 'create' && (
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isViewMode}
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Ngừng hoạt động</option>
                </select>
              </div>
            )}

            {user && isViewMode && (
              <>
                <div className="form-group">
                  <label>Ngày tạo</label>
                  <input
                    type="text"
                    value={new Date(user.createdAt).toLocaleString('vi-VN')}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Cập nhật lần cuối</label>
                  <input
                    type="text"
                    value={new Date(user.updatedAt).toLocaleString('vi-VN')}
                    disabled
                  />
                </div>
              </>
            )}
          </div>

          <div className="dialog__footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button type="submit" className="btn-primary">
                {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}