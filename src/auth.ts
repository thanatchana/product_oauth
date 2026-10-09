import NextAuth from "next-auth"; 
import Google from "next-auth/providers/google"; 
 
export const { handlers, auth, signIn, signOut } = NextAuth({ 
  trustHost: true, 
  // เติม: provider ของ Google ที่ import มาด้านบน 
  providers: [Google], 
  callbacks: { 
    authorized({ auth, request }) { 
      const pathname = request.nextUrl.pathname; 
      const isProductManagementPage = 
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname); 
      if (isProductManagementPage) { 
        return Boolean(auth?.user); // ต้องเข้าสู่ระบบก่อนจึงเข้าหน้านี้ได้
      } 
      return true; 
    }, 
  }, 
}); 