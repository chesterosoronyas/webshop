import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

export default clerkMiddleware(async(auth,req)=>{
 

  
 
  const protectedRoutes=createRouteMatcher(["/","/dashboard","/dashboard/(.*)","/dashboard/(.*)/seller","/dashboard/(.*)/admin"]);
 
  if(protectedRoutes(req)){ 
   await auth.protect();  
  };
});

export const config = {
  matcher: 
    // Skip Next.js internals and all static files, unless found in search params
   ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  
};