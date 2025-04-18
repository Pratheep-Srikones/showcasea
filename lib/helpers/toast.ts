import { toast } from "react-hot-toast";

const baseStyle = {
  borderRadius: "12px",
  border: "1px solid var(--toast-border-color)",
  padding: "14px 18px",
  color: "var(--toast-text-color)",
  backgroundColor: "var(--toast-bg-color)",
  fontSize: "14px",
  fontWeight: 500,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(6px)",
};

const baseIconTheme = {
  primary: "var(--toast-icon-primary-color)",
  secondary: "var(--toast-icon-secondary-color)",
};

export const toastSuccess = (message: string) => {
  toast.success(message, {
    style: baseStyle,
    iconTheme: baseIconTheme,
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    style: baseStyle,
    iconTheme: {
      ...baseIconTheme,
      primary: "var(--toast-error-icon-bg)", // override only for error
    },
  });
};
