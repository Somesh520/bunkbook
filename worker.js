const API_ORIGIN = "https://kiet.cybervidya.net";

function upstreamUrl(request) {
  const requestUrl = new URL(request.url);
  return `${API_ORIGIN}${requestUrl.pathname}${requestUrl.search}`;
}

function proxyHeaders(request) {
  const headers = new Headers(request.headers);
  headers.set("host", "kiet.cybervidya.net");
  headers.set("origin", API_ORIGIN);
  headers.set("referer", `${API_ORIGIN}/`);
  headers.delete("cf-connecting-ip");
  headers.delete("cf-ipcountry");
  headers.delete("cf-ray");
  headers.delete("cf-visitor");
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
      const response = await fetch(upstreamUrl(request), {
        method: request.method,
        headers: proxyHeaders(request),
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: "manual",
        credentials: "include"
      });

      return rewriteCookies(response);
    }

    return env.ASSETS.fetch(request);
  }
};
