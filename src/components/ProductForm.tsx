"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? { title: editing.title, price: editing.price, stock: editing.stock, category: editing.category, description: editing.description }
      : { title: "", price: undefined, stock: undefined },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(saveProduct)} noValidate style={{ border: "1px solid #382759", padding: "15px", borderRadius: "5px", marginTop: "20px" }}>
      <h3>{editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h3>

      <div>
        <label htmlFor="title">ชื่อสินค้า: </label>
        <input id="title" required {...register("title")} />
        {errors.title && <span role="alert" style={{ color: "#ff4d6d", display: "block" }}>{errors.title.message}</span>}
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="price">ราคา: </label>
        <input id="price" type="number" step="0.01" required {...register("price", { valueAsNumber: true })} />
        {errors.price && <span role="alert" style={{ color: "#ff4d6d", display: "block" }}>{errors.price.message}</span>}
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="stock">จำนวนคงเหลือ: </label>
        <input id="stock" type="number" required {...register("stock", { valueAsNumber: true })} />
        {errors.stock && <span role="alert" style={{ color: "#ff4d6d", display: "block" }}>{errors.stock.message}</span>}
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="category">หมวดหมู่: </label>
        <select id="category" required {...register("category")}>
          <option value="">-- กรุณาเลือกหมวดหมู่ --</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {errors.category && <span role="alert" style={{ color: "#ff4d6d", display: "block" }}>{errors.category.message}</span>}
      </div>

      <div style={{ marginTop: "15px" }}>
        <button type="submit">
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>ยกเลิก</button>
        )}
      </div>
    </form>
  );
}