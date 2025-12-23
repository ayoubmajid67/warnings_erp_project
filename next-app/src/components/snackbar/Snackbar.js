import { AlertSnackBar } from '@/components/alert/AlertSnackBar';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function Snackbar() {
  const { snackbarOpen, message, severity, handleSnackbarClose } = useSnackbar();

  return (
    <AlertSnackBar
      open={snackbarOpen}
      message={message}
      severity={severity}
      onClose={handleSnackbarClose}
    />
  );
}
