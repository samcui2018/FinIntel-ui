import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentBusiness } from "../utils/businessSession";

type Props = {
  children: ReactNode;
};

export default function RequireBusiness({ children }: Props) {
  const currentBusiness = getCurrentBusiness();

  if (!currentBusiness) {
    return <Navigate to="/businesses/new" replace />;
  }

  return <>{children}</>;
}