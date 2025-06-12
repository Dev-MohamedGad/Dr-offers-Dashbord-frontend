import { useEffect, useState } from 'react';
import { CButton, CCardBody, CCollapse, CSmartTable } from '@coreui/react-pro';
import Swal from 'sweetalert2';
import type { Item } from '@coreui/react-pro/src/components/smart-table/types';
import { useNavigate } from 'react-router-dom';
import {
  useAddBookingMutation,
  useBookingListQuery,
  useUpdateBookingMutation,
} from '@redux/slices/booking/bookingapiSlice';
import CreateBookingForm from './editAndCreateBookingForm';
import { useOpportunitiesListQuery } from '@redux/slices/opportunitySlice/opportunitiesApiSlice';

const BookingsPage = () => {
  const [details, setDetails] = useState<number[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [updateBooking] = useUpdateBookingMutation();
  const [addBooking] = useAddBookingMutation();
  const [idProperty, setIdProperty] = useState<number[]>([]);
  const [nameProperty, setNameProperty] = useState<string[]>([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: '',
    property_id: '',
    customer_id: '',
  });

  const { data, isLoading, isFetching } = useBookingListQuery({
    ...filters,
    refetchOnMountOrArgChange: true,
  });
  const { data: oppertunitties } = useOpportunitiesListQuery({
    ...filters,
    refetchOnMountOrArgChange: true,
  });
  const columns = [
    {
      key: 'status',
      label: 'Status',
      _style: { width: '15%' },
    },
    {
      key: 'property',
      label: 'Property',
      _style: { width: '25%' },
    },
    {
      key: 'customer',
      label: 'Customer',
      _style: { width: '20%' },
    },
    {
      key: 'created_at',
      label: 'Created At',
      _style: { width: '20%' },
    },
    {
      key: 'booking_period',
      label: 'Booking Period',
      _style: { width: '20%' },
    },
    {
      key: 'show_details',
      label: '',
      _style: { width: '10%' },
      filter: false,
      sorter: false,
    },
  ];
  useEffect(() => {
    if (oppertunitties) {
      const filteredProperties = oppertunitties.data.filter((item: any) => item.opportunity_type === "property");
      const idProperty = filteredProperties.map((item: any) => item.id);
      const nameProperty = filteredProperties.map((item: any) => item.title_en);
      setIdProperty(idProperty);
      setNameProperty(nameProperty);
    }
  }, [oppertunitties]);
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
  const openCreateModal = () => {
    setSelectedItem({});
    setVisible(true);
  };

  const handleStatusUpdate = async (
    item: any,
    newStatus: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    const statusMessages = {
      pending: 'set this booking as pending',
      confirmed: 'confirm this booking',
      cancelled: 'cancel this booking',
    };

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${statusMessages[newStatus]}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      if (result.isConfirmed) {
        await updateBooking({
          id: item.id,
          body: { status: newStatus },
        })
          .unwrap()
          .then((res: any) => {
            Swal.fire({
              title: 'Success!',
              text: res.message,
              icon: 'success',
              timer: 1500,
            });
          });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update booking status.',
        icon: 'error',
      });
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filterOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="pb-4">
      <div className="d-flex justify-content-end">
        <CButton className="primary-btn" onClick={openCreateModal}>
          Create Booking
        </CButton>
      </div>

      <div className="m-4">
        <div className="row g-3">
          <div className="col-md-4">
            <select
              className="form-select form-control h-100"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              disabled={isLoading || isFetching}
            >
              <option value="">Select Status</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control h-100"
              placeholder="Property ID"
              value={filters.property_id}
              onChange={(e) =>
                handleFilterChange('property_id', e.target.value)
              }
              disabled={isLoading || isFetching}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control h-100"
              placeholder="Customer ID"
              value={filters.customer_id}
              onChange={(e) =>
                handleFilterChange('customer_id', e.target.value)
              }
              disabled={isLoading || isFetching}
            />
          </div>
        </div>
      </div>

      <CreateBookingForm
        visible={visible}
        setVisible={setVisible}
        modalTitle={'Create Booking'}
        selectedItem={selectedItem ? selectedItem : {}}
        action={addBooking}
        idProperty={idProperty}
        nameProperty={nameProperty}
      />
      {!isLoading && (
        <CSmartTable
          sorterValue={{ column: 'created_at', state: 'desc' }}
          clickableRows
          tableProps={{
            striped: true,
            hover: true,
          }}
          activePage={1}
          items={data?.data || []}
          columns={columns}
          itemsPerPageSelect
          itemsPerPage={10}
          columnSorter
          pagination
          loading={isFetching}
          scopedColumns={{
            status: (item: { status: string }) => (
              <td className="text-capitalize">{item.status}</td>
            ),
            property: (item: {
              property?: { id: number; title_en: string };
            }) => (
              <td>
                <div>ID: {item.property?.id}</div>
                <small className="text-muted">{item.property?.title_en}</small>
              </td>
            ),
            customer: (item: any) => (
              <td>
                <div>{item.customer?.name}</div>
                <small className="text-muted">ID: {item.customer?.id}</small>
              </td>
            ),
            created_at: (item: any) => (
              <td>{new Date(item.created_at).toLocaleString()}</td>
            ),
            booking_period: (item: any) => (
              <td>
                {new Date(item.from).toLocaleDateString()} -{' '}
                {new Date(item.to).toLocaleDateString()}
              </td>
            ),
            show_details: (item: any) => (
              <td className="py-2">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => toggleDetails(item.id)}
                >
                  {details.includes(item.id) ? 'Hide' : 'Show'}
                </CButton>
              </td>
            ),
            details: (item: any) => (
              <CCollapse visible={details.includes(item.id)}>
                <CCardBody className="gap-3 p-2 d-flex">
                  <CButton
                    size="sm"
                    color="info"
                    onClick={() => {
                      navigate(`/booking/${item.id}`);
                    }}
                  >
                    Booking Details
                  </CButton>
                  <CButton
                    size="sm"
                    color="success"
                    onClick={() => handleStatusUpdate(item, 'confirmed')}
                  >
                    Confirm
                  </CButton>
                  <CButton
                    size="sm"
                    color="warning"
                    onClick={() => handleStatusUpdate(item, 'pending')}
                  >
                    Set Pending
                  </CButton>
                  <CButton
                    size="sm"
                    color="danger"
                    onClick={() => handleStatusUpdate(item, 'cancelled')}
                  >
                    Cancel Booking
                  </CButton>
                </CCardBody>
              </CCollapse>
            ),
          }}
        />
      )}
    </div>
  );
};

export default BookingsPage;
