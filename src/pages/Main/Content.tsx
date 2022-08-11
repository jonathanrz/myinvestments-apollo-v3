import { useMemo, useState } from "react";
import styled from "styled-components";
import uniq from "lodash/uniq";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import numbro from "numbro";

const Table = styled.table`
  border: 1px solid black;
  white-space: nowrap;

  td,
  th {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }
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

    return data.investments
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
      });
  }, [data, filterType]);

  const types = useMemo(
    () => data && uniq(data.investments.map((i: Investment) => i.type)).sort(),
    [data]
  );

  console.log({ types });

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
                <th>Investment</th>
                {MONTHS.map((month) => (
                  <th key={month}>{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* @ts-ignore */}
              {parsedData.map((investment) => (
                <tr key={investment.uuid}>
                  <td>{investment.name}</td>
                  {MONTHS.map((month) => (
                    <td key={month}>
                      {investment.incomes[month]
                        ? numbro(investment.incomes[month].percent).format({
                            output: "percent",
                            mantissa: 2,
                          })
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Content;
