import { useState } from 'react';
import {
  CButton,
  CCardBody,
  CCollapse,
  CSmartTable,
  CFormSelect,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react-pro';

import type { Item } from '@coreui/react-pro/src/components/smart-table/types';

import { useNavigate } from 'react-router-dom';
import DeleteModal from '@components/DeleteModal';
import EditAndCreateOpportunityForm from './EditAndCreateOpportunityForm';
import EmptyState from '@components/EmptyState';
import {
  useAddOpportunityApiSliceMutation,
  useOpportunitiesListQuery,
  useUpdateOpportunityApiSliceMutation,
  useRemoveOpportunityApiSliceMutation,
} from '@redux/slices/opportunitySlice/opportunitiesApiSlice';
import './opportunityPage.page.css';
const OpportunitiesPage = () => {
  const [details, setDetails] = useState<number[]>([]);
  const [modalType, setModalType] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [typeOpportunity, setTypeOpportunity] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const [filters, setFilters] = useState({
    type: '',
    country: '',
    status: '',
    search_query: '',
  });
  const [removeOpportunity] = useRemoveOpportunityApiSliceMutation();
  const [editOpportunity] = useUpdateOpportunityApiSliceMutation();
  const [addOpportunity] = useAddOpportunityApiSliceMutation();

  const navigate = useNavigate();
  const { data } = useOpportunitiesListQuery({
    page,
    perPage,
    ...filters,
    refetchOnMountOrArgChange: true,
  });
  const fetchedProperties = data?.data.properties ?? [];
  const totalItems = data?.data.paginationData.total ?? 0;
  const totalPages = Math.ceil(totalItems / perPage);

  const [typeModalVisible, setTypeModalVisible] = useState<boolean>(false);
  const [isTableVisible, setIsTableVisible] = useState<boolean>(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const columns = [
    {
      key: 'country',
      label: 'Country',
      _style: {
        width: '20%',
        padding: '0.75rem',
        verticalAlign: 'top',
        backgroundColor: 'var(--cui-table-bg)',
        color: 'var(--cui-table-color)',
        borderBottom: '1px solid var(--cui-table-border-color)',
      },
      filter: true,
      sorter: true,
    },
    {
      key: 'status',
      label: 'Status',
      _style: {
        width: '25%',
        padding: '0.75rem',
        verticalAlign: 'top',
        backgroundColor: 'var(--cui-table-bg)',
        color: 'var(--cui-table-color)',
        borderBottom: '1px solid var(--cui-table-border-color)',
      },
      filter: true,
      sorter: true,
    },
    {
      key: 'opportunity_type',
      label: 'Opportunity Type',
      _style: {
        width: '20%',
        padding: '0.75rem',
        verticalAlign: 'top',
        backgroundColor: 'var(--cui-table-bg)',
        color: 'var(--cui-table-color)',
        borderBottom: '1px solid var(--cui-table-border-color)',
      },
      filter: true,
      sorter: true,
    },
    {
      key: 'title_en',
      label: 'Title',
      _style: {
        width: '15%',
        padding: '0.75rem',
        verticalAlign: 'top',
        backgroundColor: 'var(--cui-table-bg)',
        color: 'var(--cui-table-color)',
        borderBottom: '1px solid var(--cui-table-border-color)',
      },
      filter: true,
      sorter: true,
    },
    {
      key: 'show_details',
      label: '',
      _style: {
        width: '5%',
        padding: '0.75rem',
        verticalAlign: 'top',
        backgroundColor: 'var(--cui-table-bg)',
        color: 'var(--cui-table-color)',
        borderBottom: '1px solid var(--cui-table-border-color)',
      },
      filter: false,
      sorter: false,
    },
  ];

  const toggleDetails = (index: number) => {
    if (index === undefined) return;
    
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
    setIsTableVisible(false);
    setIsFormVisible(true);
    setModalType('create');
  };
  const editItem = (item: Item) => {
    setSelectedItem(item);
    setIsTableVisible(false);
    setIsFormVisible(true);
    setModalType('edit');
  };
  const deleteItem = (item: Item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'sold out':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const openTypeModal = () => {
    setTypeModalVisible(true);
  };

  const handleTypeSelection = () => {
    if (typeOpportunity) {
      setTypeModalVisible(false);
      setModalType(typeOpportunity);
      addItem();
    }
  };

  return (
    <div className="pb-4">
      {isTableVisible && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-2">Opportunities List</h2>
            <div className="d-flex gap-2 flex-wrap">
              {filters.type && (
                <span className="badge bg-primary">Type: {filters.type}</span>
              )}
              {filters.country && (
                <span className="badge bg-info">
                  Country: {filters.country}
                </span>
              )}
              {filters.status && (
                <span className="badge bg-success">
                  Status: {filters.status}
                </span>
              )}
              {filters.search_query && (
                <span className="badge bg-secondary">
                  Search: {filters.search_query}
                </span>
              )}
              {(filters.type ||
                filters.country ||
                filters.status ||
                filters.search_query) && (
                <CButton
                  color="link"
                  className="p-0 text-decoration-none"
                  onClick={() =>
                    setFilters({
                      type: '',
                      country: '',
                      status: '',
                      search_query: '',
                    })
                  }
                >
                  Clear all filters
                </CButton>
              )}
            </div>
          </div>
          <CButton className="primary-btn" onClick={openTypeModal}>
            Create opportunity
          </CButton>
        </div>
      )}

      {/* Type Selection Modal */}
      <CModal
        visible={typeModalVisible}
        onClose={() => setTypeModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Select Opportunity Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            onChange={(e) => {
              setTypeOpportunity(e.target.value);
            }}
            value={typeOpportunity}
          >
            <option value="">Select Opportunity Type</option>
            <option value="property">Property</option>
            <option value="project">Project</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setTypeModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleTypeSelection}>
            Confirm
          </CButton>
        </CModalFooter>
      </CModal>

      <DeleteModal
        selectedItem={selectedItem}
        visible={deleteModal}
        setVisible={setDeleteModal}
        modalTitle="Delete opportunity"
        action={removeOpportunity}
      />

      {isFormVisible && (
        <EditAndCreateOpportunityForm
          onClose={() => {
            setIsTableVisible(true);
            setIsFormVisible(false);
          }}
          typeOpportunity={typeOpportunity}
          modalType={modalType}
          selectedItem={selectedItem ? selectedItem : {}}
          action={modalType === 'create' ? addOpportunity : editOpportunity}
        />
      )}

      {isTableVisible && (
        <CRow className="mb-4 px-3 flex justify-content-between">
          <CCol sm={3}>
            <CFormSelect
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="property">Property</option>
              <option value="project">Project</option>
            </CFormSelect>
          </CCol>
          <CCol sm={3}>
            <CFormSelect
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="Egypt">Egypt</option>
              <option value="UAE">UAE</option>
            </CFormSelect>
          </CCol>
          <CCol sm={3}>
            <CFormSelect
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="available">Available</option>
              <option value="sold out">Sold Out</option>
            </CFormSelect>
          </CCol>
        </CRow>
      )}

      {isTableVisible && fetchedProperties.length === 0 && (
        <EmptyState 
          title="No Opportunities Found"
          description="No opportunities match your current filters. Try adjusting your search criteria or create a new opportunity."
          actionButton={{
            text: "Create New Opportunity",
            onClick: openTypeModal,
            color: "primary"
          }}
        />
      )}

      {isTableVisible && fetchedProperties.length > 0 && (
        <CSmartTable
          sorterValue={{ column: 'name', state: 'asc' }}
          clickableRows
          tableProps={{
            striped: true,
            hover: true,
            responsive: true,
            className: 'border-top shadow-sm rounded opportunities-table',
          }}
          items={fetchedProperties}
          columns={columns}
          tableFilter
          cleaner
          itemsPerPageSelect
          itemsPerPage={perPage}
          onItemsPerPageChange={(perPage) => setPerPage(perPage)}
          columnSorter
          pagination
          paginationProps={{
            activePage: page,
            pages: totalPages,
  
            onActivePageChange: (newPage: number) => setPage(newPage),
            className: 'opportunities-table-pagination'
          }}
  
          scopedColumns={{
            show_details: (item: Item) => {
              if (!item.id) return <td>ID missing</td>;
              
              return (
                <td className="py-2 text-center">
                  <CButton
                    color="primary"
                    variant="ghost"
                    size="sm"
                    className="rounded-pill px-3 transition-all opportunities-table-actions-btn"
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
                        <i className="fas fa-chevron-down  me-1"></i>
                        Show
                      </>
                    )}
                  </CButton>
                </td>
              );
            },
            details: (item: Item) => {
              if (!item.id) return null;
              
              return (
                <CCollapse visible={details.includes(item.id)}>
                  <CCardBody
                    className="d-flex gap-2 p-3 bg-light bg-opacity-10 border-top opportunities-table-details-container"
                  >
                    <CButton
                      color="info"
                      variant="ghost"
                      className="d-flex align-items-center gap-2"
                      onClick={() => navigate(`/opportunities/${item.id}`)}
                    >
                      <i className="fas fa-cog"></i>
                      Details
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
            status: (item: Item) => {
              return (
                <td>
                  <span
                    className={`badge bg-${getStatusColor(item.status)} bg-opacity-10 text-${getStatusColor(item.status)} px-3 py-2 rounded-pill`}
                  >
                    {item.status}
                  </span>
                </td>
              );
            },
            title_en: (item: Item) => {
              return (
                <td>
                  <div className="fw-medium" title={item.title_en}>
                    {item.title_en && item.title_en.length > 15 
                      ? `${item.title_en.substring(0, 15)}...` 
                      : item.title_en}
                  </div>
                </td>
              );
            },
          }}
        />
      )}
    </div>
  );
};

export default OpportunitiesPage;
