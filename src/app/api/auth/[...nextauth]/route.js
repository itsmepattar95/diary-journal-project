import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return null; // แก้จาก 'nulll'
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };

        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      }
    })
  ],

  // 🔐 กำหนดว่าใช้ JWT สำหรับ session
  session: {
    strategy: "jwt",
  },

  // 🔑 ใส่ secret สำหรับความปลอดภัย
  secret: process.env.NEXTAUTH_SECRET,

  // 🔄 เพิ่ม callback เพื่อใส่ user.id ใน session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },

  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
