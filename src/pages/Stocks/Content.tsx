import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";
import sortBy from "lodash/sortBy";
import numbro from "numbro";
import { Investment } from "../../shared/models";
import {
  Table,
  TableHeader,
  TableData,
  TablePercentHeader,
  TablePercentData,
} from "../../shared/styles";

const GET_ACTIVE_INVESTMENTS = gql`
  {
    activeInvestments {
      uuid
      name
      type
      holder
      objective
      lastIncome {
        uuid
        value
      }
    }
  }
`;

function parseData(investment: [Investment]) {
  if (!investment) return [];

  const stockInvestments = groupBy(
    investment
      .filter((investment: Investment) => investment.type === "Ação")
      .map((investment: Investment) => ({
        ...investment,
        name: investment.name.substring(0, 6).trim(),
        value: investment.lastIncome ? investment.lastIncome.value : 0,
      })),
    "name"
  );

  const summedInvestments = Object.values(stockInvestments).map(
    // @ts-ignore
    (investments: [Investment]) => ({
      ...investments[0],
      value: sumBy(investments, "value"),
    })
  );

  return sortBy(summedInvestments, "name");
}

function Content() {
  const { loading, error, data } = useQuery(GET_ACTIVE_INVESTMENTS);
  const filteredData = useMemo(
    () => parseData(data && data.activeInvestments),
    [data]
  );

  const totalValue = useMemo(
    () => sumBy(filteredData, "value"),
    [filteredData]
  );

  return (
    <div>
      {loading && "Loading..."}
      {error && error.message}
      {filteredData && (
        <Table>
          <thead>
            <tr>
              <TableHeader>Investment</TableHeader>
              <TablePercentHeader>Value</TablePercentHeader>
              <TablePercentHeader>Percent</TablePercentHeader>
            </tr>
          </thead>
          <tbody>
            {/* @ts-ignore */}
            {filteredData.map((investment) => (
              <tr key={investment.uuid}>
                <TableData>{investment.name}</TableData>
                <TablePercentData align="right">
                  {numbro(investment.value / 100).formatCurrency({
                    thousandSeparated: true,
                    mantissa: 2,
                  })}
                </TablePercentData>
                <TablePercentData>
                  {numbro(investment.value / totalValue).format({
                    output: "percent",
                    mantissa: 2,
                  })}
                </TablePercentData>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <TableData>Total</TableData>
              <TablePercentData align="right">
                {numbro(totalValue / 100).formatCurrency({
                  thousandSeparated: true,
                  mantissa: 2,
                })}
              </TablePercentData>
              <TablePercentData>100%</TablePercentData>
            </tr>
          </tfoot>
        </Table>
      )}
    </div>
  );
}

export default Content;
