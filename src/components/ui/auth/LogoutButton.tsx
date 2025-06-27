"use client";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <button
      className="h-[32px] bg-blue-400 grid place-content-center rounded-sm text-white p-2 cursor-pointer"
      onClick={handleSignOut}
    >
      Logout
    </button>
  );
};

export { LogoutButton };
