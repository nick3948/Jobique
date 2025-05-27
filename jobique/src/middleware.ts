// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/jobs(.*)",
    "/contacts(.*)",
    "/goals(.*)",
    "/settings(.*)",
  ],
}