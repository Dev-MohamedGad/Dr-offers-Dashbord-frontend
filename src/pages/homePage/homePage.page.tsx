import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CButton,
  CProgress,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { 
  cilGrid, 
  cilTag, 
  cilPeople, 
  cilArrowTop, 
  cilArrowBottom,
  cilChart,
  cilStar,
  cilCalendar,
  cilBuilding,
  cilCog,
  cilTruck,
  cilBriefcase,
  cilRestaurant,
  cilHome,
  cilUser,
  cilCaretTop
} from '@coreui/icons';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useGetAllBrandsQuery } from '@redux/slices/brandsSlice/brandsApiSlice';
import './homePage.styles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

function HomePage() {
  const { t } = useTranslation();
  // Fetch brands data from API
  const { data: brandsResponse, isLoading: brandsLoading, error: brandsError } = useGetAllBrandsQuery({});
  
  // Extract brands data and handle loading/error states
  const brandsData = brandsResponse?.data?.data || [];
  
  // Dashboard metrics matching the image
  const metrics = {
    views: { value: '721K', change: '+11.01%', trend: 'up' },
    visits: { value: '367K', change: '-0.03%', trend: 'down' },
    activeBrands: { value: brandsData.filter(brand => brand.status === 'active').length.toString(), change: '+15.03%', trend: 'up' },
    activeUsers: { value: '2K', change: '+6.08%', trend: 'up' }
  };

  // Transform API data to match component expectations
  const transformedBrandsData = brandsData.slice(0, 5).map(brand => ({
    id: brand.id,
    name: brand.brand_name,
    status: brand.status === 'active' ? t('common.active') : brand.status === 'pending' ? t('dashboard.pending') : t('dashboard.rejected'),
    color: brand.status === 'active' ? 'success' : brand.status === 'pending' ? 'secondary' : 'danger'
  }));

  // Default SVG for brand placeholders
  const DefaultBrandIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9CA3AF" strokeWidth="1.5" fill="#F9FAFB"/>
      <path d="M7 10L12 15L17 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Chart data matching the image design
  const chartData = {
    labels: ['10am', '11am', '12am', '01am', '02am', '03am', '04am', '05am', '06am', '07am'],
    datasets: [
      {
        label: 'Views',
        data: [6, 3.5, 6, 3.5, 2.5, 5, 1.5, 3.5, 7, 7.5],
        borderColor: '#FF6B35',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          
          if (!chartArea) {
            return null;
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(255, 107, 53, 0.3)');
          gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.15)');
          gradient.addColorStop(1, 'rgba(255, 107, 53, 0.02)');
          
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#8B4513',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#8B4513',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
      }
    ]
  };

  // Plugin to draw dotted line at specific point
  const dottedLinePlugin = {
    id: 'dottedLine',
    afterDatasetsDraw: function(chart: any) {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      const point = meta.data[5]; // Point at "03am" which shows the tooltip
      
      if (point) {
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x, chart.chartArea.bottom);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'point' as const,
        intersect: true,
        backgroundColor: '#1a202c',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#1a202c',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 12,
          weight: 500
        },
        bodyFont: {
          size: 14,
          weight: 600
        },
        padding: 12,
        caretSize: 6,
        callbacks: {
          title: function() {
            return t('dashboard.viewTooltip');
          },
          label: function(context: any) {
            return context.parsed.y.toFixed(2);
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: '#f0f0f0',
          borderColor: '#e5e5e5',
          lineWidth: 1,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          },
          padding: 10
        }
      },
      y: {
        display: true,
        min: 0,
        max: 10,
        grid: {
          display: true,
          color: '#f0f0f0',
          borderColor: '#e5e5e5',
          lineWidth: 1,
        },
        ticks: {
          stepSize: 2,
          color: '#9ca3af',
          font: {
            size: 11
          },
          padding: 15,
          callback: function(value: any) {
            return value;
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? cilArrowTop : cilArrowBottom;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-success' : 'text-danger';
  };

  // Top 5 Brands Bar Chart Data - Exact match to reference image
  const top5BrandsData = {
    labels: [`${t('brands.brand')}1`, `${t('brands.brand')}2`, `${t('brands.brand')}3`, `${t('brands.brand')}4`, `${t('brands.brand')}5`],
    datasets: [
      {
        label: t('dashboard.hours'),
        data: [72, 65, 50, 35, 22],
        backgroundColor: '#B44C43',
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 12,
          bottomRight: 12
        },
        maxBarThickness: 60,
        borderSkipped: false,
      }
    ]
  };

  const top5BrandsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 13,
            weight: 500
          },
          padding: 10
        }
      },
      y: {
        min: 0,
        max: 80,
        grid: {
          color: '#f0f0f0',
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          stepSize: 20,
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 400
          },
          padding: 15,
          callback: function(value: any) {
            return `${value} ${t('dashboard.hours')}`;
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 12,
      }
    }
  };

  // Subscription Plans Data - Exact match to design
  const subscriptionPlansRawData = [
    { label: t('dashboard.free'), value: 38.6, color: '#1f2937' },
    { label: t('dashboard.custom'), value: 22.5, color: '#B44C43' },
    { label: t('dashboard.free'), value: 30.8, color: '#e5e7eb' },
    { label: t('dashboard.other'), value: 8.1, color: '#Custom' }
  ];

  // Calculate total and validate data
  const totalSubscriptions = subscriptionPlansRawData.reduce((sum, item) => sum + item.value, 0);
  const isValidData = totalSubscriptions > 0 && subscriptionPlansRawData.every(item => item.value >= 0);

  // Normalize data to ensure it adds up to 100%
  const normalizedData = isValidData 
    ? subscriptionPlansRawData.map(item => ({
        ...item,
        percentage: Math.round((item.value / totalSubscriptions) * 100 * 10) / 10
      }))
    : [];

  const subscriptionPlansData = {
    labels: normalizedData.map(item => item.label),
    datasets: [
      {
        data: normalizedData.map(item => item.value),
        backgroundColor: normalizedData.map(item => item.color),
        borderColor: '#ffffff',
        borderWidth: 3,
        cutout: '65%',
        borderRadius: 8,
        spacing: 5,
      }
    ]
  };

  const subscriptionPlansOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1a202c',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#1a202c',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 12,
          weight: 500
        },
        bodyFont: {
          size: 14,
          weight: 600
        },
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const dataIndex = context.dataIndex;
            const item = normalizedData[dataIndex];
            return `${item.label}: ${item.value}% (${item.percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 3,
        borderRadius: 8,
        borderColor: '#ffffff',
      }
    },
    onHover: (event: any, activeElements: any) => {
      if (event.native && event.native.target) {
        event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
      }
    }
  };

  return (
    <CContainer fluid className="dashboard-container compact-dashboard">
     
      {/* Metrics Row */}
      <CRow className="mb-3 g-2">
        {/* Views Card */}
        <CCol xs={12} sm={6} md={6} lg={3} className="mb-3">
          <CCard className="metric-card h-100">
            <CCardBody>
              <div className="metric-content">
                <div className="metric-label">{t('dashboard.views')}</div>
                <div className="metric-value">{metrics.views.value}</div>
                <div className={`metric-change ${getTrendColor(metrics.views.trend)}`}>
                  <CIcon icon={getTrendIcon(metrics.views.trend)} size="sm" className="me-1" />
                  {metrics.views.change}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Visits Card */}
        <CCol xs={12} sm={6} md={6} lg={3}>
          <CCard className="metric-card h-100">
            <CCardBody>
              <div className="metric-content">
                <div className="metric-label">{t('dashboard.visits')}</div>
                <div className="metric-value">{metrics.visits.value}</div>
                <div className={`metric-change ${getTrendColor(metrics.visits.trend)}`}>
                  <CIcon icon={getTrendIcon(metrics.visits.trend)} size="sm" className="me-1" />
                  {metrics.visits.change}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Active Brands Card */}
        <CCol xs={12} sm={6} md={6} lg={3}>
          <CCard className="metric-card h-100">
            <CCardBody>
              <div className="metric-content">
                <div className="metric-label">{t('dashboard.activeBrands')}</div>
                <div className="metric-value">{metrics.activeBrands.value}</div>
                <div className={`metric-change ${getTrendColor(metrics.activeBrands.trend)}`}>
                  <CIcon icon={getTrendIcon(metrics.activeBrands.trend)} size="sm" className="me-1" />
                  {metrics.activeBrands.change}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Active Users Card */}
        <CCol xs={12} sm={6} md={6} lg={3}>
          <CCard className="metric-card h-100">
            <CCardBody>
              <div className="metric-content">
                <div className="metric-label">{t('dashboard.activeUsers')}</div>
                <div className="metric-value">{metrics.activeUsers.value}</div>
                <div className={`metric-change ${getTrendColor(metrics.activeUsers.trend)}`}>
                  <CIcon icon={getTrendIcon(metrics.activeUsers.trend)} size="sm" className="me-1" />
                  {metrics.activeUsers.change}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Content Row */}
      <CRow className="g-2 mb-3">
        {/* Chart Section */}
        <CCol xs={12} xl={8}>
          <CCard >
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} plugins={[dottedLinePlugin]} />
              </div>
          </CCard>
        </CCol>

        {/* Brands List */}
        <CCol xs={12} xl={4}>
          <CCard className="brands-list-card h-100">
            <div className="brands-header">
              <h6 className="brands-title">{t('dashboard.brands')}</h6>
              <CIcon icon={cilCaretTop} size="sm" className="text-muted" />
            </div>
            
            <div className="brands-list">
              {brandsLoading ? (
                <div className="text-center py-3">
                  <CSpinner size="sm" />
                  <div className="mt-2 text-muted">{t('dashboard.loadingBrands')}</div>
                </div>
              ) : brandsError ? (
                <div className="text-center py-3 text-danger">
                  <small>{t('dashboard.errorLoadingBrands')}</small>
                </div>
              ) : transformedBrandsData.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <small>{t('dashboard.noBrandsFound')}</small>
                </div>
              ) : (
                transformedBrandsData.map((brand) => (
                  <div key={brand.id} className="brand-item">
                    <div className="d-flex align-items-center">
                      <div className="brand-icon">
                        <div className="brand-avatar-img">
                          <DefaultBrandIcon />
                        </div>
                      </div>
                      <span className="brand-name">{brand.name}</span>
                    </div>
                    <div className="brand-status">
                      <div className={`status-dot ${brand.status.toLowerCase()}`}></div>
                      <span className={`status-text ${brand.status.toLowerCase()}`}>{brand.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CCard>
        </CCol>
      </CRow>

      {/* Additional Analytics Row */}
      <CRow className="g-2">
        {/* Top 5 Brands */}
        <CCol xs={12} lg={7}>
          <CCard className="chart-card h-100">
            <CCardBody>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3">
                <h6 className="chart-title mb-2 mb-sm-0">{t('dashboard.topBrands')}</h6>
                <div className="chart-legend d-flex align-items-center">
                  <div className="legend-item d-flex align-items-center">
                    <div className="legend-color me-2" style={{backgroundColor: '#B44C43'}}></div>
                    <span className="legend-text">{t('brands.brand')}</span>
                  </div>
                </div>
              </div>
              <div className="bar-chart-container">
                <Bar data={top5BrandsData} options={top5BrandsOptions} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Subscription Plans */}
        <CCol xs={12} lg={5}>
          <CCard className="chart-card h-100">
            <CCardBody>
              <h6 className="chart-title mb-4">{t('dashboard.subscriptionPlans')}</h6>
              
              {!isValidData ? (
                <div className="text-center py-4">
                  <div className="text-muted">
                    <CIcon icon={cilChart} size="xl" className="mb-2" />
                    <p className="mb-0">{t('dashboard.noSubscriptionData')}</p>
                  </div>
                </div>
              ) : (
                <div className="subscription-plans-layout">
                  <div className="donut-chart-section">
                    <div className="donut-chart-wrapper">
                      <Doughnut data={subscriptionPlansData} options={subscriptionPlansOptions} />
                    </div>
                  </div>
                  <div className="legend-section">
                    {normalizedData.map((item, index) => (
                      <div key={index} className="subscription-legend-item">
                        <div className="legend-row  ">
                          <div className="legend-indicator">
                            <div 
                              className="legend-dot" 
                              style={{backgroundColor: item.color}}
                            ></div>
                            <span className="legend-text">{item.label}</span>
                          </div>
                          <span className="legend-percentage">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default HomePage;
