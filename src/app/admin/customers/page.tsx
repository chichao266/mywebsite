import { getUsers, updateUserRole } from "./actions";
import RoleSelect from "./role-select";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">客户管理</h1>

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
    </div>
  );
}
