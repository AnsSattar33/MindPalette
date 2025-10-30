"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    console.log('useSession = ', useSession());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!res?.error) {
            router.push("/dashboard/overview");
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-6 space-y-4">
                    <h1 className="text-2xl font-bold text-center">Welcome To  MindPalette</h1>

                    <div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 border border-black bg-white text-black hover:bg-gray-50"
                            onClick={() => signIn("google", { callbackUrl: "/admin" })}
                        >
                            <Globe className="h-5 w-5" />
                            Continue with Google
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>

                    <div>
                        <h3>Don't have an account? <a href="/auth/register" className="text-blue-500">Sign up</a></h3>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
