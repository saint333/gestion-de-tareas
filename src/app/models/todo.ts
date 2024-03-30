export type TypePriority = "high" | "medium" | "low" | ""
export type TypePriorityVisibled = "alta" | "media" | "baja" | ""
export enum TypePriorityRender{
  high = "alta",
  medium = "media",
  low = "baja"
}

export interface TodoModel {
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean;
  description?: string;
  dateExpired: string;
  priority: TypePriorityVisibled;
  labels?: {id: number, text: string}[];
}

export type FilterType = "all" | "active" | "completed" | "date" | "priority" | string;