import { Employee } from "./employee";
import { ConstructionTask } from "./task";

export interface Load {
  id: number;
  date: string;
  notes?: string;
  images?: string[]; // puede venir como JSON string
  user_id: number;
  construction_id: number;
  created_at?: string;
  updated_at?: string;
  show_client?: boolean;

  tasks?: Task[];
  employee_hours?: EmployeeHour[];

  m2_total: number;
  points_total: number;
  ratio: number;
}

export interface Task {
  id: number;
  progress?: string;
  notes?: string;
  images?: string[];
  construction_task_id: number;
  load_id: number;
  created_at?: string;
  updated_at?: string;
  show_client?: boolean;
  construction_task?: ConstructionTask;
}

export interface EmployeeHour {
  id: number;
  points?: string;
  notes?: string;
  construction_task_id: number;
  employee_id: number;
  load_id: number;
  created_at?: string;
  updated_at?: string;
  employee: Employee;
  construction_task?: ConstructionTask;
}
