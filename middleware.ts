import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Protect admin routes
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin"
      }
      return !!token
    },
  },
})

export const config = {
  matcher: ["/admin/:path*", "/submit"],
}
