export default async (request, context) => {
  const url = new URL(request.url);
  const kietUrl = "https://kiet.cybervidya.net" + url.pathname + url.search;

  // Clone headers and remove host/origin to avoid KIET rejecting them
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");

  const proxyReq = new Request(kietUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: "manual"
  });

  try {
    const response = await fetch(proxyReq);
    
    // Create a new response to modify headers
    const newResponse = new Response(response.body, response);
    
    // Netlify/Deno standard way to get all Set-Cookie headers
    const setCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
    
    if (setCookies.length > 0) {
      newResponse.headers.delete("set-cookie");
      for (const cookie of setCookies) {
        // Remove Domain attribute so browser assigns it to Netlify domain
        newResponse.headers.append("set-cookie", cookie.replace(/Domain=[^;]+;?/gi, ""));
      }
    } else if (response.headers.has("set-cookie")) {
      const cookie = response.headers.get("set-cookie");
      newResponse.headers.set("set-cookie", cookie.replace(/Domain=[^;]+;?/gi, ""));
    }

    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Proxy Failed", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
