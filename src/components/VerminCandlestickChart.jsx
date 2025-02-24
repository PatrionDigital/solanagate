import { useEffect, useState, useRef } from "react";
import {
  ChartCanvas,
  Chart,
  XAxis,
  YAxis,
  discontinuousTimeScaleProvider,
  CandlestickSeries,
} from "react-financial-charts";

// Custom hook to observe the size of a container
const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return dimensions;
};

const fetchVerminData = async () => {
  try {
    const response = await fetch(
      "https://api.dexscreener.com/tokens/v1/solana/4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump"
    );
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching Vermin data:", error);
    throw error;
  }
};

const generateCandlestickData = (price) => {
  const now = Date.now();
  const data = [];

  for (let i = 0; i < 5; i++) {
    const timestamp = now - (4 - i) * 60 * 60 * 1000; // Last 5 hours
    const open = price * (0.99 + Math.random() * 0.02);
    const close = price * (0.99 + Math.random() * 0.02);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    data.push({
      date: new Date(timestamp),
      open: parseFloat(open.toFixed(8)),
      close: parseFloat(close.toFixed(8)),
      high: parseFloat(high.toFixed(8)),
      low: parseFloat(low.toFixed(8)),
    });
  }

  return data;
};

const VerminCandlestickChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef(null);
  const { width, height } = useResizeObserver(chartContainerRef);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenData = await fetchVerminData();
        const price = parseFloat(tokenData.priceUsd);
        const candlestickData = generateCandlestickData(price);
        setData(candlestickData);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load chart data");
        console.error("Chart initialization error:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const {
    data: chartData,
    xScale,
    xAccessor,
    displayXAccessor,
  } = discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date)(data);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {width > 0 && height > 0 && (
          <ChartCanvas
            height={height}
            ratio={3}
            width={width}
            margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
            seriesName="Vermin"
            data={chartData}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
          >
            <Chart id={1} yExtents={(d) => [d.high, d.low]}>
              <XAxis />
              <YAxis />
              <CandlestickSeries />
            </Chart>
          </ChartCanvas>
        )}
      </div>
    </div>
  );
};

export default VerminCandlestickChart;
