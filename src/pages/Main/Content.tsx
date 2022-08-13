import { useMemo, useState } from "react";
import styled from "styled-components";
import uniq from "lodash/uniq";
import sortBy from "lodash/sortBy";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import numbro from "numbro";
import { Investment, Income } from "./models";
import Footer from "./Footer";
import Chart from "./Chart";
import { Table, TableHeader, TableData } from "./styles";

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 20px;
`;

const TIME_OPTIONS = [
  {
    label: "6 months",
    value: 6,
  },
  {
    label: "1 year",
    value: 12,
  },
  {
    label: "2 year",
    value: 24,
  },
  {
    label: "3 year",
    value: 36,
  },
  {
    label: "5 year",
    value: 60,
  },
];

function generateMonths(monthCount: number) {
  const date = moment();

  return new Array(monthCount).fill(0).map((_) => {
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
  const [timeSelected, setTimeSelected] = useState(TIME_OPTIONS[0]);

  const months = useMemo(
    () => generateMonths(timeSelected.value),
    [timeSelected]
  );

  const parsedData = useMemo(() => {
    if (!data) return;

    return sortBy(
      data.investments
        .filter((investment: Investment) => {
          if (!filterType) return true;

          return filterType === investment.type;
        })
        .map((investment: Investment) => {
          const output = {
            ...investment,
            incomes: {},
            name: `${investment.name} (${investment.holder})`,
          };
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
        })
        .filter((investment: Investment) =>
          // @ts-ignore
          months.map((month) => investment.incomes[month]).some((a) => a)
        ),
      "name"
    );
  }, [data, filterType, months]);

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
          <FilterContainer>
            <Select
              options={TIME_OPTIONS}
              // @ts-ignore
              onChange={setTimeSelected}
              value={timeSelected}
            />
            <Select
              options={types.map((type: string) => ({
                label: type,
                value: type,
              }))}
              // @ts-ignore
              onChange={(opt) => setFilterType(opt.value)}
            />
          </FilterContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Investment</TableHeader>
                {months.map((month) => (
                  <TableHeader key={month}>{month}</TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* @ts-ignore */}
              {parsedData.map((investment) => (
                <tr key={investment.uuid}>
                  <TableData>{investment.name}</TableData>
                  {months.map((month) => (
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
              MONTHS={months}
              filterType={filterType}
            />
          </Table>
          {filterType && <Chart parsedData={parsedData} MONTHS={months} />}
        </div>
      )}
    </div>
  );
}

export default Content;
