const API_ORIGIN = "https://kiet.cybervidya.net";

function upstreamUrl(request) {
  const requestUrl = new URL(request.url);
  return `${API_ORIGIN}${requestUrl.pathname}${requestUrl.search}`;
}

function proxyHeaders(request) {
  const headers = new Headers();
  headers.set("host", "kiet.cybervidya.net");
  headers.set("origin", API_ORIGIN);
  headers.set("referer", `${API_ORIGIN}/`);

  for (const headerName of ["content-type", "accept", "user-agent", "cookie", "authorization", "uid"]) {
    const value = request.headers.get(headerName);
    if (value) headers.set(headerName, value);
  }

  return headers;
}

function rewriteCookies(response) {
  const rewritten = new Response(response.body, response);
  const cookies = response.headers.getSetCookie?.() ?? [];
  const normalizeCookie = (cookie) => cookie
    .replace(/Domain=[^;]+;?/gi, "")
    .replace(/Path=[^;]+/i, "Path=/");

  if (cookies.length > 0) {
    rewritten.headers.delete("set-cookie");
    for (const cookie of cookies) {
      rewritten.headers.append("set-cookie", normalizeCookie(cookie));
    }
  }

  return rewritten;
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname.startsWith("/api/")) {
      let bodyText;
      const hasBody = request.method !== "GET" && request.method !== "HEAD" && request.body;

      if (hasBody) {
        bodyText = await request.clone().text();
      }

      const headers = proxyHeaders(request);
      if (bodyText !== undefined) {
        headers.set("content-length", new TextEncoder().encode(bodyText).length.toString());
      }

      const response = await fetch(upstreamUrl(request), {
        method: request.method,
        headers,
        body: bodyText,
        redirect: "manual"
      });

      return rewriteCookies(response);
    }

    return env.ASSETS.fetch(request);
  }
};
