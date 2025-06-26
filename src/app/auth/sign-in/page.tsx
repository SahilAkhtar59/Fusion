import { DiscordSignIn } from "@/components/ui/auth/DiscordSignIn";
import { GoogleSignIn } from "@/components/ui/auth/GoogleSignIn";
import { auth } from "@/lib/common/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  // Checking if user has already logged in.
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="w-[100vw] full-height-fixed grid place-content-center">
      <GoogleSignIn />
      <div className="h-[10px]" />
      <DiscordSignIn />
    </div>
  );
};

export default Page;
