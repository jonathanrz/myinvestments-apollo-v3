import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";
import sum from "lodash/sum";
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

const DESIRED_PERCENTAGE = {
  ALSO3: 0.05,
  AMER3: 0.04,
  B3SA3: 0.07,
  BBAS3: 0.1,
  BBSE3: 0.09,
  CIEL3: 0.05,
  CYRE3: 0.06,
  GMAT3: 0.11,
  GOAU4: 0.055,
  HYPE3: 0.065,
  LREN3: 0.05,
  MGLU3: 0.13,
  QUAL3: 0.06,
  RDOR3: 0.04,
  SANB11: 0.08,
  VIVT4: 0.06,
  WEGE3: 0.04,
};

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
              <TablePercentHeader>Desired</TablePercentHeader>
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
                <TablePercentData>
                  {/* @ts-ignore */}
                  {numbro(DESIRED_PERCENTAGE[investment.name] || 0).format({
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
              <TablePercentData>
                {numbro(sum(Object.values(DESIRED_PERCENTAGE))).format({
                  output: "percent",
                  mantissa: 2,
                })}
              </TablePercentData>
            </tr>
          </tfoot>
        </Table>
      )}
    </div>
  );
}

export default Content;
