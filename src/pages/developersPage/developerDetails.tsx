import { useDeveloperDetailsQuery } from '@redux/slices/developersSlice/developersApiSlice';
import moment from 'moment';
import { useParams, Link } from 'react-router-dom';
import defaultAvatar from '../../assets/default-avatar.svg';
import './developerDetails.css';

const DeveloperDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useDeveloperDetailsQuery(Number(id));
  const developer = data?.data;

  if (isLoading) {
    return (
      <div className="developer-details-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading developer details...</p>
        </div>
      </div>
    );
  }

  if (isError || !developer) {
    return (
      <div className="developer-details-container">
        <Link to="/developers" className="back-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '8px' }}
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Developers
        </Link>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Developer Not Found</h2>
          <p>The developer you're looking for doesn't exist or there was an error loading the data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="developer-details-container">
      <Link to="/developers" className="back-button">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: '8px' }}
        >
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Developers
      </Link>

      <div className="profile-section">
        <div className="profile-image-container">
          <img
            src={developer.photo || defaultAvatar}
            alt={developer.name || 'Developer'}
            className="profile-image"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
        </div>
        <div className="profile-info">
          <h1 className="developer-name" title={developer.name}>
            {developer.name || 'Unknown Developer'}
          </h1>
          <div className="developer-id-badge">
            ID: {developer.id}
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <div className="detail-icon">🆔</div>
          <div className="detail-content">
            <div className="detail-label">Developer ID</div>
            <div className="detail-value">{developer.id}</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">📅</div>
          <div className="detail-content">
            <div className="detail-label">Created At</div>
            <div className="detail-value">
              {developer.created_at
                ? moment(developer.created_at).format('MMMM Do YYYY, h:mm:ss a')
                : 'N/A'}
            </div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">🔄</div>
          <div className="detail-content">
            <div className="detail-label">Last Updated</div>
            <div className="detail-value">
              {developer.updated_at
                ? moment(developer.updated_at).format('MMMM Do YYYY, h:mm:ss a')
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDetails;
