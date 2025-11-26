// components/AuthGuard.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        await currentUser();
        setAuthenticated(true);
      } catch (err) {
        console.error(err);
        setAuthenticated(false);
        router.push("/login");
      } finally {
        setChecking(false);
      }
    };

    validate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <ClipLoader size={16} />
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
