import { Navigate } from "react-router-dom";
import { getCurrentBusiness } from "../utils/businessSession";
import type React from "react";

type Props = {
  children: React.ReactNode;
};

export default function RequireNoBusiness({ children }: Props) {
  const currentBusiness = getCurrentBusiness();

  if (currentBusiness) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}