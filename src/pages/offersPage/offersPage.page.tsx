import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CBadge,
 
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
 
  CFormCheck,
  
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CImage,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilCloudDownload, cilSearch, cilFilter, cilDescription, cilOptions, cilWarning, cilX, cilPlus, cilCheckCircle, cilBan } from '@coreui/icons';
import { useGetAllOffersQuery, useDeleteOfferMutation, useGetAllMyOffersQuery, useApproveOfferMutation } from '../../redux/slices/offersSlice/offersApiSlice';
import { Offer, OfferStatus } from '../../types/offer.type';
import EmptyState from '../../components/EmptyState';
import EditOfferModal from './EditOfferModal';
import AddOfferModal from './AddOfferModal';
import './offersPage.styles.css';
import { useSelector } from 'react-redux';

// Extended Offer interface to include selection state for UI
interface ExtendedOffer extends Offer {
  selected?: boolean;
}

const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  // Get current user and role from Redux store
  const currentUser = useSelector((state: any) => state.user?.currentUser);
  const userRole = currentUser?.role;
  const [localOffers, setLocalOffers] = useState<ExtendedOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<ExtendedOffer[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState<Offer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [offerToApprove, setOfferToApprove] = useState<Offer | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approveOffer, { isLoading: isApproving }] = useApproveOfferMutation();


  const { 
      data: offersResponse, 
      isLoading, 
      isError, 
      error,
      refetch 
    } = userRole === 'owner' ? useGetAllMyOffersQuery({page, perPage}) : useGetAllOffersQuery({page, perPage});
  
  const [deleteOffer] = useDeleteOfferMutation();

  // Transform API data to local format when data arrives
  useEffect(() => {
    if (offersResponse?.data?.data) {
      const transformedOffers: ExtendedOffer[] = offersResponse.data.data.map(offer => ({
        ...offer,
        selected: false
      }));
      setLocalOffers(transformedOffers);
      setFilteredOffers(transformedOffers);
    }
  }, [offersResponse]);

  // Apply filters and search
  useEffect(() => {
    let filtered = localOffers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.brand?.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(offer => offer.status === filters.status.toLowerCase() as OfferStatus);
    }

    // Apply category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(offer => offer.category_type === filters.category.toLowerCase());
    }

    setFilteredOffers(filtered);
  }, [localOffers, searchTerm, filters]);

 
  const downloadCSV = () => {
    // Define CSV headers
    const headers = ['ID', 'Title', 'Price Before', 'Price After', 'Discount', 'Category', 'Status', 'Brand', 'Created Date'];
    
    // Convert data to CSV format (use filtered data)
    const csvData = filteredOffers.map(offer => [
      offer.id,
      offer.title,
      offer.price_before,
      offer.price_after,
      `${offer.discount_rate}%`,
      offer.category_type,
      offer.status,
      offer.brand?.brand_name || 'No Brand',
      new Date(offer.created_at).toLocaleDateString()
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
    link.setAttribute('download', `offers_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: OfferStatus) => {
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    switch (status) {
      case OfferStatus.ACTIVE:
        return <CBadge color="success" shape="rounded-pill">● {normalizedStatus}</CBadge>;
      case OfferStatus.PENDING:
        return <CBadge color="warning" shape="rounded-pill">● {normalizedStatus}</CBadge>;
      case OfferStatus.INACTIVE:
        return <CBadge color="secondary" shape="rounded-pill">● {normalizedStatus}</CBadge>;
      case OfferStatus.EXPIRED:
        return <CBadge color="danger" shape="rounded-pill">● {normalizedStatus}</CBadge>;
      default:
        return <CBadge color="info" shape="rounded-pill">● {normalizedStatus}</CBadge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { color: string; label: string }> = {
      groceries: { color: 'success', label: 'Groceries' },
      premium_fruits: { color: 'warning', label: 'Premium Fruits' },
      home_kitchen: { color: 'info', label: 'Home & Kitchen' },
      fashion: { color: 'primary', label: 'Fashion' },
      electronics: { color: 'dark', label: 'Electronics' },
      beauty: { color: 'danger', label: 'Beauty' },
      home_improvement: { color: 'secondary', label: 'Home Improvement' },
      sports_toys_luggage: { color: 'light', label: 'Sports & Toys' }
    };

    const categoryInfo = categoryMap[category] || { color: 'secondary', label: category };
    return <CBadge color={categoryInfo.color}>{categoryInfo.label}</CBadge>;
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const updatedOffers = localOffers.map(offer => ({ ...offer, selected: checked }));
    setLocalOffers(updatedOffers);
    
    // Update filtered offers as well
    const updatedFiltered = filteredOffers.map(offer => ({ ...offer, selected: checked }));
    setFilteredOffers(updatedFiltered);
  };

  const handleSelectOffer = (id: number, checked: boolean) => {
    const updatedOffers = localOffers.map(offer => 
      offer.id === id ? { ...offer, selected: checked } : offer
    );
    setLocalOffers(updatedOffers);
    
    // Update filtered offers as well
    const updatedFiltered = filteredOffers.map(offer => 
      offer.id === id ? { ...offer, selected: checked } : offer
    );
    setFilteredOffers(updatedFiltered);
  };

  const handleDeleteClick = (offer: Offer) => {
    setOfferToDelete(offer);
    setShowDeleteModal(true);
  };

  const handleEditClick = (offer: Offer) => {
    setOfferToEdit(offer);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setOfferToEdit(null);
    refetch(); // Refresh the data after successful edit
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setOfferToEdit(null);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    refetch(); // Refresh the data after successful creation
  };

  const handleAddCancel = () => {
    setShowAddModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteOffer(offerToDelete.id).unwrap();
      refetch();
      setShowDeleteModal(false);
      setOfferToDelete(null);
    } catch (error) {
      console.error('Failed to delete offer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOfferToDelete(null);
  };

  const handleApproveClick = async (offer: Offer) => {
    await approveOffer({ id: offer.id, status: OfferStatus.ACTIVE });
    refetch();
  };
  const handleRejectClick = (offer: Offer) => {
    setOfferToApprove(offer);
    setShowRejectModal(true);
  };
  const handleRejectConfirm = async () => {
    if (!offerToApprove) return;
    await approveOffer({ id: offerToApprove.id, status: OfferStatus.INACTIVE, rejection_reason: rejectionReason });
    setShowRejectModal(false);
    setRejectionReason('');
    setOfferToApprove(null);
    refetch();
  };
  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionReason('');
    setOfferToApprove(null);
  };

  // Get unique categories for filter options
  const getUniqueCategories = () => {
    const categories = localOffers.map(offer => offer.category_type);
    const uniqueCategories = Array.from(new Set(categories));
    return ['All', ...uniqueCategories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))];
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

  if (isError) {
    let errorMessage = 'An error occurred while fetching offers';
    
    if (error) {
      if ('data' in error && typeof error.data === 'object' && error.data && 'message' in error.data) {
        errorMessage = (error.data as any).message;
      } else if ('data' in error && typeof error.data === 'string') {
        errorMessage = error.data;
      } else if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }
    
    return (
      <CContainer>
        <EmptyState
          title="Error Loading Offers"
          description={errorMessage}
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
    <CContainer>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 fw-bold">Offers Management</h1>
          <p className="text-muted mb-0">Manage and track all your offers</p>
        </div>
        <div className="d-flex gap-2">
          <CButton
            color="info"
            variant="outline"
            onClick={downloadCSV}
          >
            <CIcon icon={cilCloudDownload} className="me-2" />
            Export CSV
          </CButton>
          <CButton 
            style={{ 
              backgroundColor: '#B44C43', 
              borderColor: '#B44C43',
              color: 'white'
            }}
            onClick={() => setShowAddModal(true)}
          >
            <CIcon icon={cilPlus} className="me-2" />
            Add Offer
          </CButton>
        </div>
      </div>



      {/* Main Table */}
      <CCard className="border-0 shadow-sm">
        <CCardBody className="p-0">
          <CTable hover responsive className="mb-0">
            <CTableHead className="bg-light">
              <CTableRow>
                <CTableHeaderCell className="border-0 ps-4">
                  <CFormCheck 
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{ 
                      accentColor: '#B44C43',
                      transform: 'scale(1.1)'
                    }}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted">Offer</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted">Price</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted">Discount</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted">Status</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted text-center">Category</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted">Brand</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredOffers.map((offer) => (
                <CTableRow 
                onClick={() => navigate(`/offer/${offer.id}`)}
                style={{ cursor: 'pointer' }}

                  key={offer.id} 
                  className="align-middle"
                >
                  <CTableDataCell className="ps-4" onClick={(e) => e.stopPropagation()}>
                    <CFormCheck 
                      checked={offer.selected || false}
                      onChange={(e) => handleSelectOffer(offer.id, e.target.checked)}
                      style={{ 
                        accentColor: '#B44C43',
                        transform: 'scale(1.1)'
                      }}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <CImage
                          src={offer.image}
                          alt={offer.title}
                          width={50}
                          height={50}
                          className="rounded"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/src/assets/no-data-found.svg';
                          }}
                        />
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{offer.title}</div>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <div className="fw-semibold text-success">
                        ${(offer.price_before * (1 - offer.discount_rate / 100)).toFixed(2)}
                      </div>
                      <div className="text-muted small text-decoration-line-through">${offer.price_before}</div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge 
                      color="warning" 
                      className="px-3 py-2"
                      style={{ fontSize: '0.875rem' }}
                    >
                      {offer.discount_rate}% OFF
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {getStatusBadge(offer.status)}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {getCategoryBadge(offer.category_type)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {offer.brand ? (
                      <div>
                        <div className="fw-semibold text-dark">{offer.brand.brand_name}</div>
                        <div className="text-muted small">{offer.brand.category_type}</div>
                      </div>
                    ) : (
                      <EmptyState
                        title="No Brand"
                        description="This offer doesn't have an associated brand"
                        className="py-5"
                      
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="d-flex justify-content-center gap-1 action-buttons">
                      {userRole !== 'admin' && (
                        <>
                          <CButton 
                            size="sm" 
                            color="light" 
                            variant="ghost"
                            className="p-2 rounded-circle"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(offer);
                            }}
                            title="Edit Offer"
                          >
                            <CIcon icon={cilPencil} size="sm" className="text-warning" />
                          </CButton>
                          <CButton 
                            size="sm" 
                            color="light" 
                            variant="ghost"
                            className="p-2 rounded-circle"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(offer);
                            }}
                            title="Delete Offer"
                          >
                            <CIcon icon={cilTrash} size="sm" className="text-danger" />
                          </CButton>
                          <CButton 
                            size="sm" 
                            color="light" 
                            variant="ghost"
                            className="p-2 rounded-circle"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/offer/${offer.id}`);
                            }}
                            title="View Details"
                          >
                            <CIcon icon={cilOptions} size="sm" className="text-info" />
                          </CButton>
                        </>
                      )}
                      {userRole === 'admin' && (
                        <CDropdown alignment="end">
                          <CDropdownToggle color="light" caret={false} className="p-2 rounded-circle" style={{ border: 'none' }}>
                            <CIcon icon={cilCheckCircle} size="sm" className="text-success" />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveClick(offer);
                              }}
                              disabled={isApproving}
                            >
                              <CIcon icon={cilCheckCircle} className="me-2 text-success" /> Approve
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectClick(offer);
                              }}
                            >
                              <CIcon icon={cilBan} className="me-2 text-danger" /> Reject
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      )}
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          
          {/* No data state */}
          {filteredOffers.length === 0 && !isLoading && (
            <EmptyState
              title="No Offers Found"
              description="Try adjusting your filters or add new offers"
              className="py-5"
              actionButton={{
                text: 'Add Offer',
                onClick: () => setShowAddModal(true),
                color: 'primary'
              }}
            />
          )}
          {/* Pagination */}
          {offersResponse?.data?.meta && offersResponse.data.meta.total > perPage && (
            <div className="d-flex justify-content-center align-items-center py-4">
              <CPagination
                align="center"
                aria-label="Offers pagination"
                className="mb-0"
              >
                <CPaginationItem
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </CPaginationItem>
                {Array.from({
                  length: Math.ceil(offersResponse.data.meta.total / perPage),
                }).map((_, idx) => (
                  <CPaginationItem
                    key={idx + 1}
                    active={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={
                    page === Math.ceil(offersResponse.data.meta.total / perPage)
                  }
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={showDeleteModal}
        onClose={handleDeleteCancel}
        alignment="center"
        backdrop="static"
        keyboard={false}
      >
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilWarning} className="me-2 text-warning" />
            Confirm Delete
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="text-center">
            <div className="mb-3">
              <CIcon 
                icon={cilTrash} 
                size="3xl" 
                className="text-danger mb-3" 
                style={{ opacity: 0.7 }}
              />
            </div>
            <h5 className="mb-3">Are you sure you want to delete this offer?</h5>
            {offerToDelete && (
              <div className="mb-3">
                <strong>Offer:</strong> {offerToDelete.title}
              </div>
            )}
            <p className="text-muted">
              This action cannot be undone. The offer and all associated data will be permanently removed.
            </p>
          </div>
        </CModalBody>
        <CModalFooter className="justify-content-center">
          <CButton
            color="secondary"
            variant="outline"
            onClick={handleDeleteCancel}
            disabled={isDeleting}
            className="me-2"
          >
            <CIcon icon={cilX} className="me-2" />
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <CIcon icon={cilTrash} className="me-2" />
                Delete Offer
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add Offer Modal */}
      <AddOfferModal
        visible={showAddModal}
        onClose={handleAddCancel}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Offer Modal */}
      {offerToEdit && (
        <EditOfferModal
          visible={showEditModal}
          onClose={handleEditCancel}
          offer={offerToEdit}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Reject Reason Modal */}
      <CModal
        visible={showRejectModal}
        onClose={handleRejectCancel}
        alignment="center"
        backdrop="static"
        keyboard={false}
      >
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilBan} className="me-2 text-danger" />
            Reject Offer
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <strong>Offer:</strong> {offerToApprove?.title}
          </div>
          <div className="mb-3">
            <label htmlFor="rejectionReason" className="form-label">Reason for Rejection</label>
            <textarea
              id="rejectionReason"
              className="form-control"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={3}
              required
            />
          </div>
          <p className="text-muted">
            Please provide a reason for rejecting this offer. This will be sent to the offer owner.
          </p>
        </CModalBody>
        <CModalFooter className="justify-content-center">
          <CButton
            color="secondary"
            variant="outline"
            onClick={handleRejectCancel}
          >
            <CIcon icon={cilX} className="me-2" />
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={handleRejectConfirm}
            disabled={isApproving || !rejectionReason.trim()}
          >
            {isApproving ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Rejecting...
              </>
            ) : (
              <>
                <CIcon icon={cilBan} className="me-2" />
                Reject Offer
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default OffersPage; 