import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuth = !!req.auth;

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isAuth) {
      return Response.redirect(new URL("/", nextUrl.origin));
    }

    const userRole = req.auth?.user?.role;
    if (
      nextUrl.pathname.startsWith("/admin") &&
      !nextUrl.pathname.startsWith("/admin/orders") &&
      userRole === "STAFF"
    ) {
      return Response.redirect(new URL("/", nextUrl.origin));
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
