"use client";

import React, { useEffect, useCallback } from "react";
import analytics from "@/lib/analytics";

interface ClientAnalyticsWrapperProps {
  userId: string | undefined;
  children: React.ReactNode;
}

const ClientAnalyticsWrapper: React.FC<ClientAnalyticsWrapperProps> = ({ userId, children }) => {
  return <>{children}</>;
};

export default ClientAnalyticsWrapper;
