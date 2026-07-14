import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.OAUTH_CLIENT_ID ?? "";
const STATE_COOKIE_NAME = "decap-cms-github-oauth-state";

export async function GET(req: NextRequest) {
  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json(
      { error: "Missing OAUTH_CLIENT_ID environment variable." },
      { status: 500 }
    );
  }

  const state = randomUUID();
  const redirectUri = new URL("/api/auth/callback", req.nextUrl.origin);
  const authorizationUrl = new URL("https://github.com/login/oauth/authorize");

  authorizationUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri.toString());
  authorizationUrl.searchParams.set("scope", "repo");
  authorizationUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set({
    name: STATE_COOKIE_NAME,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: req.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
