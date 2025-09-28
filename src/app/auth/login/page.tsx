"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!res?.error) {
            router.push("/admin"); // redirect after login
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h1 className="text-xl mb-4">Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 mb-2 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 mb-2 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Login
                </button>
            </form>
        </div>
    );
}
