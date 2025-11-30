import React, { useState, useEffect } from 'react';
import { adminApi, User, CreateUserDto, UpdateUserDto } from '../../../../api/admin.api';
import UserTable from '../components/user-table';
import UserInfoDialog from '../components/user-info-dialog';
import './UserManagement.scss';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'create' | 'edit'>('view');

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, searchKeyword]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = searchKeyword
        ? await adminApi.searchUsers(searchKeyword, pagination.currentPage, pagination.pageSize)
        : await adminApi.getAllUsers(pagination.currentPage, pagination.pageSize);

      console.log('✅ Users fetched:', response.data);

      if (response.data.content) {
        setUsers(response.data.content);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        });
      }
    } catch (err: any) {
      console.error('❌ Error fetching users:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchUsers();
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      alert('Xóa người dùng thành công!');
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa người dùng');
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    try {
      await adminApi.updateUserStatus(userId, newStatus);
      alert('Cập nhật trạng thái thành công!');
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleSaveUser = async (data: CreateUserDto | UpdateUserDto) => {
    try {
      if (dialogMode === 'create') {
        await adminApi.createUser(data as CreateUserDto);
        alert('Tạo người dùng thành công!');
      } else if (dialogMode === 'edit' && selectedUser) {
        await adminApi.updateUser(selectedUser.id, data as UpdateUserDto);
        alert('Cập nhật người dùng thành công!');
      }
      
      setIsDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="user-management">
      <div className="user-management__header">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Quản lý thông tin và phân quyền người dùng</p>
        </div>
        <button className="btn-primary" onClick={handleCreateUser}>
          <i className="fas fa-plus"></i>
          Thêm người dùng
        </button>
      </div>

      <div className="user-management__search">
        <form onSubmit={handleSearch}>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm theo email, tên..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit">Tìm kiếm</button>
          </div>
        </form>
      </div>

      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải danh sách người dùng...</p>
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination__btn"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage > pagination.totalPages - 3) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`pagination__btn ${pageNum === pagination.currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="pagination__btn"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {isDialogOpen && (
        <UserInfoDialog
          user={selectedUser}
          mode={dialogMode}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}