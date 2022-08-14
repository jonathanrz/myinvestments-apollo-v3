import { useMemo } from "react";
import sum from "lodash/sum";
import numbro from "numbro";
import { Investment } from "./models";
import { TableData, TablePercentData } from "./styles";

interface FooterProps {
  parsedData: Array<Investment>;
  filterType: string | undefined;
  months: Array<string>;
}

function Footer({ parsedData, filterType, months }: FooterProps) {
  const average = useMemo(() => {
    const data: Array<string | number> = [];

    months.forEach((month: string) => {
      const monthIncomePercents: number[] = [];
      parsedData?.forEach((investment: Investment) => {
        // @ts-ignore
        if (investment.incomes[month] && investment.incomes[month].percent) {
          // @ts-ignore
          monthIncomePercents.push(investment.incomes[month].percent);
        }
      });
      if (monthIncomePercents.length) {
        data.push(sum(monthIncomePercents) / monthIncomePercents.length);
      } else {
        data.push("");
      }
    });

    const monthsWithData = data.filter((a) => a);

    return [
      (filterType || "All") + " (average)",
      sum(monthsWithData) / monthsWithData.length,
      ...data,
    ];
  }, [parsedData, filterType, months]);

  return (
    <tfoot>
      <tr>
        {average.map((data, index) => {
          if (index === 0) {
            return <TableData key={`${data}-${index}`}>{data}</TableData>;
          }
          return (
            <TablePercentData key={`${data}-${index}`}>
              {data &&
                numbro(data).format({
                  output: "percent",
                  mantissa: 2,
                })}
            </TablePercentData>
          );
        })}
      </tr>
    </tfoot>
  );
}

export default Footer;
