import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
} from '@coreui/react-pro';
import { useGetShareownersQuery } from '@redux/slices/opportunitySlice/opportunitiesApiSlice';
import { format } from 'date-fns';
import noDataFound from '../assets/no-data-found.svg';

interface ShareholdersListProps {
  id: string;
}

const ShareholdersList = ({ id }: ShareholdersListProps) => {
  const { data: shareholders, isLoading } = useGetShareownersQuery(id);
  console.log("shareholders", shareholders);
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!shareholders?.data || shareholders.data.length === 0) {
    return (
      <div className="text-center py-5">
        <img src={noDataFound} alt="No data found" width="120" height="120" className="mb-3 opacity-75" />
        <h5 className="text-muted">No Shareholders Found</h5>
        <p className="text-muted small">There are currently no shareholders to display for this opportunity.</p>
      </div>
    );
  }

  return (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>ID</CTableHeaderCell>
          <CTableHeaderCell>Name</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Phone</CTableHeaderCell>
          <CTableHeaderCell>Number of Shares</CTableHeaderCell>
          <CTableHeaderCell>Share Price Paid</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {shareholders.data.map((shareholder: any) => (
          <CTableRow key={shareholder.id}>
            <CTableDataCell>{shareholder.id}</CTableDataCell>
            <CTableDataCell>{shareholder.user.name}</CTableDataCell>
            <CTableDataCell>{shareholder.user.email}</CTableDataCell>
            <CTableDataCell>{shareholder.user.phone_number}</CTableDataCell>
            <CTableDataCell>{shareholder.number_of_shares}</CTableDataCell>
            <CTableDataCell>{shareholder.share_price_paid}</CTableDataCell>
            <CTableDataCell>
              <span className={`badge ${shareholder.user.is_verified ? 'bg-success' : 'bg-warning'}`}>
                {shareholder.user.is_verified ? 'Verified' : 'Unverified'}
              </span>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default ShareholdersList; 