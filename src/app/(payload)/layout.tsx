import type { ServerFunctionClient } from "payload"

import config from "@payload-config"
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts"
import { importMap } from "@/app/(payload)/admin/importMap.js"
import "@payloadcms/next/css"
import React from "react"

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  "use server"
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) =>
  RootLayout({
    config,
    importMap,
    serverFunction,
    children,
  })

export default Layout
