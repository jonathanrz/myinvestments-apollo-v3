import { useMemo, useState } from "react";
import uniq from "lodash/uniq";
import sortBy from "lodash/sortBy";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import numbro from "numbro";
import { Investment, Income } from "./models";
import Footer from "./Footer";
import { Table, TableHeader, TableData } from "./styles";

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
            <Footer
              parsedData={parsedData}
              MONTHS={MONTHS}
              filterType={filterType}
            />
          </Table>
        </div>
      )}
    </div>
  );
}

export default Content;
