import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Find user in DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // For now we skip hashing since your User model has no password field.
        // Later: add "password" field in Prisma User model.
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: user.id, name: user.name, email: user.email };
        }

        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login", // custom login page
  },
});

export { handler as GET, handler as POST };
