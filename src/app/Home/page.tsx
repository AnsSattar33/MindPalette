"use client";

import ExpandableCardDemo from "@/components/expandable-card-demo-grid";
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard"
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function LandingPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="w-full max-w-5xl px-6 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Welcome to <span className="text-primary">My Blog</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Discover articles, tutorials, and insights on web development, design,
                    and technology. Stay updated with the latest trends and tips.
                </p>
            </section>

            {/* Card Hover Section */}
            <section className="w-full max-w-6xl px-4 py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                    Featured Highlights
                </h2>
                <HoverEffect items={[
                    { id: 1, title: "Web Development", description: "Latest trends and tutorials", link: "https://preview.themeforest.net/item/stories-personal-blog-html-template/full_screen_preview/28453702" },
                    { id: 2, title: "Design Inspiration", description: "Creative design ideas", link: "#" },
                    { id: 3, title: "Tech News", description: "Updates from the tech world", link: "#" },
                    { id: 4, title: "Programming Tips", description: "Improve your coding skills", link: "#" },
                    { id: 5, title: "Project Showcases", description: "See what others are building", link: "#" },
                    { id: 6, title: "Community Stories", description: "Experiences from developers", link: "#" },
                ]} />
            </section>

            {/* Expandable Cards Section */}
            <section className="w-full max-w-6xl px-4 py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                    Explore More
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ExpandableCardDemo />
                    <ExpandableCardDemoStandard />
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t py-6 mt-12 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} My Blog. All rights reserved.
            </footer>
        </main>
    );
}
