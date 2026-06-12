import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

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
          stock: product.stock,
          featured: product.featured,
          images: product.images,
        }}
      />
    </div>
  );
}
