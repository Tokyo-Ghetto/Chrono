import { Input } from "~/components/ui/input";
import { Form, useSubmit, Link } from "@remix-run/react";

import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/remix";
import { User } from "lucide-react";

// Add shadcn/ui navigation menu to the header

export function Header() {
  const submit = useSubmit();

  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submit(formData, { method: "get", action: "/test" });
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
          ></Input>
        </Form>
      </nav>
      <nav className="flex items-center space-x-4">
        <a href="/compound" className="text-white">
          Calculator
        </a>
        <a href="/overview" className="text-white">
          Overview
        </a>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in" className="text-white">
            Login
          </Link>
          <Link to="/sign-up" className="text-white">
            Sign Up
          </Link>
        </SignedOut>
      </nav>
    </header>
  );
}