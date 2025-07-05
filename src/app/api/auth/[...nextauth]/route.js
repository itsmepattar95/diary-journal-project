import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongoDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("ไม่พบผู้ใช้ในระบบ");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        // สร้าง token ฝั่ง client
        const payload = {
          userId: user._id.toString(),
          role: user.role,
        };
        const accessToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });

        console.log("Res", user.role);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
      };
      session.accessToken = token.accessToken;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
