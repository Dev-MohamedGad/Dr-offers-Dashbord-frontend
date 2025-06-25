import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
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
  CProgress,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { 
  cilPencil, 
  cilTrash, 
  cilEye, 
  cilPlus, 
  cilSearch, 
  cilCalendar,
  cilClock,
  cilStar,
  cilChart,
  cilCheckCircle,
  cilShare
} from '@coreui/icons';

// Comprehensive offers data with realistic schema
const offersData = [
  {
    id: 1,
    title: 'Black Friday Mega Sale - 50% Off Everything',
    description: 'Massive discount on all electronics and gadgets. Limited time offer!',
    brand: 'Electronics World',
    brandId: 6,
    category: 'Electronics',
    discountType: 'Percentage',
    discountValue: 50,
    originalPrice: 2000,
    discountedPrice: 1000,
    status: 'Active',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    termsConditions: 'Valid on selected items only. Cannot be combined with other offers.',
    maxRedemptions: 500,
    currentRedemptions: 234,
    targetAudience: 'General Public',
    ageGroup: '18-65',
    gender: 'All',
    location: 'Dubai, UAE',
    createdDate: '2024-02-25',
    createdBy: 'Raj Patel',
    approvedBy: 'Admin',
    priority: 'High',
    featured: true,
    tags: ['Electronics', 'Sale', 'Limited Time'],
    socialMedia: {
      facebook: true,
      instagram: true,
      whatsapp: true
    },
    analytics: {
      views: 15420,
      clicks: 3240,
      conversions: 234,
      conversionRate: 7.2
    }
  },
  {
    id: 2,
    title: 'Coffee Lovers Special - Buy 2 Get 1 Free',
    description: 'Perfect morning deal for coffee enthusiasts. Premium coffee blends included.',
    brand: 'Coffee Corner Café',
    brandId: 4,
    category: 'Food & Beverages',
    discountType: 'BOGO',
    discountValue: 33,
    originalPrice: 45,
    discountedPrice: 30,
    status: 'Active',
    startDate: '2024-03-05',
    endDate: '2024-04-05',
    termsConditions: 'Valid for dine-in only. Applicable on selected coffee varieties.',
    maxRedemptions: 200,
    currentRedemptions: 89,
    targetAudience: 'Coffee Enthusiasts',
    ageGroup: '25-50',
    gender: 'All',
    location: 'Dubai Marina, UAE',
    createdDate: '2024-03-01',
    createdBy: 'Marco Benedetti',
    approvedBy: 'Admin',
    priority: 'Medium',
    featured: false,
    tags: ['Coffee', 'BOGO', 'Food'],
    socialMedia: {
      facebook: true,
      instagram: true,
      whatsapp: false
    },
    analytics: {
      views: 8920,
      clicks: 1560,
      conversions: 89,
      conversionRate: 5.7
    }
  },
  {
    id: 3,
    title: 'Summer Fitness Membership - 3 Months Free',
    description: 'Get in shape this summer! Complete gym access with personal training sessions.',
    brand: 'Fitness First Center',
    brandId: 5,
    category: 'Health & Fitness',
    discountType: 'Free Months',
    discountValue: 75,
    originalPrice: 1200,
    discountedPrice: 300,
    status: 'Active',
    startDate: '2024-03-15',
    endDate: '2024-06-15',
    termsConditions: 'New members only. Minimum 6-month commitment required.',
    maxRedemptions: 100,
    currentRedemptions: 45,
    targetAudience: 'Fitness Enthusiasts',
    ageGroup: '18-45',
    gender: 'All',
    location: 'Sheikh Zayed Road, Dubai',
    createdDate: '2024-03-10',
    createdBy: 'David Thompson',
    approvedBy: 'Admin',
    priority: 'High',
    featured: true,
    tags: ['Fitness', 'Membership', 'Health'],
    socialMedia: {
      facebook: true,
      instagram: true,
      whatsapp: true
    },
    analytics: {
      views: 12450,
      clicks: 2890,
      conversions: 45,
      conversionRate: 1.6
    }
  },
  {
    id: 4,
    title: 'Fashion Week Special - Up to 70% Off',
    description: 'Latest fashion trends at unbeatable prices. Designer collections included.',
    brand: 'Fashion Hub Boutique',
    brandId: 3,
    category: 'Fashion',
    discountType: 'Percentage',
    discountValue: 70,
    originalPrice: 800,
    discountedPrice: 240,
    status: 'Pending',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    termsConditions: 'Subject to stock availability. Final sale items excluded.',
    maxRedemptions: 300,
    currentRedemptions: 0,
    targetAudience: 'Fashion Lovers',
    ageGroup: '18-55',
    gender: 'Female',
    location: 'Mall of the Emirates, Dubai',
    createdDate: '2024-03-20',
    createdBy: 'Layla Hassan',
    approvedBy: 'Pending',
    priority: 'Medium',
    featured: false,
    tags: ['Fashion', 'Designer', 'Sale'],
    socialMedia: {
      facebook: true,
      instagram: true,
      whatsapp: false
    },
    analytics: {
      views: 0,
      clicks: 0,
      conversions: 0,
      conversionRate: 0
    }
  },
  {
    id: 5,
    title: 'Valentine Spa Package - Couple\'s Retreat',
    description: 'Romantic spa experience for couples. Includes massage, facial, and refreshments.',
    brand: 'Beauty Lounge Spa',
    brandId: 7,
    category: 'Beauty & Wellness',
    discountType: 'Fixed Amount',
    discountValue: 500,
    originalPrice: 1500,
    discountedPrice: 1000,
    status: 'Expired',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    termsConditions: 'Advance booking required. Valid for couples only.',
    maxRedemptions: 50,
    currentRedemptions: 32,
    targetAudience: 'Couples',
    ageGroup: '25-60',
    gender: 'All',
    location: 'City Walk, Dubai',
    createdDate: '2024-01-25',
    createdBy: 'Fatima Al-Zahra',
    approvedBy: 'Admin',
    priority: 'Medium',
    featured: false,
    tags: ['Spa', 'Couples', 'Valentine'],
    socialMedia: {
      facebook: true,
      instagram: true,
      whatsapp: true
    },
    analytics: {
      views: 5620,
      clicks: 890,
      conversions: 32,
      conversionRate: 3.6
    }
  },
  {
    id: 6,
    title: 'Ramadan Iftar Buffet - Family Special',
    description: 'Traditional Iftar buffet with authentic Middle Eastern cuisine for the whole family.',
    brand: 'Golden Spoon Restaurant',
    brandId: 1,
    category: 'Restaurant',
    discountType: 'Percentage',
    discountValue: 25,
    originalPrice: 200,
    discountedPrice: 150,
    status: 'Active',
    startDate: '2024-03-10',
    endDate: '2024-04-10',
    termsConditions: 'Valid during Iftar hours only. Reservations required.',
    maxRedemptions: 400,
    currentRedemptions: 156,
    targetAudience: 'Families',
    ageGroup: 'All',
    gender: 'All',
    location: 'Downtown Dubai, UAE',
    createdDate: '2024-03-05',
    createdBy: 'Ahmed Al-Rashid',
    approvedBy: 'Admin',
    priority: 'High',
    featured: true,
    tags: ['Ramadan', 'Iftar', 'Family', 'Buffet'],
    socialMedia: {
      facebook: true,
      instagram: true,
      whatsapp: true
    },
    analytics: {
      views: 18750,
      clicks: 4200,
      conversions: 156,
      conversionRate: 3.7
    }
  }
];

