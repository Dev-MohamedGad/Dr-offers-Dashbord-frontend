import { useState } from 'react';
import {
  CButton,
  CCardBody,
  CCollapse,
  CSmartTable,
  CImage,
} from '@coreui/react-pro';
import EmptyState from '@components/EmptyState';

import type { Item } from '@coreui/react-pro/src/components/smart-table/types';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '@components/DeleteModal';
import { useAddPromotionMutation, usePromotionsListQuery, useRemovePromotionMutation, useUpdatePromotionMutation } from '@redux/slices/promotionsSlice/promotionsApiSlice';
import EditAndCreatePromotionsForm from './editAndCreatPromotionsForm';
import { Promotion } from 'src/types/promotion.type';
import './promotionsPage.page.css';
const PromotionsPage = () => {
  const [details, setDetails] = useState<number[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>({});
  const [modalType, setModalType] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [removePromotion] = useRemovePromotionMutation();
  const [editPromotion] = useUpdatePromotionMutation();
  const [addPromotion] = useAddPromotionMutation();
  const navigate = useNavigate();
  type PromotionResponse = {
    data: {
      data: Promotion[];
    };
  };
  const { data: response } = usePromotionsListQuery<PromotionResponse>();

  const fetchedPromotions = response?.data || [];

  const columnCommonStyles = {
    padding: '1rem',
    verticalAlign: 'middle',
  };

  const columns = [
    {
      key: 'photo',
      label: 'Promotion Image',
      _style: {
        width: '15%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'name',
      label: 'Promotion Name',
      _style: {
        width: '20%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'developer',
      label: 'Developer',
      _style: {
        width: '20%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'created_at',
      label: 'Created Date',
      _style: {
        width: '15%',
        ...columnCommonStyles,
      },
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      _style: {
        width: '15%',
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to handle image load errors
  const handleImageError = (itemId: number) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  // Function to check if image should show fallback
  const shouldShowFallback = (item: Item) => {
    return !item.photo || item.photo.trim() === '' || imageErrors.has(item.id ?? 0);
  };

  return (
    <div className="pb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Promotions Management</h2>
          <p className="text-medium-emphasis">
            Manage and monitor property promotions
          </p>
        </div>
        <CButton
          className="d-flex align-items-center gap-2 primary-btn"
          color="primary"
          variant="outline"
          onClick={addItem}
        >
          <i className="fas fa-plus"></i>
          Add New Promotion
        </CButton>
      </div>

      <DeleteModal
        visible={deleteModal}
        selectedItem={selectedItem}
        setVisible={setDeleteModal}
        modalTitle="Delete Promotion"
        action={removePromotion}
      />

      <EditAndCreatePromotionsForm
        visible={visible}
        setVisible={setVisible}
        modalTitle={modalType === 'create' ? 'Create Promotion' : 'Edit Promotion'}
        modalType={modalType}
        selectedItem={selectedItem}
        action={modalType === 'create' ? addPromotion : editPromotion}
      />

      {fetchedPromotions.length === 0 ? (
        <EmptyState 
          title="No Promotions Found"
          description="No promotions are currently available. Create your first promotion to get started."
          actionButton={{
            text: "Add New Promotion",
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
            className: 'border shadow-sm rounded promotions-table',
          }}
          items={fetchedPromotions}
          columns={columns}
          
          itemsPerPageSelect
       
          scopedColumns={{
            photo: (item: Item) => (
              <td>
                {shouldShowFallback(item) ? (
                  <div className="promotions-table-photo-fallback">
                    <EmptyState 
                      title=""
                      description=""
                      imageSize={30}
                      className="py-2"
                    />
                  </div>
                ) : (
                  <CImage
                    src={item.photo}
                    alt={item.name}
                    width={80}
                    height={60}
                    className="rounded promotions-table-photo"
                    onError={() => handleImageError(item.id ?? 0)}
                  />
                )}
              </td>
            ),
            name: (item: Item) => (
              <td>
                <div className="fw-medium" title={item.name}>
                  {item.name && item.name.length > 15 
                    ? `${item.name.substring(0, 15)}...` 
                    : item.name}
                </div>
              </td>
            ),
            developer: (item: Item) => (
              <td>
              
                  <span>{item.developer?.name}</span>
              </td>
            ),
            created_at: (item: Item) => (
              <td>{formatDate(item.created_at)}</td>
            ),
            updated_at: (item: Item) => (
              <td>{formatDate(item.updated_at)}</td>
            ),
            show_details: (item: Item) => {
              return (
                <td className="py-2 text-center">
                  <CButton
                    color="primary"
                    variant="ghost"
                    size="sm"
                    className="rounded-pill px-3 transition-all promotions-table-actions-btn"
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
                    className="d-flex gap-2 p-3 bg-light bg-opacity-10 border-top promotions-table-details-container"
                  >
                    <CButton
                      color="info"
                      variant="ghost"
                      className="d-flex align-items-center gap-2"
                      onClick={() =>{
                        navigate(`/promotion/${item.id}`);
                      }}
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

export default PromotionsPage;
