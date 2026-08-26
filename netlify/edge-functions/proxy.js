export default async (request, context) => {
  const url = new URL(request.url);
  const kietUrl = "https://kiet.cybervidya.net" + url.pathname + url.search;

  // Only forward safe headers to avoid crashing the Java backend with Netlify-specific headers
  const headers = new Headers();
  headers.set("host", "kiet.cybervidya.net");
  headers.set("origin", "https://kiet.cybervidya.net");
  headers.set("referer", "https://kiet.cybervidya.net/");
  
  if (request.headers.has("content-type")) headers.set("content-type", request.headers.get("content-type"));
  if (request.headers.has("accept")) headers.set("accept", request.headers.get("accept"));
  if (request.headers.has("user-agent")) headers.set("user-agent", request.headers.get("user-agent"));
  if (request.headers.has("cookie")) headers.set("cookie", request.headers.get("cookie"));
  if (request.headers.has("authorization")) headers.set("authorization", request.headers.get("authorization"));
  if (request.headers.has("uid")) headers.set("uid", request.headers.get("uid"));

  let bodyText = undefined;
  if (request.method !== "GET" && request.method !== "HEAD" && request.body) {
    bodyText = await request.clone().text();
    headers.set("content-length", new TextEncoder().encode(bodyText).length.toString());
  }

  const proxyReq = new Request(kietUrl, {
    method: request.method,
    headers: headers,
    body: bodyText,
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
