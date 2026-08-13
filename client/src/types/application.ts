export type Application = {
  id: number;
  company: string;
  role: string;
  status: string;
  application_date: string | null;
  job_link: string | null;
  notes: string | null;
  follow_up_date: string | null;
};