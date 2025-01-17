import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "./mongodb-client"

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add role to session if needed
      session.user.role = user.role || "user";
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

export const getAuthSession = () => getServerSession(authOptions)