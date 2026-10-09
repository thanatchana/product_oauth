import { auth } from "@/auth";
import ProductExplorer from "@/components/ProductExplorer";
import { AuthButtons } from "@/components/auth-buttons";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: "15px", marginBottom: "20px" }}>
        <h1>สินค้า</h1>
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </header>

      <ProductExplorer isLoggedIn={isLoggedIn} />
    </div>
  );
}