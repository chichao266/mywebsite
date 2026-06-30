import { getUsers, updateUserRole } from "./actions";
import RoleSelect from "./role-select";

export const dynamic = "force-dynamic";
const USERS_PER_PAGE = 20;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const requestedPage = Number.parseInt(page || "1", 10);
  const userPage = await getUsers(
    Number.isFinite(requestedPage) ? requestedPage : 1,
    USERS_PER_PAGE
  );
  const { users, totalCount, totalPages } = userPage;

  function pageHref(nextPage: number) {
    return nextPage > 1 ? `/admin/customers?page=${nextPage}` : "/admin/customers";
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">客户管理</h1>

      {totalCount > 0 && (
        <p className="mb-4 text-xs text-stone-400">
          第 {userPage.page} / {totalPages} 页，共 {totalCount} 个用户
        </p>
      )}

      {users.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-400">暂无注册用户</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-100 bg-stone-50">
                <th className="px-4 py-3 font-medium">姓名</th>
                <th className="px-4 py-3 font-medium">邮箱</th>
                <th className="px-4 py-3 font-medium">角色</th>
                <th className="px-4 py-3 font-medium">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-stone-50 hover:bg-stone-50"
                >
                  <td className="px-4 py-3 text-stone-800 font-medium">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <RoleSelect
                      userId={user.id}
                      currentRole={user.role}
                      updateAction={updateUserRole}
                    />
                  </td>
                  <td className="px-4 py-3 text-stone-400">
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3" aria-label="客户分页">
          <a
            href={pageHref(Math.max(1, userPage.page - 1))}
            aria-disabled={userPage.page <= 1}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              userPage.page <= 1
                ? "pointer-events-none border-stone-200 text-stone-300"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            上一页
          </a>
          <span className="min-w-20 text-center text-xs text-stone-400">
            {userPage.page} / {totalPages}
          </span>
          <a
            href={pageHref(Math.min(totalPages, userPage.page + 1))}
            aria-disabled={userPage.page >= totalPages}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              userPage.page >= totalPages
                ? "pointer-events-none border-stone-200 text-stone-300"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            下一页
          </a>
        </nav>
      )}
    </div>
  );
}
