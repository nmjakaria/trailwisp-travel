// // src/proxy.js
// import dns from "node:dns";
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// import { NextResponse } from 'next/server'
// import { headers } from 'next/headers'


// export async function proxy(request) {
//     const session = await auth.api.getSession({
//         headers: await headers()
//     })

//     if (!session) {
//         // 1. get the URL which is trying to go to by user
//         const currentUrl = request.nextUrl.pathname + request.nextUrl.search;

//         // 2. create New ULR object for singin page
//         const loginUrl = new URL('/auth/signin', request.url)

//         // 3. set current URL to redirect in searchParams
//         loginUrl.searchParams.set('redirect', currentUrl)
//         loginUrl.searchParams.set('message', 'login_required')

//         // 4. redirect user
//         return NextResponse.redirect(loginUrl)
//     }

//     return NextResponse.next()
// }

// export const config = {
//     matcher: ['/dashboard/:path*'],
// }