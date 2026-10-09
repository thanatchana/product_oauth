"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} noValidate style={{ margin: "15px 0", display: "flex", gap: "10px", alignItems: "center" }}>
      <div>
        <label htmlFor="q">คำค้น: </label>
        <input id="q" {...register("q")} placeholder="เช่น phone" />
      </div>

      <div>
        <label htmlFor="limit">จำนวนรายการ: </label>
        <input
          id="limit"
          type="number"
          required
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={!!errors.limit}
          aria-describedby="limit-error"
        />
        {errors.limit && <span id="limit-error" role="alert" style={{ color: "#ff4d6d", fontSize: "0.8em" }}>{errors.limit.message}</span>}
      </div>

      <div>
        <label htmlFor="sortBy">เรียงตาม: </label>
        <select id="sortBy" {...register("sortBy")}>
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
      </button>
    </form>
  );
}