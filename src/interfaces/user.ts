export interface User {
  id: string;
  name: string;
  email?: string;
  subscribe?: string;
  password?: string;
  terms?: boolean;
  newsletter?: boolean;
  last_name?: string;
  nickname?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  postcode?: string;
  telephone?: string;
  fax?: string;
  title?: string;
  job_category?: string;
  birthdate?: string;
  specialty?: string;
  institution?: string;
  position?: string;
  qualifications?: string;
  professional_info?: string;
  areas_of_interest?: string;

  country_code?: string;
  thumbnail_path?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  user: User;
  is_previous_user: boolean;
}
