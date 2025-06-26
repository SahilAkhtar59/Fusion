import { signIn } from "@/lib/common/auth";

const GoogleSignIn = () => {
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

export { GoogleSignIn };
