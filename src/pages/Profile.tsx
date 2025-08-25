import { useState } from "react"
import type { FormEvent } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { updateProfileThunk } from "../store/authSlice"

export default function Profile() {
  const { user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()

  const [form, setForm] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    phone: user?.phone || "",
    email: user?.email || "",
    password: "" // optional change
  })
  const [avatar, setAvatar] = useState<string | null>(null)

  if (!user) return null

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const updates: { [k: string]: string } = {
      name: form.name,
      surname: form.surname,
      phone: form.phone,
      email: form.email
    }
    if (form.password.trim().length > 0) updates.password = form.password
    if (avatar) updates.avatarUrl = avatar
    if (!user) return;
    await dispatch(updateProfileThunk({ userId: user.id, updates }))
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatar(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Profile</h2>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={avatar || "https://via.placeholder.com/120"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">Upload a new profile photo</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={e => set("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Surname</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.surname}
              onChange={e => set("surname", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cellphone</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={e => set("email", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Change Password (optional)
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.password}
              onChange={e => set("password", e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Password is securely hashed before saving.
            </p>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
