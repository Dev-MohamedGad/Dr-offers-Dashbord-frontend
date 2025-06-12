import { useBookingDetailsQuery } from '@redux/slices/booking/bookingapiSlice';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import PropertyImages from '@components/PropertyImages';
const BookingDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useBookingDetailsQuery(id);

  const StatusBadge = ({
    status,
  }: {
    status: 'pending' | 'success' | 'error';
  }) => (
    <span
      className={`badge p-2 ${status === 'pending' ? 'bg-warning' : 'bg-success'}`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );

  if (isLoading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="container py-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: '50vh' }}
      >
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <i className="fas fa-exclamation-circle text-danger fs-1 mb-3"></i>
            <h5 className="text-danger">Error</h5>
            <p className="mb-0">'Something went wrong'</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header ps-px d-flex justify-content-between align-items-center bg-body-tertiary">
          <h5 className="mb-0">Booking Details</h5>
          <StatusBadge status={data?.data?.status} />
        </div>

        <div className="card-body bg-body-tertiary">
          {/* Property Details Section */}
          <div className="mb-4">
            <h6 className="border-bottom pb-2 mb-3">Property Information</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <strong>Title:</strong>
                  <p className="mb-1">{data?.data?.title_en}</p>
                  <p className="mb-0 text-body-secondary">
                    {data?.data?.title_ar}
                  </p>
                </div>
                <div className="mb-3">
                  <strong>Location:</strong>
                  <p className="mb-1">{data?.data?.property?.location_en}</p>
                  <p className="mb-0 text-body-secondary">
                    {data?.data?.property?.location_ar}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <PropertyImages media={data?.data?.media} />
              </div>
              {data.data.property?.directions && (
                <div className="d-grid mt-2">
                  <a
                    href={data.data.property.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fas fa-map-marker-alt me-2"></i>
                    View Directions
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Booking Period Section */}
          <div className="mb-4">
            <h6 className="border-bottom pb-2 mb-3">Booking Period</h6>
            <div className="row">
              <div className="col-md-4">
                <strong>From:</strong>
                <p>{moment(data?.data?.from).format('MMMM Do YYYY')}</p>
              </div>
              <div className="col-md-4">
                <strong>To:</strong>
                <p>{moment(data?.data?.to).format('MMMM Do YYYY')}</p>
              </div>
              <div className="col-md-4">
                <strong>Duration:</strong>
                <p>{data?.data?.number_of_days} days</p>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-4">
            <h6 className="border-bottom pb-2 mb-3">Contact Information</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <strong>Customer:</strong>
                  <p className="mb-1">{data?.data?.customer?.name}</p>
                  <p className="mb-0 text-body-secondary">
                    {data?.data?.customer?.email}
                  </p>
                </div>
              </div>
              {data?.data?.admin && (
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>Admin Contact:</strong>
                    <p className="mb-1">{data?.data?.admin?.name}</p>
                    <p className="mb-0 text-body-secondary">
                      {data?.data?.admin?.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-body-secondary small">
            <p className="mb-1">
              Created:{' '}
              {moment(data?.data?.created_at).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
            <p className="mb-0">
              Last Updated:{' '}
              {moment(data?.data?.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
