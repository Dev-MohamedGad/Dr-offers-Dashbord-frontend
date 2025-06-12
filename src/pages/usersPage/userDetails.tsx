import { useUserDetailsQuery } from '@redux/slices/usersSlice/usersApiSlice';
import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
  const { id } = useParams();
  const { data } = useUserDetailsQuery(id);
  const fetchedData = data?.data;
  return (
    <table className="table">
      <tbody>
        <tr>
          <td className="font-weight-bold">ID</td>
          <td>{fetchedData?.id}</td>
        </tr>
        <tr>
          <td>Name</td>
          <td>{fetchedData?.name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>{fetchedData?.email}</td>
        </tr>
        <tr>
          <td>Secondary Email</td>
          <td>{fetchedData?.secondary_email}</td>
        </tr>
        <tr>
          <td>Phone Number</td>
          <td>{fetchedData?.phone_number}</td>
        </tr>
        <tr>
          <td>Job Title</td>
          <td>{fetchedData?.job_title}</td>
        </tr>
        <tr>
          <td>Country</td>
          <td>{fetchedData?.country}</td>
        </tr>
        <tr>
          <td>Gender</td>
          <td>{fetchedData?.gender}</td>
        </tr>
        <tr>
          <td>Birth Date</td>
          <td>{moment(fetchedData?.birth_date).format('MMMM Do YYYY')}</td>
        </tr>
        <tr>
          <td>Is Verified</td>
          <td>{fetchedData?.is_verified ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td>Created At</td>

          <td>
            {moment(fetchedData?.created_at).format('MMMM Do YYYY, h:mm:ss a')}
          </td>
        </tr>
        <tr>
          <td>Updated At</td>
          <td>
            {moment(fetchedData?.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default UserDetails;
