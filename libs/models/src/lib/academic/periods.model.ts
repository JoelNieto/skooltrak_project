export type Period = Readonly<{
  id: string;
  school_id: string;
  name: string;
  year: number;
  start_at: Date;
  end_at: Date;
}>;
