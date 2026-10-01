import { NextResponse, type NextRequest } from "next/server";

// Pages render in two modes. At the top level a request gets the desktop
// shell, which opens the requested page inside a browser window. Inside that
// window (an iframe) the same route renders as a bare page. The iframe asks
// for `?embed=1`; Sec-Fetch-Dest covers reloads and plain links inside it.
export function proxy(request: NextRequest) {
  const embed =
    request.nextUrl.searchParams.get("embed") === "1" ||
    request.headers.get("sec-fetch-dest") === "iframe";

  const headers = new Headers(request.headers);
  headers.delete("x-os-embed");
  if (embed) headers.set("x-os-embed", "1");

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
