import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CCol,
  CContainer,
  CRow,
  CBadge,
  CButtonGroup,
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
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilOptions, cilPencil, cilTrash, cilZoom, cilCloudDownload, cilSearch, cilPhone, cilLocationPin } from '@coreui/icons';
import './brandsPage.styles.css';

// Realistic brand data
const brandsData = [
  {
    id: 1,
    name: 'Golden Spoon Restaurant',
    ownerName: 'Ahmed Al-Rashid',
    email: 'ahmed@goldenspoon.ae',
    phone: '+971-50-123-4567',
    address: 'Dubai Mall, Downtown Dubai',
    category: 'Restaurant',
    status: 'Active',
    plan: 'Premium',
    joinDate: '2024-01-15',
    totalOffers: 12,
    activeOffers: 8,
    rating: 4.8,
    image: '/src/assets/avatars/1.jpg',
    instagram: '@goldenspoon_dubai',
    website: 'www.goldenspoon.ae'
  },
  {
    id: 2,
    name: 'Tech Solutions Inc',
    ownerName: 'Sarah Johnson',
    email: 'sarah@techsolutions.com',
    phone: '+971-52-987-6543',
    address: 'Business Bay, Dubai',
    category: 'Technology',
    status: 'Active',
    plan: 'Business',
    joinDate: '2024-02-20',
    totalOffers: 5,
    activeOffers: 3,
    rating: 4.6,
    image: '/src/assets/avatars/2.jpg',
    instagram: '@techsolutions_me',
    website: 'www.techsolutions.com'
  },
  {
    id: 3,
    name: 'Fashion Hub Boutique',
    ownerName: 'Layla Hassan',
    email: 'layla@fashionhub.ae',
    phone: '+971-55-456-7890',
    address: 'Mall of the Emirates, Dubai',
    category: 'Fashion',
    status: 'Pending',
    plan: 'Standard',
    joinDate: '2024-03-10',
    totalOffers: 3,
    activeOffers: 1,
    rating: 4.3,
    image: '/src/assets/avatars/3.jpg',
    instagram: '@fashionhub_uae',
    website: 'www.fashionhub.ae'
  },
  {
    id: 4,
    name: 'Coffee Corner Café',
    ownerName: 'Marco Benedetti',
    email: 'marco@coffeecorner.ae',
    phone: '+971-56-234-5678',
    address: 'JBR Walk, Dubai Marina',
    category: 'Café',
    status: 'Active',
    plan: 'Standard',
    joinDate: '2024-01-08',
    totalOffers: 18,
    activeOffers: 12,
    rating: 4.9,
    image: '/src/assets/avatars/4.jpg',
    instagram: '@coffeecorner_jbr',
    website: 'www.coffeecorner.ae'
  },
  {
    id: 5,
    name: 'Fitness First Center',
    ownerName: 'David Thompson',
    email: 'david@fitnessfirst.ae',
    phone: '+971-58-345-6789',
    address: 'Sheikh Zayed Road, Dubai',
    category: 'Fitness',
    status: 'Active',
    plan: 'Premium',
    joinDate: '2023-12-15',
    totalOffers: 7,
    activeOffers: 5,
    rating: 4.7,
    image: '/src/assets/avatars/5.jpg',
    instagram: '@fitnessfirst_dubai',
    website: 'www.fitnessfirst.ae'
  },
  {
    id: 6,
    name: 'Electronics World',
    ownerName: 'Raj Patel',
    email: 'raj@electronicsworld.ae',
    phone: '+971-50-567-8901',
    address: 'Deira City Centre, Dubai',
    category: 'Electronics',
    status: 'Suspended',
    plan: 'Business',
    joinDate: '2024-02-28',
    totalOffers: 2,
    activeOffers: 0,
    rating: 4.1,
    image: '/src/assets/avatars/6.jpg',
    instagram: '@electronics_world_uae',
    website: 'www.electronicsworld.ae'
  },
  {
    id: 7,
    name: 'Beauty Lounge Spa',
    ownerName: 'Fatima Al-Zahra',
    email: 'fatima@beautylounge.ae',
    phone: '+971-52-678-9012',
    address: 'City Walk, Dubai',
    category: 'Beauty & Wellness',
    status: 'Active',
    plan: 'Premium',
    joinDate: '2024-01-22',
    totalOffers: 9,
    activeOffers: 6,
    rating: 4.8,
    image: '/src/assets/avatars/7.jpg',
    instagram: '@beautyloungespa',
    website: 'www.beautylounge.ae'
  },
  {
    id: 8,
    name: 'Auto Care Plus',
    ownerName: 'Omar Khalil',
    email: 'omar@autocare.ae',
    phone: '+971-55-789-0123',
    address: 'Al Quoz Industrial, Dubai',
    category: 'Automotive',
    status: 'Active',
    plan: 'Standard',
    joinDate: '2024-03-05',
    totalOffers: 4,
    activeOffers: 3,
    rating: 4.5,
    image: '/src/assets/avatars/8.jpg',
    instagram: '@autocareplus_uae',
    website: 'www.autocare.ae'
  }
];

const BrandsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredBrands = brandsData.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || brand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <CBadge color="success">Active</CBadge>;
      case 'Pending':
        return <CBadge color="warning">Pending</CBadge>;
      case 'Suspended':
        return <CBadge color="danger">Suspended</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Premium':
        return <CBadge color="primary">Premium</CBadge>;
      case 'Business':
        return <CBadge color="info">Business</CBadge>;
      case 'Standard':
        return <CBadge color="secondary">Standard</CBadge>;
      default:
        return <CBadge color="light">{plan}</CBadge>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Restaurant': 'warning',
      'Technology': 'info',
      'Fashion': 'danger',
      'Café': 'dark',
      'Fitness': 'success',
      'Electronics': 'primary',
      'Beauty & Wellness': 'warning',
      'Automotive': 'secondary'
    };
    return colors[category] || 'secondary';
  };

  return (
    <CContainer fluid>
      <div className="brands-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="brands-title">Brands Management</h2>
            <p className="text-muted">Manage and monitor all registered brands</p>
          </div>
          <div className="d-flex gap-2">
            <CButton color="success">
              <CIcon icon={cilOptions} className="me-2" />
              Add Brand
            </CButton>
            <CButton color="primary" variant="outline">
              <CIcon icon={cilCloudDownload} className="me-2" />
              Export Data
            </CButton>
          </div>
        </div>

        {/* Search and Filters */}
        <CRow className="mb-4">
          <CCol md={6}>
            <CInputGroup>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Search brands, owners, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CButton color="primary" variant="outline">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </CInputGroup>
          </CCol>
          <CCol md={3}>
            <CDropdown>
              <CDropdownToggle color="primary" variant="outline" className="w-100">
                {statusFilter}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setStatusFilter('All Status')}>All Status</CDropdownItem>
                <CDropdownItem onClick={() => setStatusFilter('Active')}>Active</CDropdownItem>
                <CDropdownItem onClick={() => setStatusFilter('Pending')}>Pending</CDropdownItem>
                <CDropdownItem onClick={() => setStatusFilter('Suspended')}>Suspended</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CCol>
          <CCol md={3}>
            <CButtonGroup className="w-100">
              <CButton 
                color={viewMode === 'table' ? 'primary' : 'outline'}
                onClick={() => setViewMode('table')}
              >
                Table View
              </CButton>
              <CButton 
                color={viewMode === 'grid' ? 'primary' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>
      </div>

      {/* Statistics Cards */}
      <CRow className="mb-3">
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-primary fw-bold">{brandsData.length}</h4>
              <p className="text-muted mb-0">Total Brands</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-success fw-bold">{brandsData.filter(b => b.status === 'Active').length}</h4>
              <p className="text-muted mb-0">Active Brands</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-warning fw-bold">{brandsData.filter(b => b.status === 'Pending').length}</h4>
              <p className="text-muted mb-0">Pending Approval</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-info fw-bold">{brandsData.reduce((sum, b) => sum + b.activeOffers, 0)}</h4>
              <p className="text-muted mb-0">Active Offers</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {viewMode === 'table' ? (
        <CCard>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Brand</CTableHeaderCell>
                  <CTableHeaderCell>Contact</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Plan</CTableHeaderCell>
                  <CTableHeaderCell>Offers</CTableHeaderCell>
                  <CTableHeaderCell>Rating</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredBrands.map((brand) => (
                  <CTableRow key={brand.id}>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <img 
                          src={brand.image} 
                          alt={brand.name}
                          className="brand-avatar me-3"
                          style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold">{brand.name}</div>
                          <div className="text-muted small">{brand.ownerName}</div>
                          <div className="text-muted small">
                            <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                            {brand.address.split(',')[0]}
                          </div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="small">
                        <div>{brand.email}</div>
                        <div className="text-muted">
                          <CIcon icon={cilPhone} size="sm" className="me-1" />
                          {brand.phone}
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getCategoryColor(brand.category)}>
                        {brand.category}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {getStatusBadge(brand.status)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {getPlanBadge(brand.plan)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="small">
                        <div className="fw-bold">{brand.activeOffers}/{brand.totalOffers}</div>
                        <div className="text-muted">Active/Total</div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <span className="fw-bold me-1">{brand.rating}</span>
                        <span className="text-warning">★</span>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup size="sm">
                        <CButton color="primary" variant="ghost" size="sm">
                          <CIcon icon={cilZoom} />
                        </CButton>
                        <CButton color="warning" variant="ghost" size="sm">
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" variant="ghost" size="sm">
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      ) : (
        <CRow>
          {filteredBrands.map((brand) => (
            <CCol key={brand.id} xs={12} md={6} lg={4} className="mb-4">
              <CCard className="brand-card h-100">
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <img 
                      src={brand.image} 
                      alt={brand.name}
                      className="brand-avatar"
                      style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div className="d-flex gap-1">
                      {getStatusBadge(brand.status)}
                      {getPlanBadge(brand.plan)}
                    </div>
                  </div>
                  
                  <CCardTitle className="h5 mb-2">{brand.name}</CCardTitle>
                  <p className="text-muted mb-2">{brand.ownerName}</p>
                  
                  <div className="mb-3">
                    <CBadge color={getCategoryColor(brand.category)} className="mb-2">
                      {brand.category}
                    </CBadge>
                    <div className="small text-muted">
                      <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                      {brand.address}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="small">
                      <div className="fw-bold">{brand.activeOffers}/{brand.totalOffers} Offers</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-bold me-1">{brand.rating}</span>
                      <span className="text-warning">★</span>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <CButton size="sm" color="primary" variant="outline" className="flex-fill">
                      <CIcon icon={cilZoom} className="me-1" />
                      View
                    </CButton>
                    <CButton size="sm" color="warning" variant="outline">
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton size="sm" color="danger" variant="outline">
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}
    </CContainer>
  );
};

export default BrandsPage; 