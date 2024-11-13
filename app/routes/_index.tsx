import { UserButton, useUser } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }

  return {};
};

export default function Index() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <UserButton />
      <div className="text-2xl font-bold text-white">
        Welcome back, {user?.firstName}!
      </div>
    </div>
  );
}
