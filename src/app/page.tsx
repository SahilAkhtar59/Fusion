import { LogoutButton } from "@/components/auth/LogoutButton";
import { SignInButton } from "@/components/auth/SignInButton";
import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  return (
    <div className="w-[100vw] full-height-fixed grid place-content-center">
      <h1 className="bg-red-400 grid place-content-center rounded-sm text-white p-3">
        Hello, Idiot!!
      </h1>
      <div className="h-[10px]" />
      {session ? <LogoutButton /> : <SignInButton />}
    </div>
  );
};

export default Page;
