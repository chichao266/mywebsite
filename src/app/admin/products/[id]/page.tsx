import { getProductById } from "@/lib/product-data";
import { notFound } from "next/navigation";
import ProductForm from "../product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">编辑商品</h1>
      <ProductForm
        productId={product.id}
        initialData={{
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stoneType: product.stoneType || "",
          metal: product.metal || "",
          caratWeight: product.caratWeight || "",
          cut: product.cut || "",
          color: product.color || "",
          clarity: product.clarity || "",
          certification: product.certification || "",
          dimensions: product.dimensions || "",
          care: product.care || "",
          stock: product.stock,
          featured: product.featured,
          images: product.images,
        }}
      />
    </div>
  );
}
