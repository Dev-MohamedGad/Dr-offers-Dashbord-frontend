import { usePromotionDetailsQuery } from '@redux/slices/promotionsSlice/promotionsApiSlice';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Promotion } from 'src/types/promotion.type';
import defaultAvatar from '../../assets/default-avatar.svg';
const PromotionDetails = () => {
  const { id } = useParams();
  type PromotionResponse = {
    data: {
      data: Promotion;
    };
  };    
  const { data } = usePromotionDetailsQuery<PromotionResponse>(Number(id));
  const promotion = data?.data;

  if (!promotion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">Promotion Details</h5>
        <table className="table">
          <tbody>
            <tr>
              <td className="font-weight-bold">ID</td>
              <td>{promotion.id}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{promotion.name}</td>
            </tr>
            <tr>
              <td>Photo</td>
              <td>
                {promotion.photo && (
                  <img 
                    src={promotion.photo || defaultAvatar} 
                    alt={promotion.name} 
                    className="img-thumbnail" 
                    style={{ maxWidth: '200px' }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>Developer ID</td>
              <td>{promotion.developer.id}</td>
            </tr>
            <tr>
              <td>Created At</td>
              <td>
                {moment(promotion.created_at).format('MMMM Do YYYY, h:mm:ss a')}
              </td>
            </tr>
            <tr>
              <td>Updated At</td>
              <td>
                {moment(promotion.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionDetails;
