import { useState } from 'react';
import {
  CButton,
  CCardBody,
  CCollapse,
  CSmartTable,
} from '@coreui/react-pro';

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

const UsersPage = () => {
  const [details, setDetails] = useState<number[]>([]);
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
  const { data:response  } = useUsersListQuery({
    page,
    perPage,
    refetchOnMountOrArgChange: true,
  });
  const fetchedUsers = response?.data.users ?? [];
  const totalItems = response?.data.paginationData.total ?? 0;
  const totalPages = Math.ceil(totalItems / perPage);
  const columnCommonStyles = {
    padding: '1rem',
    verticalAlign: 'middle',
  };

  const columns = [
    {
      key: 'name',
      label: 'User Name',
      _style: {
        width: '15%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'email',
      label: 'Email Address',
      _style: {
        width: '18%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'gender',
      label: 'Gender',
      _style: {
        width: '10%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'phone_number',
      label: 'Phone',
      _style: {
        width: '12%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'job_title',
      label: 'Role',
      _style: {
        width: '12%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'country',
      label: 'Location',
      _style: {
        width: '12%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'is_verified',
      label: 'Status',
      _style: {
        width: '11%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'show_details',
      label: 'Actions',
      _style: {
        width: '10%',
        ...columnCommonStyles,
      },
    },
  ];

  const toggleDetails = (index: number) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
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
  return (
    <div className="pb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Users Management</h2>
          <p className="text-medium-emphasis">
            Manage and monitor user accounts
          </p>
        </div>
        <CButton
          className="d-flex align-items-center gap-2 primary-btn"
          color="primary"
          variant="outline"
          onClick={addItem}
        >
          <i className="fas fa-user-plus"></i>
          Add New User
        </CButton>
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

      {fetchedUsers.length === 0 ? (
        <EmptyState 
          title="No Users Found"
          description="No users are currently registered in the system. Add the first user to get started."
          actionButton={{
            text: "Add New User",
            onClick: addItem,
            color: "primary"
          }}
        />
      ) : (
        <CSmartTable
          sorterValue={{ column: 'name', state: 'asc' }}
          clickableRows
          tableProps={{
            striped: true,
            hover: true,
            responsive: true,
            className: 'border shadow-sm rounded users-table',
          }}
          items={fetchedUsers}
          columns={columns}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect
          itemsPerPage={perPage}
          onItemsPerPageChange={(newPerPage: number) => setPerPage(newPerPage)}
          columnSorter
          pagination
          paginationProps={{
            activePage: page,
            pages: totalPages,
            
            onActivePageChange: (newPage: number) => setPage(newPage),
            className: 'users-table-pagination'
          }}
          scopedColumns={{
            name: (item: Item) => (
              <td className="py-3">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <div className="fw-medium" title={item.name}>
                      {item.name && item.name.length > 15 
                        ? `${item.name.substring(0, 15)}...` 
                        : item.name}
                    </div>
                    <div className=" text-medium-emphasis">{item.gender}</div>
                  </div>
                </div>
              </td>
            ),
            email: (item: Item) => <td>{item.email}</td>,
            phone_number: (item: Item) => <td>{item.phone_number}</td>,
            job_title: (item: Item) => <td>{item.job_title}</td>,
            country: (item: Item) => <td>{item.country}</td>,
            is_verified: (item: Item) => (
              <td>
                <span
                  className={`badge bg-${item.is_verified ? 'success' : 'danger'}-subtle text-${item.is_verified ? 'success' : 'danger'} px-3 py-2 rounded-pill`}
                >
                  <i
                    className={`fas fa-${item.is_verified ? 'check-circle' : 'times-circle'} me-1`}
                  ></i>
                  {item.is_verified ? 'Verified' : 'Unverified'}
                </span>
              </td>
            ),
            show_details: (item: Item) => {
              return (
                <td className="py-2 text-center">
                  <CButton
                    color="primary"
                    variant="ghost"
                    size="sm"
                    className="rounded-pill px-3 transition-all users-table-actions-btn"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    {details.includes(item.id) ? (
                      <>
                        <i className="fas fa-chevron-up me-1"></i>
                        Hide
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chevron-down me-1"></i>
                        Show
                      </>
                    )}
                  </CButton>
                </td>
              );
            },
            details: (item: Item) => {
              return (
                <CCollapse visible={details.includes(item.id)}>
                  <CCardBody
                    className="d-flex gap-2 p-3 bg-light bg-opacity-10 border-top users-table-details-container"
                  >
                    <CButton
                      color="info"
                      variant="ghost"
                      className="d-flex align-items-center gap-2"
                      onClick={() => navigate(`/user/${item.id}`)}
                    >
                      <i className="fas fa-eye"></i>
                      View Details
                    </CButton>
                    <CButton
                      color="warning"
                      variant="ghost"
                      className="d-flex align-items-center gap-2"
                      onClick={() => editItem(item)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </CButton>
                    <CButton
                      color="danger"
                      variant="ghost"
                      className="d-flex align-items-center gap-2"
                      onClick={() => deleteItem(item)}
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </CButton>
                  </CCardBody>
                </CCollapse>
              );
            },
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;
