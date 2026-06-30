import Link from "next/link";
import { getProductPage } from "@/lib/product-data";
import DeleteButton from "./delete-button";

export const dynamic = "force-dynamic";
const PRODUCTS_PER_PAGE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const requestedPage = Number.parseInt(page || "1", 10);
  const productPage = await getProductPage(
    {},
    {
      page: Number.isFinite(requestedPage) ? requestedPage : 1,
      pageSize: PRODUCTS_PER_PAGE,
    }
  );
  const { products, totalCount, totalPages } = productPage;

  function pageHref(nextPage: number) {
    return nextPage > 1 ? `/admin/products?page=${nextPage}` : "/admin/products";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-stone-800">商品管理</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + 新增商品
        </Link>
      </div>

      {totalCount > 0 && (
        <p className="mb-4 text-xs text-stone-400">
          第 {productPage.page} / {totalPages} 页，共 {totalCount} 个商品
        </p>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-400">还没有商品，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-100 bg-stone-50">
                <th className="px-4 py-3 font-medium">商品名称</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">价格</th>
                <th className="px-4 py-3 font-medium">库存</th>
                <th className="px-4 py-3 font-medium">推荐</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50">
                  <td className="px-4 py-3 text-stone-800 font-medium">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{p.category}</td>
                  <td className="px-4 py-3 text-stone-700">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.featured ? (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        是
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">否</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-emerald-600 hover:text-emerald-800 text-xs"
                    >
                      编辑
                    </Link>
                    <DeleteButton id={p.id} name={p.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3" aria-label="商品分页">
          <Link
            href={pageHref(Math.max(1, productPage.page - 1))}
            aria-disabled={productPage.page <= 1}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              productPage.page <= 1
                ? "pointer-events-none border-stone-200 text-stone-300"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            上一页
          </Link>
          <span className="min-w-20 text-center text-xs text-stone-400">
            {productPage.page} / {totalPages}
          </span>
          <Link
            href={pageHref(Math.min(totalPages, productPage.page + 1))}
            aria-disabled={productPage.page >= totalPages}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              productPage.page >= totalPages
                ? "pointer-events-none border-stone-200 text-stone-300"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            下一页
          </Link>
        </nav>
      )}
    </div>
  );
}
