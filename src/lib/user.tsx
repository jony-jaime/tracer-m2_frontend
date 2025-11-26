"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";

function UserCheck({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  useEffect(() => {
    currentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

export default UserCheck;
