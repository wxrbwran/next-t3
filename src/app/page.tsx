import { SignIn, SignOut } from "./Actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export default async function Home() {
  let session;

  try {
    const [sessionRes] = await Promise.allSettled([
      getServerSession(authOptions),
    ]);

    if (sessionRes.status === "fulfilled") {
      session = sessionRes.value;
    } else {
      console.error(sessionRes);
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Crayon <span className="text-[hsl(280,100%,70%)]">BLOG</span>
          </h1>
          {session?.user ? (
            <>
              <SignOut />
            </>
          ) : (
            <SignIn />
          )}
        </div>
      </main>
    </>
  );
}
