const RaydiumSwapChart = () => {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h3>Raydium Swap Chart</h3>
      <iframe
        src="https://raydium.io/swap/?inputMint=sol&outputMint=4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump"
        style={{ width: "100%", height: "500px", border: "none" }}
        title="Raydium Swap Chart"
      />
    </div>
  );
};

export default RaydiumSwapChart;
