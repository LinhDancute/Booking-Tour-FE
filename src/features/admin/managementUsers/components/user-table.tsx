import React from 'react';
import { User } from '../../../../api/admin.api';
import './user-table.scss';

interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onToggleStatus: (userId: number, currentStatus: string) => void;
}

export default function UserTable({ users, onView, onEdit, onDelete, onToggleStatus }: UserTableProps) {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'badge-admin';
      case 'USER':
        return 'badge-user';
      default:
        return 'badge-default';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'ACTIVE' ? 'badge-active' : 'badge-inactive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.fullName}</td>
              <td>
                <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                  {user.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-icon btn-view"
                    onClick={() => onView(user)}
                    title="Xem chi tiết"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => onEdit(user)}
                    title="Chỉnh sửa"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn-icon btn-toggle"
                    onClick={() => onToggleStatus(user.id, user.status)}
                    title={user.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                  >
                    <i className={`fas fa-${user.status === 'ACTIVE' ? 'ban' : 'check'}`}></i>
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(user.id)}
                    title="Xóa"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}