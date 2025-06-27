import { signIn } from "@/lib/common/auth";

const DiscordSignInButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("discord");
      }}
    >
      <button className="bg-slate-400 grid place-content-center rounded-sm text-white p-2 cursor-pointer">
        Sign in with Discord
      </button>
    </form>
  );
};

export { DiscordSignInButton };
