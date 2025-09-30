"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: hook up with backend API / email service
        setTimeout(() => {
            setLoading(false);
            alert("Your message has been sent!");
        }, 1000);
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-6 py-16">
            {/* Header */}
            <section className="w-full max-w-3xl text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
                <p className="text-lg text-muted-foreground">
                    Have a question, suggestion, or just want to say hi? Fill out the form
                    below or reach us directly through our social links.
                </p>
            </section>

            {/* Contact Form */}
            <Card className="w-full max-w-2xl shadow-md">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input type="text" placeholder="Your Name" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input type="email" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <Textarea placeholder="Write your message..." rows={5} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Social Links */}
            <section className="mt-12 text-center">
                <h2 className="text-xl font-semibold mb-4">Connect with us</h2>
                <div className="flex gap-6 justify-center">
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        className="text-muted-foreground hover:text-primary"
                    >
                        Twitter
                    </a>
                    <a
                        href="https://github.com"
                        target="_blank"
                        className="text-muted-foreground hover:text-primary"
                    >
                        GitHub
                    </a>
                    <a
                        href="mailto:example@mail.com"
                        className="text-muted-foreground hover:text-primary"
                    >
                        Email
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} My Blog. All rights reserved.
            </footer>
        </main>
    );
}
