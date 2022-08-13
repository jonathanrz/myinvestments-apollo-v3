export interface Income {
  uuid: string;
  date: number;
  yield: number;
  value: number;
}

export interface Investment {
  uuid: string;
  name: string;
  type: string;
  holder: string;
  objective: string;
  incomes: [Income];
}
