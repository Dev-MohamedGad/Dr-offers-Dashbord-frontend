interface MediaItem {
  id: number;
  url: string;
  alt_text?: string;
}

interface PropertyImagesProps {
  media: MediaItem[];
}

const PropertyImages = ({ media }: PropertyImagesProps) => {
  if (!media || media.length === 0) return null;

  return (
    <div className="media-section">
      <div className="row g-2">
        {media.map((mediaItem, index) => (
          <div key={mediaItem.id} className={`col-${index === 0 ? '12' : '6'}`}>
            <img
              src={mediaItem.url}
              alt={mediaItem.alt_text || `Property image ${index + 1}`}
              className="img-fluid rounded"
              style={{
                height: index === 0 ? '250px' : '120px',
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyImages;
