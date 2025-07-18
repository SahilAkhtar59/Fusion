import { signIn } from "@/lib/auth";

const GoogleSignInButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button className="bg-red-400 grid place-content-center rounded-sm text-white p-2 cursor-pointer">
        Sign in with Google
      </button>
    </form>
  );
};

export { GoogleSignInButton };
