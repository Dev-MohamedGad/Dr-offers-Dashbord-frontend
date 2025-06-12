import { useState } from 'react';
import {
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react-pro';
import { useCreateInvestmentMutation } from '@redux/slices/opportunitySlice/opportunitiesApiSlice';
import { useUsersListQuery } from '@redux/slices/usersSlice/usersApiSlice';
interface InvestmentFormProps {
  opportunityId: string;
}

const InvestmentForm = ({ opportunityId }: InvestmentFormProps) => {
  const [createInvestment, { isLoading, isError }] = useCreateInvestmentMutation();
  const { data: usersData, isLoading: isUsersLoading } = useUsersListQuery({
    refetchOnMountOrArgChange: true,
  });
  const [formData, setFormData] = useState({
    number_of_shares: '',
    type: 'buy',
    customer_id: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    try {
      await createInvestment({
        number_of_shares: parseInt(formData.number_of_shares),
        type: formData.type,
        customer_id: parseInt(formData.customer_id),
        opportunity_id: parseInt(opportunityId),
      }).unwrap();

      // Show success message
      setSuccessMessage('Investment created successfully!');
      
   
      
      // Reset form
      setFormData({
        number_of_shares: '',
        type: 'buy',
        customer_id: '',
      });
    } catch (err) {
      console.error('Failed to create investment:', err);
    }
  };

  return (
    <CForm onSubmit={handleSubmit}>
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}

      {isError && (
        <CAlert color="danger" className="mb-3">
          Failed to create investment. Please try again.
        </CAlert>
      )}

      <div className="mb-3">
        <CFormSelect
          id="customer_id"
          label="Select Customer"
          value={formData.customer_id}
          onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
          required
          disabled={isUsersLoading}
        >
          <option value="">Select a customer</option>
          {usersData?.data?.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </CFormSelect>
        {isUsersLoading && <CSpinner size="sm" />}
      </div>

      <div className="mb-3">
        <CFormInput
          type="number"
          id="number_of_shares"
          label="Number of Shares"
          value={formData.number_of_shares}
          onChange={(e) => setFormData({ ...formData, number_of_shares: e.target.value })}
          required
          min="1"
        />
      </div>

      <div className="mb-3">
        <CFormSelect
          id="type"
          label="Investment Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </CFormSelect>
      </div>

      <CButton type="submit" color="primary" disabled={isLoading}>
        {isLoading ? <CSpinner size="sm" /> : 'Create Investment'}
      </CButton>
    </CForm>
  );
};

export default InvestmentForm; 