import "../styles/SkeletonCard.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">

      <div className="skeleton skeleton-image"></div>

      <div className="skeleton-content">

        <div className="skeleton skeleton-title"></div>

        <div className="skeleton skeleton-title short"></div>

        <div className="skeleton skeleton-brand"></div>

        <div className="skeleton skeleton-price"></div>

        <div className="skeleton skeleton-button"></div>

      </div>

    </div>
  );
}

export default SkeletonCard;