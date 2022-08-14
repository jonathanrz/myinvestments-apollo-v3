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

const ValueCell = styled.td`
  text-align: left;
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
        <table>
          {Object.entries(
            omit(income, ["date", "uuid", "__typename", "percent"])
          ).map(([key, value]) => (
            <tr key={key}>
              <td>
                <b>{key}</b>
              </td>
              {/* @ts-ignore */}
              <ValueCell>R$ {value / 100}</ValueCell>
            </tr>
          ))}
        </table>
      </Popup>
    </Container>
  );
}

export default IncomeCell;
