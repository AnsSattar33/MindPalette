"use client";

import Link from "next/link";

interface Props {
    mobile?: boolean;
}

export default function NavLinks({ mobile }: Props) {
    const links = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: "Categories", href: "/categories" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <div className={mobile ? "flex flex-col gap-3" : "flex gap-6"}>
            {links.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="hover:text-primary transition-colors"
                >
                    {link.name}
                </Link>
            ))}
        </div>
    );
}
