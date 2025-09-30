"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-6 py-16">
            <section className="w-full max-w-3xl text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
                <p className="text-lg text-muted-foreground">
                    Welcome to <span className="font-semibold">My Blog</span> — a place
                    where ideas, tutorials, and stories come to life. Our mission is to
                    make web development, design, and technology more accessible to
                    everyone, whether you’re a beginner or a professional.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                <Card className="shadow-md">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
                        <p className="text-muted-foreground">
                            We aim to empower developers and readers with high-quality content
                            that is easy to understand and practical to apply.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
                        <p className="text-muted-foreground">
                            A small team of passionate writers, developers, and designers who
                            love sharing knowledge and helping others grow.
                        </p>
                    </CardContent>
                </Card>
            </section>

            <footer className="mt-16 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} My Blog. All rights reserved.
            </footer>
        </main>
    );
}
