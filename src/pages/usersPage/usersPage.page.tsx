import { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormCheck,
  CContainer,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAvatar,
  CTooltip,
} from '@coreui/react-pro';

import CIcon from '@coreui/icons-react';
import { 
  cilPencil, 
  cilTrash, 
  cilCloudDownload, 
  cilFilter, 
  cilOptions,
  cilUser,
  cilUserPlus,
  cilCheckCircle,
  cilXCircle,
  cilWarning,
  cilEnvelopeLetter,
  cilPhone
} from '@coreui/icons';

import type { Item } from '@coreui/react-pro/src/components/smart-table/types';

import { useNavigate } from 'react-router-dom';
import EditAndCreatUserForm from './editAndCreatUserForm';
import DeleteModal from '@components/DeleteModal';
import EmptyState from '@components/EmptyState';
import {
  useAddUserApiSliceMutation,
  useRemoveUserApiSliceMutation,
  useUpdateUserApiSliceMutation,
  useUsersListQuery,
} from '@redux/slices/usersSlice/usersApiSlice.js';
import './usersPage.page.css';

interface ExtendedUser extends Item {
  selected?: boolean;
}

const UsersPage = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>({});
  const [modalType, setModalType] = useState<string>('');
  const [removeUser] = useRemoveUserApiSliceMutation();
  const [editUser] = useUpdateUserApiSliceMutation();
  const [addUser] = useAddUserApiSliceMutation();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectAll, setSelectAll] = useState(false);
  const [localUsers, setLocalUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [filters, setFilters] = useState({
    status: 'All',
    role: 'All',
    verified: 'All'
  });
  
  const { data: response, isLoading, error, refetch } = useUsersListQuery({
    page,
    perPage,
    refetchOnMountOrArgChange: true,
  });

  // Handle the API response structure
  const fetchedUsers = response?.data?.users ?? [];
  const totalItems = response?.data?.paginationData?.total ?? 0;

  // Transform API data to local format when data arrives
  useEffect(() => {
    if (fetchedUsers) {
      const transformedUsers: ExtendedUser[] = fetchedUsers.map((user: any) => ({
        ...user,
        selected: false
      }));
      setLocalUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
    }
  }, [fetchedUsers]);

  const handleFilterChange = (filterType: 'status' | 'role' | 'verified', value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Apply filters immediately
    let filtered = localUsers;
    
    if (newFilters.status !== 'All') {
      filtered = filtered.filter(user => 
        newFilters.status === 'Active' ? user.is_active : !user.is_active
      );
    }
    
    if (newFilters.role !== 'All') {
      filtered = filtered.filter(user => user.role === newFilters.role.toLowerCase());
    }
    
    if (newFilters.verified !== 'All') {
      filtered = filtered.filter(user => 
        newFilters.verified === 'Verified' ? user.is_email_verified : !user.is_email_verified
      );
    }
    
    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setFilters({ status: 'All', role: 'All', verified: 'All' });
    setFilteredUsers(localUsers);
  };

  const downloadCSV = () => {
    // Define CSV headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Brand', 'Status', 'Email Verified', 'Created Date'];
    
    // Convert data to CSV format
    const csvData = filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone_number || '',
      user.role,
      user.brand_name || '',
      user.is_active ? 'Active' : 'Inactive',
      user.is_email_verified ? 'Verified' : 'Unverified',
      user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
    ]);
    
    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const updatedUsers = localUsers.map(user => ({ ...user, selected: checked }));
    setLocalUsers(updatedUsers);
    
    const updatedFiltered = filteredUsers.map(user => ({ ...user, selected: checked }));
    setFilteredUsers(updatedFiltered);
  };

  const handleSelectUser = (id: number, checked: boolean) => {
    const updatedUsers = localUsers.map(user => 
      user.id === id ? { ...user, selected: checked } : user
    );
    setLocalUsers(updatedUsers);
    
    const updatedFiltered = filteredUsers.map(user => 
      user.id === id ? { ...user, selected: checked } : user
    );
    setFilteredUsers(updatedFiltered);
  };

  const addItem = () => {
    setSelectedItem({});
    setModalType('create');
    setVisible(true);
  };

  const editItem = (item: Item) => {
    setSelectedItem(item);
    setModalType('edit');
    setVisible(true);
  };

  const deleteItem = (item: Item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <CBadge color="primary" shape="rounded-pill">Owner</CBadge>;
      case 'admin':
        return <CBadge color="warning" shape="rounded-pill">Admin</CBadge>;
      case 'visitor':
        return <CBadge color="info" shape="rounded-pill">Visitor</CBadge>;
      default:
        return <CBadge color="secondary" shape="rounded-pill">{role}</CBadge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <CBadge color="success" shape="rounded-pill">● Active</CBadge>
    ) : (
      <CBadge color="danger" shape="rounded-pill">● Inactive</CBadge>
    );
  };

  const getUniqueRoles = () => {
    const roles = localUsers.map(user => user.role);
    return ['All', ...Array.from(new Set(roles))].map(role => 
      role === 'All' ? role : role.charAt(0).toUpperCase() + role.slice(1)
    );
  };

  if (isLoading) {
    return (
      <CContainer fluid className="px-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <CSpinner color="primary" />
        </div>
      </CContainer>
    );
  }

  if (error) {
    return (
      <CContainer>
        <EmptyState
          title="Error Loading Users"
          description="An error occurred while fetching users data"
          actionButton={{
            text: 'Retry',
            onClick: () => refetch(),
            color: 'primary'
          }}
        />
      </CContainer>
    );
  }

  return (
    <CContainer className="users-container">
      {/* Header Section */}
      <div className="users-header">
        <div className="d-flex justify-content-end align-items-center mb-4">
         
          <div className="d-flex gap-2">
            <CButton color="secondary" variant="outline" onClick={downloadCSV}>
              <CIcon icon={cilCloudDownload} className="me-2" />
              Export CSV
            </CButton>
            <CDropdown>
              <CDropdownToggle 
                className="filter-btn"
              >
                <CIcon icon={cilFilter} className="me-2" />
                Filter
                {(filters.status !== 'All' || filters.role !== 'All' || filters.verified !== 'All') && (
                  <CBadge color="light" className="ms-2 filter-badge">
                    {Object.values(filters).filter(f => f !== 'All').length}
                  </CBadge>
                )}
              </CDropdownToggle>
              <CDropdownMenu className="filter-dropdown">
                <div className="filter-section">
                  <label className="filter-label">Status</label>
                  <div className="filter-options">
                    {['All', 'Active', 'Inactive'].map(status => (
                      <CButton
                        key={status}
                        size="sm"
                        className={filters.status === status ? 'filter-btn-active' : 'filter-btn-inactive'}
                        onClick={() => handleFilterChange('status', status)}
                      >
                        {status}
                      </CButton>
                    ))}
                  </div>
                </div>
                <div className="filter-section">
                  <label className="filter-label">Role</label>
                  <div className="filter-options">
                    {getUniqueRoles().map(role => (
                      <CButton
                        key={role}
                        size="sm"
                        className={filters.role === role ? 'filter-btn-active' : 'filter-btn-inactive'}
                        onClick={() => handleFilterChange('role', role)}
                      >
                        {role}
                      </CButton>
                    ))}
                  </div>
                </div>
                <div className="filter-section">
                  <label className="filter-label">Email Verification</label>
                  <div className="filter-options">
                    {['All', 'Verified', 'Unverified'].map(verified => (
                      <CButton
                        key={verified}
                        size="sm"
                        className={filters.verified === verified ? 'filter-btn-active' : 'filter-btn-inactive'}
                        onClick={() => handleFilterChange('verified', verified)}
                      >
                        {verified}
                      </CButton>
                    ))}
                  </div>
                </div>
                <div className="filter-footer">
                  <CButton size="sm" color="secondary" variant="outline" onClick={clearFilters}>
                    Clear All
                  </CButton>
                  <span className="filter-count">
                    Showing {filteredUsers.length} of {localUsers.length}
                  </span>
                </div>
              </CDropdownMenu>
            </CDropdown>
            <CButton
              className="add-user-btn"
              onClick={addItem}
            >
              <CIcon icon={cilUserPlus} className="me-2" />
              Add User
            </CButton>
          </div>
        </div>
      </div>

      <DeleteModal
        visible={deleteModal}
        selectedItem={selectedItem}
        setVisible={setDeleteModal}
        modalTitle="Delete User"
        action={removeUser}
      />

      <EditAndCreatUserForm
        visible={visible}
        setVisible={setVisible}
        modalTitle={modalType === 'create' ? 'Create User' : 'Edit User'}
        modalType={modalType}
        selectedItem={selectedItem}
        action={modalType === 'create' ? addUser : editUser}
      />

      {/* Main Table */}
      <CCard className="users-card">
        <CCardBody className="p-0">
          {filteredUsers.length === 0 ? (
            <EmptyState 
              title="No Users Found"
              description={filters.status !== 'All' || filters.role !== 'All' || filters.verified !== 'All' 
                ? "No users match the current filters. Try adjusting your filters."
                : "No users are currently registered in the system."}
              actionButton={{
                text: "Add New User",
                onClick: addItem,
                color: "primary"
              }}
              className="py-5"
            />
          ) : (
            <CTable hover responsive className="users-table mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="checkbox-cell">
                    <CFormCheck 
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="table-checkbox"
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Contact</CTableHeaderCell>
                  <CTableHeaderCell>Brand</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Role</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Verification</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredUsers.map((user) => (
                  <CTableRow 
                    key={user.id} 
                    className="table-row"
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    <CTableDataCell className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
                      <CFormCheck 
                        checked={user.selected || false}
                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                        className="table-checkbox"
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="user-info">
                        <CAvatar 
                          src={user.image_url} 
                          size="md"
                          className="user-avatar"
                        >
                          {!user.image_url && (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
                        </CAvatar>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <div className="user-id">ID: {user.id}</div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="contact-info">
                        <div className="contact-item">
                          <CIcon icon={cilEnvelopeLetter} size="sm" className="contact-icon" />
                          <span className="contact-text">{user.email}</span>
                          {user.is_email_verified && (
                            <CTooltip content="Email Verified">
                              <CIcon icon={cilCheckCircle} size="sm" className="text-success ms-1" />
                            </CTooltip>
                          )}
                        </div>
                        {user.phone_number && (
                          <div className="contact-item">
                            <CIcon icon={cilPhone} size="sm" className="contact-icon" />
                            <span className="contact-text">{user.phone_number}</span>
                            {user.is_phone_verified && (
                              <CTooltip content="Phone Verified">
                                <CIcon icon={cilCheckCircle} size="sm" className="text-success ms-1" />
                              </CTooltip>
                            )}
                          </div>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="brand-name">{user.brand_name || '—'}</span>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      {getRoleBadge(user.role)}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      {getStatusBadge(user.is_active)}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="verification-badges">
                        <CTooltip content={`Email ${user.is_email_verified ? 'Verified' : 'Not Verified'}`}>
                          <CBadge 
                            color={user.is_email_verified ? 'success' : 'warning'} 
                            className="verification-badge"
                          >
                            <CIcon icon={cilEnvelopeLetter} size="sm" />
                          </CBadge>
                        </CTooltip>
                        <CTooltip content={`Phone ${user.is_phone_verified ? 'Verified' : 'Not Verified'}`}>
                          <CBadge 
                            color={user.is_phone_verified ? 'success' : 'secondary'} 
                            className="verification-badge"
                          >
                            <CIcon icon={cilPhone} size="sm" />
                          </CBadge>
                        </CTooltip>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons">
                        <CTooltip content="Edit User">
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              editItem(user);
                            }}
                          >
                            <CIcon icon={cilPencil} size="sm" />
                          </CButton>
                        </CTooltip>
                        <CTooltip content="Delete User">
                          <CButton 
                            size="sm" 
                            className="action-btn action-btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItem(user);
                            }}
                          >
                            <CIcon icon={cilTrash} size="sm" />
                          </CButton>
                        </CTooltip>
                        <CTooltip content="View Details">
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/user/${user.id}`);
                            }}
                          >
                            <CIcon icon={cilOptions} size="sm" />
                          </CButton>
                        </CTooltip>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default UsersPage;
