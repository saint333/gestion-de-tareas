export type TypePriorityVisibled = "alta" | "media" | "baja" | ""
export enum TypePriorityRender{
  alta = "alta",
  media = "media",
  baja = "baja"
}

export interface TodoModel {
  id: number;
  title: string;
  completed: boolean;
  description: string;
  dateExpired: string;
  priority: TypePriorityVisibled;
  labels: {id: number, text: string}[];
}

export type FilterType = "all" | "active" | "completed" | "date" | "priority" | string;