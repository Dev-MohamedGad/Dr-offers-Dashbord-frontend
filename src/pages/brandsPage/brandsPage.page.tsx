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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CFormInput,
  CFormCheck,
  CButtonGroup,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilCloudDownload, cilSearch, cilFilter, cilDescription, cilOptions, cilWarning, cilX } from '@coreui/icons';
import { useGetAllBrandsQuery, useDeleteBrandMutation, Brand } from '../../redux/slices/brandsSlice';
import EmptyState from '../../components/EmptyState';
import EditBrandModal from './EditBrandModal';
import './brandsPage.styles.css';

// Extended Brand interface to include selection state for UI
interface ExtendedBrand extends Brand {
  selected?: boolean;
}

const BrandsPage: React.FC = () => {
  const navigate = useNavigate();
  const [localBrands, setLocalBrands] = useState<ExtendedBrand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<ExtendedBrand[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({
    status: 'All',
    plan: 'All'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);

  // Redux API calls
  const { 
    data: brandsResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetAllBrandsQuery({});
  
  const [deleteBrand] = useDeleteBrandMutation();

  // Transform API data to local format when data arrives
  useEffect(() => {
    if (brandsResponse?.data?.data) {
      const transformedBrands: ExtendedBrand[] = brandsResponse.data.data.map(brand => ({
        ...brand,
        selected: false
      }));
      setLocalBrands(transformedBrands);
      setFilteredBrands(transformedBrands);
    }
  }, [brandsResponse]);

  const applyFilters = () => {
    let filtered = localBrands;

    if (filters.status !== 'All') {
      filtered = filtered.filter(brand => brand.status === filters.status.toLowerCase());
    }

    if (filters.plan !== 'All') {
      filtered = filtered.filter(brand => brand.subscription_plan === filters.plan);
    }

    setFilteredBrands(filtered);
  };

  const handleFilterChange = (filterType: 'status' | 'plan', value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Apply filters immediately
    let filtered = localBrands;
    if (newFilters.status !== 'All') {
      filtered = filtered.filter(brand => brand.status === newFilters.status.toLowerCase());
    }
    if (newFilters.plan !== 'All') {
      filtered = filtered.filter(brand => brand.subscription_plan === newFilters.plan);
    }
    setFilteredBrands(filtered);
  };

  const clearFilters = () => {
    setFilters({ status: 'All', plan: 'All' });
    setFilteredBrands(localBrands);
  };

  const downloadCSV = () => {
    // Define CSV headers
    const headers = ['ID', 'Brand Name', 'Owner', 'Status', 'Document', 'Plan', 'Category', 'Views', 'Clicks', 'Visitors'];
    
    // Convert data to CSV format (use filtered data)
    const csvData = filteredBrands.map(brand => [
      brand.id,
      brand.brand_name,
      brand.owner?.name || brand.owner_name || '',
      brand.status,
      brand.business_docs || '',
      brand.subscription_plan,
      brand.category_type,
      brand.views,
      brand.clicks,
      brand.visitors
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
    link.setAttribute('download', `brands_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    switch (status.toLowerCase()) {
      case 'active':
        return <CBadge color="success" shape="rounded-pill">● {normalizedStatus}</CBadge>;
      case 'pending':
        return <CBadge color="warning" shape="rounded-pill">● {normalizedStatus}</CBadge>;
      case 'rejected':
        return <CBadge color="danger" shape="rounded-pill">● {normalizedStatus}</CBadge>;
      default:
        return <CBadge color="secondary" shape="rounded-pill">● {normalizedStatus}</CBadge>;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const updatedBrands = localBrands.map(brand => ({ ...brand, selected: checked }));
    setLocalBrands(updatedBrands);
    
    // Update filtered brands as well
    const updatedFiltered = filteredBrands.map(brand => ({ ...brand, selected: checked }));
    setFilteredBrands(updatedFiltered);
  };

  const handleSelectBrand = (id: number, checked: boolean) => {
    const updatedBrands = localBrands.map(brand => 
      brand.id === id ? { ...brand, selected: checked } : brand
    );
    setLocalBrands(updatedBrands);
    
    // Update filtered brands as well
    const updatedFiltered = filteredBrands.map(brand => 
      brand.id === id ? { ...brand, selected: checked } : brand
    );
    setFilteredBrands(updatedFiltered);
  };

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const handleEditClick = (brand: Brand) => {
    setBrandToEdit(brand);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setBrandToEdit(null);
    refetch(); // Refresh the data after successful edit
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setBrandToEdit(null);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteBrand(brandToDelete.id).unwrap();
      // Refetch data after deletion
      refetch();
      setShowDeleteModal(false);
      setBrandToDelete(null);
    } catch (error) {
      console.error('Failed to delete brand:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };

  // Get unique plans for filter options
  const getUniquePlans = () => {
    const plans = localBrands.map(brand => brand.subscription_plan);
    return ['All', ...Array.from(new Set(plans))];
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
    return (
      <CContainer>
        <EmptyState
          title="Error Loading Brands"
          description={error && 'data' in error ? error.data as string : 'An error occurred while fetching brands'}
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
      <div className="d-flex justify-content-end align-items-center mb-4">
      
                          <div className="d-flex gap-2">
           <CButton color="secondary" variant="outline" onClick={downloadCSV}>
             <CIcon icon={cilCloudDownload} className="me-2" />
             Download CSV
           </CButton>
           <CDropdown>
             <CDropdownToggle 
               style={{ 
                 backgroundColor: '#B44C43', 
                 borderColor: '#B44C43',
                 color: 'white'
               }}
             >
               <CIcon icon={cilFilter} className="me-2" />
               Filter
               {(filters.status !== 'All' || filters.plan !== 'All') && (
                 <CBadge color="light" className="ms-2" style={{ color: 'black' }}>
                   {Object.values(filters).filter(f => f !== 'All').length}
                 </CBadge>
               )}
             </CDropdownToggle>
             <CDropdownMenu style={{ minWidth: '250px', padding: '1rem' }}>
               <div className="mb-3">
                 <label className="form-label fw-semibold">Status</label>
                 <div className="d-flex flex-wrap gap-2">
                   {['All', 'Active', 'Pending', 'Rejected'].map(status => (
                     <CButton
                       key={status}
                       size="sm"
                       style={filters.status === status ? {
                         backgroundColor: '#B44C43',
                         borderColor: '#B44C43',
                         color: 'white'
                       } : {
                         borderColor: '#B44C43',
                         color: '#B44C43',
                         backgroundColor: 'transparent'
                       }}
                       onClick={() => handleFilterChange('status', status)}
                     >
                       {status}
                     </CButton>
                   ))}
                 </div>
               </div>
               <div className="mb-3">
                 <label className="form-label fw-semibold">Plan</label>
                 <div className="d-flex flex-wrap gap-2">
                   {getUniquePlans().map(plan => (
                     <CButton
                       key={plan}
                       size="sm"
                       style={filters.plan === plan ? {
                         backgroundColor: '#B44C43',
                         borderColor: '#B44C43',
                         color: 'white'
                       } : {
                         borderColor: '#B44C43',
                         color: '#B44C43',
                         backgroundColor: 'transparent'
                       }}
                       onClick={() => handleFilterChange('plan', plan)}
                     >
                       {plan}
                     </CButton>
                   ))}
                 </div>
               </div>
               <div className="d-flex justify-content-between">
                 <CButton size="sm" color="secondary" variant="outline" onClick={clearFilters}>
                   Clear All
                 </CButton>
                 <div className="text-muted small">
                   Showing {filteredBrands.length} of {localBrands.length} brands
                 </div>
               </div>
             </CDropdownMenu>
                      </CDropdown>
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
                <CTableHeaderCell className="border-0 fw-semibold text-muted">Brand</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted">Status</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted">Document</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted text-center">
                  <span style={{ cursor: 'pointer' }}>Category</span>
                </CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted text-center">
                  <span style={{ cursor: 'pointer' }}>Plan</span>
                </CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted text-center">Views</CTableHeaderCell>
                <CTableHeaderCell className="border-0 fw-semibold text-muted text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
                         <CTableBody>
               {filteredBrands.map((brand) => (
                <CTableRow 
                  key={brand.id} 
                  className="align-middle clickable-row" 
                  onClick={() => navigate(`/brands/${brand.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <CTableDataCell className="" onClick={(e) => e.stopPropagation()}>
                    <CFormCheck 
                      checked={brand.selected || false}
                      onChange={(e) => handleSelectBrand(brand.id, e.target.checked)}
                      style={{ 
                        accentColor: '#B44C43',
                        transform: 'scale(1.1)'
                      }}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <div className="fw-semibold text-dark ">{brand.brand_name}</div>
                      {(brand.owner?.name || brand.owner_name) ? (
                        <div className="text-muted small">{brand.owner?.name || brand.owner_name}</div>
                      ) : (
                        <div className="text-muted small">Brand ID: {brand.id}</div>
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {getStatusBadge(brand.status)}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div className="d-flex justify-content-center">
                      {brand.business_docs ? (
                        <div 
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#B44C43',
                            borderRadius: '8px',
                            cursor: 'default'
                          }}
                          title={`Document: ${brand.business_docs}`}
                        >
                          <CIcon icon={cilDescription} size="lg" style={{ color: 'white' }} />
                        </div>
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#f8f9fa',
                            border: '2px dashed #dee2e6',
                            borderRadius: '8px',
                            cursor: 'default'
                          }}
                          title="No document provided"
                        >
                          <CIcon icon={cilDescription} size="lg" className="text-muted opacity-50" />
                        </div>
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <span className="text-muted">{brand.category_type}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <span className="text-muted">{brand.subscription_plan}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <span className="text-muted">{brand.views}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="d-flex justify-content-center gap-1 action-buttons">
                      <CButton 
                        size="sm" 
                        color="light" 
                        variant="ghost"
                        className="p-2 rounded-circle"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(brand);
                        }}
                        title="Edit Brand"
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
                          handleDeleteClick(brand);
                        }}
                        title="Delete Brand"
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
                          navigate(`/brands/${brand.id}`);
                        }}
                        title="View Details"
                      >
                        <CIcon icon={cilOptions} size="sm" className="text-info" />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          
          {/* No data state */}
          {filteredBrands.length === 0 && !isLoading && (
            <EmptyState
              title="No Brands Found"
              description="Try adjusting your filters or add new brands"
              className="py-5"
            />
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
            <h5 className="mb-3">Are you sure you want to delete this brand?</h5>
            {brandToDelete && (
              <div className="mb-3">
                <strong>Brand:</strong> {brandToDelete.brand_name}
                <br />
                <strong>Owner:</strong> {brandToDelete.owner?.name || brandToDelete.owner_name || 'N/A'}
              </div>
            )}
            <p className="text-muted">
              This action cannot be undone. The brand and all associated data will be permanently removed.
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
                Delete Brand
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Brand Modal */}
      {brandToEdit && (
        <EditBrandModal
          visible={showEditModal}
          onClose={handleEditCancel}
          brand={brandToEdit}
          onSuccess={handleEditSuccess}
        />
      )}
    </CContainer>
  );
};

export default BrandsPage; 