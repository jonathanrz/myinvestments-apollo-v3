import numbro from "numbro";
import styled from "styled-components";
import omit from "lodash/omit";
import { Income } from "./models";

const Popup = styled.div`
  background-color: white;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 8px;

  position: absolute;
  left: 0;
  bottom: 0;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  margin-bottom: 22px;

  display: none;
`;

const Container = styled.div`
  position: relative;

  &:hover {
    ${Popup} {
      display: block;
    }
  }
`;

interface IncomeCellProps {
  income: Income;
}

function IncomeCell({ income }: IncomeCellProps) {
  return (
    <Container>
      {income
        ? numbro(income.percent).format({
            output: "percent",
            mantissa: 2,
          })
        : ""}
      <Popup>
        <ul>
          {Object.entries(
            omit(income, ["date", "uuid", "__typename", "percent"])
          ).map(([key, value]) => (
            <li key={key}>
              {/* @ts-ignore */}
              <b>{key}</b>: R$ {value / 100}
            </li>
          ))}
        </ul>
      </Popup>
    </Container>
  );
}

export default IncomeCell;
