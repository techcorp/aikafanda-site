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

  const provider = req.nextUrl.searchParams.get("provider") ?? "github";
  const scope = req.nextUrl.searchParams.get("scope") ?? "repo";
  const state = randomUUID();
  const redirectUri = new URL("/api/auth/callback", req.nextUrl.origin);
  const authorizationUrl = new URL("https://github.com/login/oauth/authorize");

  authorizationUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri.toString());
  authorizationUrl.searchParams.set("scope", scope);
  authorizationUrl.searchParams.set("state", state);

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Authorizing...</title>
  </head>
  <body>
    <script>
      (function() {
        var provider = ${JSON.stringify(provider)};
        var authorizationUrl = ${JSON.stringify(authorizationUrl.toString())};
        var hasRedirected = false;

        function beginAuthorization() {
          if (hasRedirected) return;
          hasRedirected = true;
          window.location.href = authorizationUrl;
        }

        function onMessage(event) {
          if (event.origin !== window.location.origin) return;
          if (event.data === "authorizing:" + provider) {
            window.removeEventListener("message", onMessage, false);
            beginAuthorization();
          }
        }

        window.addEventListener("message", onMessage, false);

        if (window.opener) {
          window.opener.postMessage("authorizing:" + provider, window.location.origin);
        }

        setTimeout(beginAuthorization, 1000);
      })();
    </script>
  </body>
</html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });

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
