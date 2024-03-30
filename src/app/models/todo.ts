export type TypePriority = "high" | "medium" | "low" 

export interface TodoModel {
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean;
  description?: string;
  dateExpired?: string;
  priority?: TypePriority;
  labels?: {id: number, text: string}[];
}

export type FilterType = "all" | "active" | "completed" | "date" | "priority" | string;