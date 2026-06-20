import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/store/hooks";
import { AUTH_STATUS } from "@/constants/auth/auth.constant";
import SplashScreen from "#components/common/SplashScreen";

export default function PublicRoute() {
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);

  if (status === AUTH_STATUS.CHECKING) {
    return (
      <SplashScreen />
    );
  }

  if (user) {
    return (
      <Navigate to="/dashboard" replace/>
    );
  }

  return <Outlet />;
}