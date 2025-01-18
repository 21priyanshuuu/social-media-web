import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongodb-client";
import { Session, User } from "next-auth";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        const userRole = user?.role || "user"; 
        
        if (userRole === "admin") {
          session.user.role = "admin";
        } else {
          session.user.role = "user";
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export const getAuthSession = () => getServerSession(authOptions);
