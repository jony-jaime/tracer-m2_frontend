export interface Task {
  id: number;
  progress: number;
  notes: string;
  images: string;
  construction_task_id: number;
  load_id: number;
  show_client?: boolean;
}

export interface ConstructionTask {
  id: number;
  code: string;
  category: string;
  task: string;
  inc_percent: string;
  inc_m2: string;
  total_without_computation: string;
  unit: string;
  construction_id: string;
}
