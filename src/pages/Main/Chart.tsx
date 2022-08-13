import { useMemo } from "react";
import numbro from "numbro";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Investment } from "./models";

interface ChartProps {
  parsedData: Array<Investment>;
  MONTHS: Array<string>;
}

const COLORS = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

function Chart({ parsedData, MONTHS }: ChartProps) {
  const chartData = useMemo(() => {
    // @ts-ignore
    const data = [];
    const investmentsWithData: Array<string> = [];

    MONTHS.forEach((month) => {
      const monthData = { month };

      parsedData?.forEach((investment) => {
        // @ts-ignore
        if (investment.incomes[month] && investment.incomes[month].percent) {
          // @ts-ignore
          monthData[investment.name] = investment.incomes[month].percent;

          if (!investmentsWithData.includes(investment.name)) {
            investmentsWithData.push(investment.name);
          }
        }
      });
      data.push(monthData);
    });

    // @ts-ignore
    return { data, investmentsWithData };
  }, [parsedData, MONTHS]);

  return (
    <LineChart
      width={1800}
      height={800}
      data={chartData.data}
      margin={{
        top: 50,
        right: 30,
        left: 20,
      }}
    >
      <XAxis dataKey="month" />
      <YAxis
        type="number"
        tickFormatter={(tick) =>
          numbro(tick).format({
            output: "percent",
            mantissa: 2,
          })
        }
      />
      <Tooltip
        formatter={(tick: number) =>
          numbro(tick).format({
            output: "percent",
            mantissa: 2,
          })
        }
      />
      <Legend />
      {chartData.investmentsWithData.map(
        (investmentName: string, index: number) => (
          <Line
            key={investmentName}
            type="monotone"
            dataKey={investmentName}
            stroke={COLORS[index % COLORS.length]}
            dot={false}
            strokeWidth={2}
          />
        )
      )}
    </LineChart>
  );
}

export default Chart;
