const env = {
  API_URL: import.meta.env.VITE_API_URL,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_ENV: import.meta.env.MODE,
};

// Only this file reads from import.meta.env
export default Object.freeze(env);