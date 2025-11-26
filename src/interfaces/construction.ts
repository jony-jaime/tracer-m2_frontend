import { ConstructionTask } from "./task";

export interface Construction {
  id: number;
  title: string;
  slug: string;
  thumbnail_path: string;
  tasks: ConstructionTask[];
  m2_total?: number;
  points_total?: number;
  ratio?: number;
}
