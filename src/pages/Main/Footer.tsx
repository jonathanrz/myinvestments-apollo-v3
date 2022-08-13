import { useMemo } from "react";
import styled from "styled-components";
import sum from "lodash/sum";
import numbro from "numbro";
import { Investment } from "./models";

const TableData = styled.td`
  font-size: 15px;
  color: #808080;
  line-height: 1.4;

  padding: 4px 8px;
`;

interface FooterProps {
  parsedData: Array<Investment>;
  filterType: string | undefined;
  MONTHS: Array<string>;
}

function Footer({ parsedData, filterType, MONTHS }: FooterProps) {
  const average = useMemo(() => {
    const data = [filterType || "All"];

    MONTHS.forEach((month: string) => {
      const monthIncomePercents: number[] = [];
      parsedData?.forEach((investment: Investment) => {
        // @ts-ignore
        if (investment.incomes[month] && investment.incomes[month].percent) {
          // @ts-ignore
          monthIncomePercents.push(investment.incomes[month].percent);
        }
      });
      if (monthIncomePercents.length) {
        data.push(
          numbro(sum(monthIncomePercents) / monthIncomePercents.length).format({
            output: "percent",
            mantissa: 2,
          })
        );
      } else {
        data.push("");
      }
    });

    return data;
  }, [parsedData, filterType, MONTHS]);

  return (
    <tfoot>
      <tr>
        {average.map((data, index) => (
          <TableData key={`${data}-${index}`}>{data}</TableData>
        ))}
      </tr>
    </tfoot>
  );
}

export default Footer;
