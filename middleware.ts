// middleware.ts
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  console.log("Middleware → Host:", req.headers.get("host"));

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // **Subdomain Handling Start**

  // Extract the hostname and subdomain
  const hostname = req.headers.get("host") || "";
  const { pathname } = new URL(req.url);
  const hostnameParts = hostname.split(".");
  let subdomain = "";

  // Handle localhost for development
  if (hostname.includes("localhost")) {
    const index = hostnameParts.findIndex((part) =>
      part.includes("localhost")
    );
    subdomain = hostnameParts.slice(0, index).join(".");
  } else if (hostname.endsWith("sloty.in")) {
    // Replace 'sloty.in' with your actual domain if different
    subdomain = hostnameParts[0];
  }

  // Determine if the request is for the main domain or a subdomain
  const isSubdomain = subdomain && !["www", "localhost"].includes(subdomain);

  if (isSubdomain) {
    // Attach the subdomain to the request headers for later use
    return NextResponse.rewrite(new URL(`/${subdomain}${pathname}`, req.url));
  }

  // **Subdomain Handling End**

  // **Main Domain Logic**
  if (!isSubdomain) {
    if (isApiAuthRoute) {
      return;
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);

      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }

    return NextResponse.next();
  }

  // **Subdomain Logic**
  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // Redirect to subdomain login page
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
