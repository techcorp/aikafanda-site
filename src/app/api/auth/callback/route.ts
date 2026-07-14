import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.OAUTH_CLIENT_ID ?? "";
const GITHUB_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET ?? "";
const STATE_COOKIE_NAME = "decap-cms-github-oauth-state";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get(STATE_COOKIE_NAME)?.value;
  const siteOrigin = req.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(new URL("/admin", siteOrigin));
  }

  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/admin", siteOrigin));
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    console.error("GitHub OAuth error:", tokenData.error_description);
    return NextResponse.redirect(new URL("/admin", siteOrigin));
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: "github" });
  const escapedPayload = payload.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  const html = `
<!DOCTYPE html>
<html>
  <head><title>Authorizing…</title></head>
  <body>
    <script>
      (function() {
        function sendMsg(msg) {
          var opener = window.opener;
          if (opener) {
            opener.postMessage(msg, window.location.origin);
            window.close();
          }
        }
        sendMsg("authorization:github:success:${escapedPayload}");
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
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: req.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 0,
  });

  return response;
}
