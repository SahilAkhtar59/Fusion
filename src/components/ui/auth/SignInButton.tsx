import Link from "next/link";

const SignInButton = () => {
  return (
    <Link
      href="/auth/sign-in"
      className="h-[32px] bg-green-400 grid place-content-center rounded-sm text-white p-2 cursor-pointer"
    >
      Sign-in
    </Link>
  );
};

export { SignInButton };
