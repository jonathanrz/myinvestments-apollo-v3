export interface Income {
  uuid: string;
  date: number;
  yield: number;
  value: number;
  percent: number;
  bought: number;
  sold: number;
  gross: number;
  ir: number;
  fee: number;
  received: number;
}

export interface Investment {
  uuid: string;
  name: string;
  type: string;
  holder: string;
  objective: string;
  incomes: [Income];
}
