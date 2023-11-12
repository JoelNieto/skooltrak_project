export type AppConfig = {
  name: string;
  supabase: {
    url: string;
    jwt: string;
    key: string;
    adminKey: string;
  };
};
