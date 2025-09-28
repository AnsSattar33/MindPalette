"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
    mobile?: boolean;
}

export default function SearchInput({ mobile }: Props) {
    return (
        <div className={mobile ? "w-full" : "w-48"}>
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 w-full"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            </div>
        </div>
    );
}