const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const filteredOffers = offersData.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || offer.status === statusFilter;
    const matchesCategory = categoryFilter === 'All Categories' || offer.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <CBadge color="success">Active</CBadge>;
      case 'Pending':
        return <CBadge color="warning">Pending</CBadge>;
      case 'Expired':
        return <CBadge color="danger">Expired</CBadge>;
      case 'Paused':
        return <CBadge color="secondary">Paused</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const getDiscountTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      'Percentage': 'primary',
      'Fixed Amount': 'info',
      'BOGO': 'warning',
      'Free Months': 'success'
    };
    return <CBadge color={colors[type] || 'secondary'} variant="outline">{type}</CBadge>;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <CBadge color="danger" variant="outline">High</CBadge>;
      case 'Medium':
        return <CBadge color="warning" variant="outline">Medium</CBadge>;
      case 'Low':
        return <CBadge color="secondary" variant="outline">Low</CBadge>;
      default:
        return <CBadge color="secondary" variant="outline">{priority}</CBadge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE');
  };

  // Calculate statistics
  const stats = {
    total: offersData.length,
    active: offersData.filter(o => o.status === 'Active').length,
    pending: offersData.filter(o => o.status === 'Pending').length,
    totalRedemptions: offersData.reduce((sum, o) => sum + o.currentRedemptions, 0)
  };

  return (
    <CContainer fluid>
      <div className="offers-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="offers-title">Offers Management</h2>
            <p className="text-muted">Create, manage and track all promotional offers</p>
          </div>
          <div className="d-flex gap-2">
            <CButton 
              color="success"
              onClick={() => navigate('/add-offer')}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Create Offer
            </CButton>
            <CButton color="primary" variant="outline">
              <CIcon icon={cilChart} className="me-2" />
              Analytics
            </CButton>
          </div>
        </div>

        {/* Search and Filters */}
        <CRow className="mb-4">
          <CCol md={4}>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Search offers, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CButton color="primary" variant="outline">
                <CIcon icon={cilSearch} />
              </CButton>
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
                <CDropdownItem onClick={() => setStatusFilter('Expired')}>Expired</CDropdownItem>
                <CDropdownItem onClick={() => setStatusFilter('Paused')}>Paused</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CCol>
          <CCol md={3}>
            <CDropdown>
              <CDropdownToggle color="secondary" variant="outline" className="w-100">
                {categoryFilter}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setCategoryFilter('All Categories')}>All Categories</CDropdownItem>
                <CDropdownItem onClick={() => setCategoryFilter('Electronics')}>Electronics</CDropdownItem>
                <CDropdownItem onClick={() => setCategoryFilter('Food & Beverages')}>Food & Beverages</CDropdownItem>
                <CDropdownItem onClick={() => setCategoryFilter('Fashion')}>Fashion</CDropdownItem>
                <CDropdownItem onClick={() => setCategoryFilter('Health & Fitness')}>Health & Fitness</CDropdownItem>
                <CDropdownItem onClick={() => setCategoryFilter('Beauty & Wellness')}>Beauty & Wellness</CDropdownItem>
                <CDropdownItem onClick={() => setCategoryFilter('Restaurant')}>Restaurant</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CCol>
          <CCol md={2}>
            <CButton color="secondary" variant="outline" className="w-100">
              Reset Filters
            </CButton>
          </CCol>
        </CRow>
      </div>

      {/* Statistics Cards */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-primary fw-bold">{stats.total}</h4>
              <p className="text-muted mb-0">Total Offers</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-success fw-bold">{stats.active}</h4>
              <p className="text-muted mb-0">Active Offers</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-warning fw-bold">{stats.pending}</h4>
              <p className="text-muted mb-0">Pending Approval</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-info fw-bold">{stats.totalRedemptions.toLocaleString()}</h4>
              <p className="text-muted mb-0">Total Redemptions</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Offer Details</CTableHeaderCell>
                <CTableHeaderCell>Brand</CTableHeaderCell>
                <CTableHeaderCell>Discount</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Duration</CTableHeaderCell>
                <CTableHeaderCell>Redemptions</CTableHeaderCell>
                <CTableHeaderCell>Performance</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredOffers.map((offer) => (
                <CTableRow key={offer.id}>
                  <CTableDataCell>
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        <div className="fw-bold">{offer.title}</div>
                        {offer.featured && <CIcon icon={cilStar} className="text-warning ms-2" size="sm" />}
                      </div>
                      <div className="small text-muted mb-1">{offer.description}</div>
                      <div className="d-flex gap-1 flex-wrap">
                        {getDiscountTypeBadge(offer.discountType)}
                        {getPriorityBadge(offer.priority)}
                        <CBadge color="light" variant="outline">{offer.category}</CBadge>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="fw-bold">{offer.brand}</div>
                    <div className="small text-muted">{offer.createdBy}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="fw-bold text-success">
                      {offer.discountType === 'Percentage' ? `${offer.discountValue}% OFF` : 
                       offer.discountType === 'Fixed Amount' ? `AED ${offer.discountValue} OFF` :
                       offer.discountType === 'BOGO' ? 'Buy 2 Get 1 Free' :
                       `${offer.discountValue}% Value`}
                    </div>
                    <div className="small text-muted">
                      <span className="text-decoration-line-through">{formatCurrency(offer.originalPrice)}</span>
                      <span className="ms-1 fw-bold">{formatCurrency(offer.discountedPrice)}</span>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {getStatusBadge(offer.status)}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="small">
                      <div>
                        <CIcon icon={cilCalendar} size="sm" className="me-1" />
                        {formatDate(offer.startDate)}
                      </div>
                      <div className="text-muted">
                        <CIcon icon={cilClock} size="sm" className="me-1" />
                        {formatDate(offer.endDate)}
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="mb-1">
                      <div className="fw-bold">{offer.currentRedemptions}/{offer.maxRedemptions}</div>
                    </div>
                    <CProgress 
                      value={(offer.currentRedemptions / offer.maxRedemptions) * 100} 
                      color="success" 
                      height={4}
                    />
                    <div className="small text-muted mt-1">
                      {Math.round((offer.currentRedemptions / offer.maxRedemptions) * 100)}% used
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="small">
                      <div>{offer.analytics.views.toLocaleString()} views</div>
                      <div>{offer.analytics.clicks.toLocaleString()} clicks</div>
                      <div className="fw-bold text-primary">{offer.analytics.conversionRate}% CVR</div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButtonGroup size="sm">
                      <CButton color="primary" variant="ghost" size="sm">
                        <CIcon icon={cilEye} />
                      </CButton>
                      <CButton color="warning" variant="ghost" size="sm">
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="info" variant="ghost" size="sm">
                        <CIcon icon={cilShare} />
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
    </CContainer>
  );
};

export default OffersPage; 