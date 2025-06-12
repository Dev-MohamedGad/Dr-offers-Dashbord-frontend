import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CAlert,
} from '@coreui/react-pro';
import { useGetInterestRequestsQuery } from '@redux/slices/opportunitySlice/opportunitiesApiSlice';
import EmptyState from './EmptyState';

type props = {
  id: string;
};
    
const InterestRequestsList = ({ id }: props) => {
  const { data, isLoading, error } = useGetInterestRequestsQuery(id);
  type Request = {
    full_name: string;
    email: string;
    phone: string;
    opportunity: {
      title_en: string;
      title_ar: string;
      available_shares: number;
      number_of_shares: number;
    };
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger" className="m-4">
        Error loading interest requests
      </CAlert>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <EmptyState 
        title="No Interest Requests Available"
        description="There are currently no interest requests to display."
        imageSize={120}
      />
    );
  }

  return (
    <CCard className="mb-4 border-0 shadow-sm">
      <CCardHeader>
        <h2 className="m-0 h4">Interest Requests</h2>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Full Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Opportunity</CTableHeaderCell>
              <CTableHeaderCell>Available Shares</CTableHeaderCell>
              <CTableHeaderCell>Number of Shares</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.data.map((request: Request, index: number) => (
              <CTableRow key={index}>
                <CTableDataCell>{request.full_name}</CTableDataCell>
                <CTableDataCell>{request.email}</CTableDataCell>
                <CTableDataCell>{request.phone}</CTableDataCell>
                <CTableDataCell>
                  <div>{request.opportunity.title_en}</div>
                  <small className="text-muted">
                    {request.opportunity.title_ar}
                  </small>
                </CTableDataCell>
                <CTableDataCell>
                  {request.opportunity.available_shares}
                </CTableDataCell>
                <CTableDataCell>
                  {request.opportunity.number_of_shares}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default InterestRequestsList;
