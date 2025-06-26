import { Logout } from "@/components/ui/auth/Logout";

const Page = () => {
  return (
    <div className="w-[100vw] full-height-fixed grid place-content-center">
      <h1 className="bg-red-400 grid place-content-center rounded-sm text-white p-2">
        Hello, Idiot!!
      </h1>
      < Logout />
    </div>
  );
};

export default Page;
