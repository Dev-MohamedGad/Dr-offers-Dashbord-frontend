import { useDeveloperDetailsQuery } from '@redux/slices/developersSlice/developersApiSlice';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const DeveloperDetails = () => {
  const { id } = useParams();
  const { data } = useDeveloperDetailsQuery(Number(id));
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
          <td>Photo</td>
          <td>
            {fetchedData?.photo && (
              <img src={fetchedData.photo} alt={fetchedData?.name} style={{ maxWidth: '120px', maxHeight: '120px' }} />
            )}
          </td>
        </tr>
        <tr>
          <td>Created At</td>
          <td>
            {fetchedData?.created_at ? moment(fetchedData.created_at).format('MMMM Do YYYY, h:mm:ss a') : ''}
          </td>
        </tr>
        <tr>
          <td>Updated At</td>
          <td>
            {fetchedData?.updated_at ? moment(fetchedData.updated_at).format('MMMM Do YYYY, h:mm:ss a') : ''}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default DeveloperDetails;
