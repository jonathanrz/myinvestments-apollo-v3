import { useMemo } from "react";
import numbro from "numbro";
import omit from "lodash/omit";
import sum from "lodash/sum";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Investment } from "./models";

interface ChartProps {
  parsedData: Array<Investment>;
  months: Array<string>;
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

function Chart({ parsedData, months }: ChartProps) {
  const chartData = useMemo(() => {
    // @ts-ignore
    const data = [];
    const investmentsWithData: Array<string> = [];

    months.forEach((month) => {
      const monthData = { month, average: 0 };

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

      const allData = Object.values(omit(monthData, "month")).filter(
        (v) => v !== 0
      );

      monthData.average = sum(allData) / allData.length;
      data.push(monthData);
    });

    // @ts-ignore
    return { data, investmentsWithData };
  }, [parsedData, months]);

  return (
    <LineChart
      width={months.length * 70}
      height={500}
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
      <Line
        type="monotone"
        dataKey="average"
        stroke="#000000"
        dot={false}
        strokeWidth={2}
      />
      {chartData.investmentsWithData.map(
        (investmentName: string, index: number) => (
          <Line
            key={investmentName}
            type="monotone"
            dataKey={investmentName}
            stroke={COLORS[index % COLORS.length]}
            dot={false}
            strokeWidth={1}
          />
        )
      )}
    </LineChart>
  );
}

export default Chart;
