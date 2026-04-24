"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { ReactNode } from "react";

interface CanProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A declarative component to wrap UI elements that require specific permissions.
 */
export function Can({ permission, children, fallback = null }: CanProps) {
  const { hasPermission, loading } = usePermissions();

  if (loading) return null;

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
