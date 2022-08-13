import styled from "styled-components";

export const Table = styled.table`
  white-space: nowrap;
  border-collapse: collapse;
  margin-top: 20px;

  tr:nth-child(even) {
    background-color: #f8f6ff;
  }
`;

export const TableHeader = styled.th`
  position: sticky;
  top: 0;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);

  font-size: 18px;
  color: #fff;
  line-height: 1.4;
  background-color: #6c7ae0;

  padding: 4px 8px;
`;

export const TableData = styled.td`
  font-size: 15px;
  color: #808080;
  line-height: 1.4;

  padding: 4px 8px;
`;
