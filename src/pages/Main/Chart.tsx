import { useMemo } from "react";
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
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
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
          monthData[investment.name] = (investment.incomes[month].percent * 100) // @ts-ignore
            .toFixed(2);

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
      width={1900}
      height={800}
      data={chartData.data}
      margin={{
        top: 50,
        right: 30,
        left: 20,
      }}
    >
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      {chartData.investmentsWithData.map(
        (investmentName: string, index: number) => (
          <Line
            key={investmentName}
            type="monotone"
            dataKey={investmentName}
            stroke={COLORS[index % COLORS.length]}
            activeDot={{ r: 8 }}
          />
        )
      )}
    </LineChart>
  );
}

export default Chart;
