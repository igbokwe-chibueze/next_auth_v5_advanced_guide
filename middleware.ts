import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import{ DEFAULT_LOGIN_REDIRECT_URL, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // req.auth is available on the request after NextAuth processes i
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // If it's an API auth route, let it pass through
  if (isApiAuthRoute) {
    return;
  }

  // If it's an auth route and the user is logged in, redirect them to the default page
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_URL, nextUrl));
    }
    return; // no redirect needed if not logged in
  }

  // For protected routes: if not logged in and not public, redirect to the login page
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    
    
    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`, 
      nextUrl
    ));
  }

  // Otherwise, proceed without any special response
  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // ensures that the middleware runs on the homepage (root route).
    '/',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
