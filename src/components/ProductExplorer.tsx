"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";
import { verifyUserAction } from "@/app/action";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<LoadState>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts(defaultQuery).then(showResult).catch(showError);
    }, []);

    function showResult(list: ProductList) {
        setProducts(list.products);
        setStatus("ready");
    }

    function showError(error: unknown) {
        setErrorMessage(
            error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
        );
        setStatus("error");
    }

    async function loadProducts(query: SearchQuery) {
        setStatus("loading");
        setErrorMessage("");
        try {
            showResult(await fetchProducts(query));
        } catch (error) {
            showError(error);
        }
    }

    async function saveProduct(draft: ProductDraft) {
        if (!isLoggedIn) {
            alert("กรุณาเข้าสู่ระบบก่อนทำการเพิ่มหรือแก้ไขสินค้า");
            return;
        }

        // 🔔 เพิ่มการยืนยันก่อนบันทึก/แก้ไข
        const actionText = editingId === null ? "เพิ่มสินค้าใหม่" : "บันทึกการแก้ไขสินค้านี้";
        const confirmAction = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการ ${actionText}?`);
        if (!confirmAction) return; // ถ้ายกเลิก ให้หยุดการทำงานทันที

        try {
            await verifyUserAction();
            if (editingId === null) {
                setProducts([...products, { ...draft, id: Date.now() }]);
            } else {
                setProducts(
                    products.map((item) =>
                        item.id === editingId ? { ...draft, id: editingId } : item
                    )
                );
            }
            setEditingId(null);
        } catch (error) {
            alert("ไม่มีสิทธิ์ในการจัดการข้อมูล (Unauthorized)");
        }
    }

    async function removeProduct(id: number) {
        if (!isLoggedIn) {
            alert("กรุณาเข้าสู่ระบบก่อนทำการลบสินค้า");
            return;
        }

        // 🔔 หาชื่อสินค้าเพื่อเอามาโชว์ในกล่องยืนยัน
        const targetProduct = products.find((p) => p.id === id);
        const confirmDelete = window.confirm(
            `คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${targetProduct?.title || "รายการนี้"}" ?`
        );
        if (!confirmDelete) return; // ถ้ายกเลิก ให้หยุดการทำงานทันที

        try {
            await verifyUserAction();
            setProducts(products.filter((item) => item.id !== id));
            if (editingId === id) setEditingId(null);
            if (selectedProduct?.id === id) setSelectedProduct(null);
        } catch (error) {
            alert("ไม่มีสิทธิ์ในการจัดการข้อมูล (Unauthorized)");
        }
    }

    const editingProduct = products.find((item) => item.id === editingId) || null;


    return (
        <main>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                    type="button"
                    onClick={() => loadProducts(defaultQuery)}
                    disabled={status === "loading"}
                >
                    {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูล"}
                </button>
            </div>

            <ProductSearchForm onSearch={loadProducts} />

            <section aria-live="polite">
                {status === "loading" && <p>กำลังโหลดข้อมูล...</p>}
                {status === "error" && <p role="alert" style={{ color: "red" }}>{errorMessage}</p>}
                {status === "ready" && products.length === 0 && (
                    <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                )}
                {status === "ready" && products.length > 0 && (
                    <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>รูปภาพ</th>
                                <th>ชื่อสินค้า</th>
                                <th>ราคา</th>
                                <th>คงเหลือ</th>
                                <th>หมวดหมู่</th>
                                <th>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ textAlign: "center" }}>
                                        {item.images && item.images.length > 0 ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.title}
                                                width={50}
                                                height={50}
                                                style={{ objectFit: "cover", borderRadius: "4px" }}
                                            />
                                        ) : (
                                            <span style={{ color: "#888", fontSize: "0.8rem" }}>ไม่มีรูปภาพ</span>
                                        )}
                                    </td>
                                    <td>{item.title}</td>
                                    <td>${item.price}</td>
                                    <td>{item.stock}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProduct(item)}
                                            style={{ marginRight: "5px" }}
                                        >
                                            ดูรายละเอียด
                                        </button>

                                        {isLoggedIn && (
                                            <>
                                                <button type="button" onClick={() => setEditingId(item.id)}>แก้ไข</button>
                                                <button type="button" onClick={() => removeProduct(item.id)} style={{ marginLeft: "5px" }}>ลบ</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {selectedProduct && (
                <div style={{
                    marginTop: "20px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    color: "#1f2937"
                }}>
                    <h2 style={{ color: "#2563eb", borderBottom: "2px solid #2563eb", paddingBottom: "10px", marginTop: 0 }}>
                        รายละเอียดสินค้า: <span style={{ color: "#111827" }}>{selectedProduct.title}</span>
                    </h2>

                    <div style={{ margin: "15px 0", lineHeight: "1.8", color: "#374151" }}>
                        <p><strong>หมวดหมู่:</strong> {selectedProduct.category}</p>
                        <p><strong>ราคา:</strong> ${selectedProduct.price}</p>
                        <p><strong>คงเหลือ:</strong> {selectedProduct.stock} ชิ้น</p>
                        <p><strong>รายละเอียด:</strong> {selectedProduct.description || "ไม่มีรายละเอียดสินค้า"}</p>
                    </div>

                    {selectedProduct.images && selectedProduct.images.length > 0 && (
                        <div style={{ display: "flex", gap: "10px", margin: "15px 0", overflowX: "auto" }}>
                            {selectedProduct.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={selectedProduct.title}
                                    width={80}
                                    height={80}
                                    style={{ objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setSelectedProduct(null)}
                        style={{
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        ปิดหน้าต่าง
                    </button>
                </div>
            )}


            {isLoggedIn ? (
                <div>
                    <ProductForm
                        key={editingId ?? "new"}
                        editing={editingProduct}
                        onSave={saveProduct}
                        onCancel={() => setEditingId(null)}
                    />
                </div>
            ) : (
                <p style={{ marginTop: "20px", color: "#a395c4" }}>
                    * สิทธิ์ในการ เพิ่ม แก้ไข หรือลบสินค้า จำเป็นต้องเข้าสู่ระบบผ่าน Google OAuth
                </p>
            )}
        </main>
    );
}