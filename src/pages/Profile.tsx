import { useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateProfileThunk } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export default function Profile() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    phone: user?.phone || "",
    email: user?.email || "",
    password: "", // optional change
  });
  const [avatar, setAvatar] = useState<string | null>(null);

  if (!user) return null;

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const updates: { [k: string]: string } = {
      name: form.name,
      surname: form.surname,
      phone: form.phone,
      email: form.email,
    };
    if (form.password.trim().length > 0) updates.password = form.password;
    if (avatar) updates.avatarUrl = avatar;
    if (!user) return;
    await dispatch(updateProfileThunk({ userId: user.id, updates }));
    navigate("/");
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="max-w-4xl mx-auto rounded-2xl shadow-md p-4 items-center justify-center my-8">
      <div className="relative w-28 h-28 justify-center mx-auto mb-12">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-2xl"
          />
        ) : (
          <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gray-100 border-4 border-gray-200 shadow-md">
            {/* Default user icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A8.963 8.963 0 0112 15c2.21 0 4.21.805 5.879 2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-emerald-400 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-emerald-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </label>
        <p className="text-sm text-gray-600 text-center mt-2  whitespace-nowrap">
          Upload your profile photo
        </p>
      </div>

      {/* Profile Form */}

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            className="mt-1 w-full rounded-xl px-3 py-2 border border-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Surname
          </label>
          <input
            className="mt-1 w-full rounded-xl px-3 py-2 border border-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
            value={form.surname}
            onChange={(e) => set("surname", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cellphone
          </label>
          <input
            className="mt-1 w-full rounded-xl px-3 py-2 border border-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl px-3 py-2 border border-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Change Password (optional)
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl px-3 py-2 border border-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">New password.</p>
        </div>

        <div className="md:col-span-2">
          <Button>Save Profile</Button>
        </div>
      </form>
    </div>
  );
}
