import  { useState } from 'react';
import {
  CButton,
  CCardBody,
  CCollapse,
  CSmartTable,
} from '@coreui/react-pro';
import defaultAvatar from '../../assets/default-avatar.svg';

import type { Item } from '@coreui/react-pro/src/components/smart-table/types';

import { useNavigate } from 'react-router-dom';
import EditAndCreatUserForm from './editAndCreateDevForm';
import DeleteModal from '@components/DeleteModal';
import EmptyState from '@components/EmptyState';
import {
  useDeveloperListQuery,
  useAddDeveloperMutation,
  useUpdateDeveloperMutation,
  useDeleteDeveloperMutation,
} from '@redux/slices/developersSlice/developersApiSlice.js';
import './developersPage.page.css';
const DevelopersPage = () => {
  const [details, setDetails] = useState<number[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>({});
  const [modalType, setModalType] = useState<string>('');
  const [removeDeveloper] = useDeleteDeveloperMutation();
  const [editDeveloper] = useUpdateDeveloperMutation();
  const [addDeveloper] = useAddDeveloperMutation();
  const navigate = useNavigate();
 
  const { data :response } = useDeveloperListQuery();
  const datafromApi = response?.data ?? [];
  const columnCommonStyles = {
    padding: '1rem',
    verticalAlign: 'middle',
  };

  const columns = [
    {
      key: 'photo',
      label: 'Photo',
      _style: {
        width: '10%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'name',
      label: 'Developer Name',
      _style: {
        width: '25%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'created_at',
      label: 'Created At',
      _style: {
        width: '20%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      _style: {
        width: '20%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'show_details',
      label: 'Actions',
      _style: {
        width: '15%',
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
          <h2 className="mb-1">Developers Management</h2>
          <p className="text-medium-emphasis">
            Manage and monitor developer accounts
          </p>
        </div>
        <CButton
          className="d-flex align-items-center gap-2 primary-btn"
          color="primary"
          variant="outline"
          onClick={addItem}
        >
          <i className="fas fa-user-plus"></i>
          Add New Developer
        </CButton>
      </div>

      <DeleteModal
        visible={deleteModal}
        selectedItem={selectedItem}
        setVisible={setDeleteModal}
        modalTitle="Delete Developer"
        action={removeDeveloper}
      />

      <EditAndCreatUserForm
        visible={visible}
        setVisible={setVisible}
        modalTitle={modalType === 'create' ? 'Create Developer' : 'Edit Developer'}
        modalType={modalType}
        selectedItem={selectedItem}
        action={modalType === 'create' ? addDeveloper : editDeveloper}
      />

      {datafromApi.length === 0 ? (
        <EmptyState 
          title="No Developers Found"
          description="No developers are currently registered in the system. Add the first developer to get started."
          actionButton={{
            text: "Add New Developer",
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
            className: 'border shadow-sm rounded developers-table',
          }}
          activePage={1}
          items={datafromApi}
          columns={columns}
          itemsPerPageSelect
          itemsPerPage={10}
          scopedColumns={{
            photo: (item: Item) => (
              <td className="py-3 text-center">
                <div className="developers-table-photo-container">
                  <img
                    src={item.photo || defaultAvatar}
                    alt={item.name || 'Developer'}
                    className="developers-table-photo"
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar;
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </td>
            ),
            name: (item: Item) => (
              <td className="py-3">
                <div className="fw-medium text-dark developers-table-name-text">
                  {item.name}
                </div>
              </td>
            ),
            email: (item: Item) => (
              <td className="py-3">
                <div className="text-muted developers-table-email-text">
                  {item.email}
                </div>
              </td>
            ),
            phone: (item: Item) => (
              <td className="py-3">
                <span className="badge bg-light text-dark border px-3 py-2 developers-table-phone-badge">
                  {item.phone}
                </span>
              </td>
            ),
            projects_count: (item: Item) => (
              <td className="py-3 text-center">
                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill developers-table-projects-badge">
                  {item.projects_count || 0} Projects
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
                    className="rounded-pill px-3 transition-all developers-table-actions-btn"
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
                    className="d-flex gap-2 p-3 bg-light bg-opacity-10 border-top developers-table-details-container"
                  >
                    <CButton
                      color="info"
                      variant="ghost"
                      className="d-flex align-items-center gap-2"
                      onClick={() => navigate(`/developer/${item.id}`)}
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

export default DevelopersPage;
