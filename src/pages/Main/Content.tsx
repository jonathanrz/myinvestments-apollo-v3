import { useMemo, useState } from "react";
import styled from "styled-components";
import uniq from "lodash/uniq";
import sortBy from "lodash/sortBy";
import sum from "lodash/sum";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import numbro from "numbro";

const Table = styled.table`
  white-space: nowrap;
  border-collapse: collapse;
  margin-top: 20px;

  tr:nth-child(even) {
    background-color: #f8f6ff;
  }
`;

const TableHeader = styled.th`
  position: sticky;
  top: 0;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);

  font-size: 18px;
  color: #fff;
  line-height: 1.4;
  background-color: #6c7ae0;

  padding: 4px 8px;
`;

const TableData = styled.td`
  font-size: 15px;
  color: #808080;
  line-height: 1.4;

  padding: 4px 8px;
`;

interface Income {
  uuid: string;
  date: number;
  yield: number;
  value: number;
}

interface Investment {
  uuid: string;
  name: string;
  type: string;
  holder: string;
  objective: string;
  incomes: [Income];
}

const MONTHS = generateMonths();

function generateMonths() {
  const date = moment();

  return new Array(60).fill(0).map((_) => {
    const formattedDate = date.format("MM/YY");
    date.subtract(1, "months");
    return formattedDate;
  });
}

const GET_ALL_INVESTMENTS = gql`
  {
    investments {
      uuid
      name
      type
      holder
      objective
      incomes {
        uuid
        date
        yield
        value
      }
    }
  }
`;

function Content() {
  const { loading, error, data } = useQuery(GET_ALL_INVESTMENTS);
  const [filterType, setFilterType] = useState();

  const parsedData = useMemo(() => {
    if (!data) return;

    return sortBy(
      data.investments
        .filter((investment: Investment) => {
          if (!filterType) return true;

          return filterType === investment.type;
        })
        .map((investment: Investment) => {
          const output = { ...investment, incomes: {} };
          investment.incomes.forEach((income: Income) => {
            if (income.value > 0) {
              // @ts-ignore
              output.incomes[moment(income.date * 1000).format("MM/YY")] = {
                ...income,
                percent: income.yield / (income.value - income.yield),
              };
            }
          });
          return output;
        }),
      "name"
    );
  }, [data, filterType]);

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
  }, [parsedData, filterType]);

  const types = useMemo(
    () => data && uniq(data.investments.map((i: Investment) => i.type)).sort(),
    [data]
  );

  return (
    <div>
      {loading && "Loading..."}
      {error && error.message}
      {parsedData && (
        <div>
          <Select
            options={types.map((type: string) => ({
              label: type,
              value: type,
            }))}
            // @ts-ignore
            onChange={(opt) => setFilterType(opt.value)}
          />
          <Table>
            <thead>
              <tr>
                <TableHeader>Investment</TableHeader>
                {MONTHS.map((month) => (
                  <TableHeader key={month}>{month}</TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* @ts-ignore */}
              {parsedData.map((investment) => (
                <tr key={investment.uuid}>
                  <TableData>{investment.name}</TableData>
                  {MONTHS.map((month) => (
                    <TableData key={month}>
                      {investment.incomes[month]
                        ? numbro(investment.incomes[month].percent).format({
                            output: "percent",
                            mantissa: 2,
                          })
                        : ""}
                    </TableData>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {average.map((data, index) => (
                  <TableData key={`${data}-${index}`}>{data}</TableData>
                ))}
              </tr>
            </tfoot>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Content;
