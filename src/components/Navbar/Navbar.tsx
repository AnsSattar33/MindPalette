"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import SearchInput from "./SearchInput";
import AuthLinks from "./AuthLinks";
import AdminLinks from "./AdminLinks";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Logo */}
                <Link href="/Home" className="text-xl font-bold">
                    MindPalette
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <NavLinks />
                    <SearchInput />
                    <AuthLinks />
                    {/* <AdminLinks /> */}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="md:hidden border-t bg-background p-4 space-y-4">
                    <NavLinks mobile />
                    <SearchInput mobile />
                    <AuthLinks mobile />
                    {/* <AdminLinks mobile /> */}
                </div>
            )}
        </nav>
    );
}
