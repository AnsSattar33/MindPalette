import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAuthSession() {
    return await getServerSession(authOptions);
}

export async function requireRole(session: any, roles: string[]) {
    if (!session) {
        throw new Error("Unauthorized: Please login first");
    }
    if (!roles.includes(session.user?.role)) {
        throw new Error("Forbidden: You do not have permission");
    }
}
