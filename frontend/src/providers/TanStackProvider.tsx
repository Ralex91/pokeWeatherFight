"use client"

import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import React, { useState } from "react"

const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          placeholderData: keepPreviousData,
          retry: false,
        },
      },
    }),
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default TanstackProvider
