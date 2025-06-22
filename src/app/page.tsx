import { signIn } from "@/lib/auth";

export default function Home() {
  return (
    <div className="w-[100vw] full-height-fixed grid place-content-center">
      <h1 className="bg-red-400 grid place-content-center rounded-sm mb-[15px]">
        Hello Idiot!!
      </h1>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button className="cursor-pointer text-red-300">
          Sign in with Google
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("discord");
        }}
      >
        <button className="cursor-pointer text-slate-500">
          Sign in with Discord
        </button>
      </form>
    </div>
  );
}
