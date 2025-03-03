const Collectibles = () => {
  return (
    <div>
      <h3 className="sub-section-heading">Collectibles</h3>

      <div className="collectibles-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="nft-item">
            <span className="nft-title">NFT {item}</span>
            <div className="coming-soon-container">
              <span className="coming-soon-text">Coming Soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collectibles;
