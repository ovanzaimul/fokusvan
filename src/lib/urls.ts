const baseURL = (
  import.meta.env.VITE_APP_URL ?? window.location.origin
).replace(/\/$/, "");

export const urls = {
  home: `${baseURL}/`,
  resetPassword: `${baseURL}/reset-password`,
};
