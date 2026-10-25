export const DISPLAY_MESSAGES: Record<string, string> = {
  invalid_credentials: "Email or password is incorrect.",
  email_exists: "Unable to create account with those details.",
  weak_password: "Password is too weak. Use at least 8 characters.",
  over_request_rate_limit:
    "Too many attempts. Please try again in a few minutes.",
  over_email_send_rate_limit: "Too many emails sent. Please try again later.",
  AuthSessionMissingError:
    "This reset link has expired or was already used. Please request a new one.",
};
export const DEFAULT_MESSAGE = "Something went wrong.";

export class ServiceError {}
