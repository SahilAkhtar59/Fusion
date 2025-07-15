import { DiscordSignInButton } from "@/components/auth/DiscordSignInButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  // Checking if user has already logged in.
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="w-[100vw] full-height-fixed grid place-content-center">
      <GoogleSignInButton />
      <div className="h-[10px]" />
      <DiscordSignInButton />
    </div>
  );
};

export default Page;
