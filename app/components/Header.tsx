import { Input } from "~/components/ui/input";
import { Form, useSubmit, Link } from "@remix-run/react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/remix";

export function Header() {
  const submit = useSubmit();
  const { isLoaded } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submit(formData, { method: "get", action: "/etf" });
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <nav className="flex items-center space-x-4">
        <a href="/overview" className="text-2xl font-bold">
          Chrono
        </a>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="ticker"
            placeholder="Search"
            className="dark:border-neutral-500"
          />
        </Form>
      </nav>
      <nav className="flex items-center space-x-4">
        <a href="/compound" className="text-white">
          Calculator
        </a>
        <a href="/overview" className="text-white">
          Overview
        </a>
        <a href="/portfolio" className="text-white">
          Portfolio
        </a>

        <div className="flex items-center space-x-4">
          {!isLoaded ? (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <SignedIn>
                <UserButton
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in" className="text-white">
                  Login
                </Link>
                <Link to="/sign-up" className="text-white">
                  Sign Up
                </Link>
              </SignedOut>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
