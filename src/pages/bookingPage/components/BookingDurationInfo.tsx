interface BookingDurationInfoProps {
  from: Date;
  to: Date;
}

const BookingDurationInfo = ({ from, to }: BookingDurationInfoProps) => {
  const durationDays = Math.ceil(
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="alert alert-success mb-4">
      <i className="fas fa-check-circle me-2"></i>
      You've selected a {durationDays}-day booking from{' '}
      {from.toLocaleDateString()} to {to.toLocaleDateString()}.
    </div>
  );
};

export default BookingDurationInfo;
