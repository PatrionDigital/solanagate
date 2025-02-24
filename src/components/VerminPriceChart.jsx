import { useEffect, useState } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Line,
} from "recharts";

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
      time: new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // Format as "HH:MM"
      open: parseFloat(open.toFixed(8)),
      close: parseFloat(close.toFixed(8)),
      high: parseFloat(high.toFixed(8)),
      low: parseFloat(low.toFixed(8)),
    });
  }

  return data;
};

const VerminPriceChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenData = await fetchVerminData();
        const price = parseFloat(tokenData.priceUsd);

        // Generate candlestick data for the last 5 hours
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

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: "Time", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            label={{
              value: "Price (USD)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
            tickFormatter={(value) => `$${value.toFixed(8)}`}
          />
          <Tooltip
            formatter={(value) => `$${value.toFixed(8)}`}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Bar
            dataKey="high"
            fill="#8884d8"
            stackId="a"
            shape={(props) => {
              const { x, y, width, height } = props;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={props.fill}
                  stroke="#000"
                />
              );
            }}
          />
          <Bar
            dataKey="low"
            fill="#82ca9d"
            stackId="a"
            shape={(props) => {
              const { x, y, width, height } = props;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={props.fill}
                  stroke="#000"
                />
              );
            }}
          />
          <Line type="monotone" dataKey="close" stroke="#82ca9d" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VerminPriceChart;
