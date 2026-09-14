import useAuth from "../hooks/useAuth";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function PasswordChangeGuard({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <>
      {children}

      <ChangePasswordModal open={user?.mustChangePassword === true} />
    </>
  );
}
