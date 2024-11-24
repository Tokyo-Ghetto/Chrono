import { Input } from "~/components/ui/input";
import { Form, useSubmit, Link } from "@remix-run/react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/remix";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const submit = useSubmit();
  const { isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submit(formData, { method: "get", action: "/etf" });
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <a href="/overview" className="text-2xl font-bold">
            Chrono
          </a>
          <Form onSubmit={handleSubmit} className="hidden sm:block">
            <Input
              type="text"
              name="ticker"
              placeholder="Search"
              className="dark:border-neutral-500"
            />
          </Form>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <a href="/compound" className="text-white hover:text-gray-300">
            Calculator
          </a>
          <a href="/overview" className="text-white hover:text-gray-300">
            Overview
          </a>
          <a href="/portfolio" className="text-white hover:text-gray-300">
            Portfolio
          </a>

          {!isLoaded ? (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: "flex items-center",
                      userButtonTrigger: "focus:shadow-none",
                      userButtonPopoverCard: "z-50",
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in" className="text-white hover:text-gray-300">
                  Login
                </Link>
                <Link to="/sign-up" className="text-white hover:text-gray-300">
                  Sign Up
                </Link>
              </SignedOut>
            </>
          )}
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-700">
          <Form onSubmit={handleSubmit} className="p-4">
            <Input
              type="text"
              name="ticker"
              placeholder="Search"
              className="dark:border-neutral-500 w-full"
            />
          </Form>
          <nav className="flex flex-col space-y-4 p-4">
            <a href="/compound" className="text-white hover:text-gray-300">
              Calculator
            </a>
            <a href="/overview" className="text-white hover:text-gray-300">
              Overview
            </a>
            <a href="/portfolio" className="text-white hover:text-gray-300">
              Portfolio
            </a>
            {isLoaded && (
              <>
                <SignedIn>
                  <div className="py-2">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonBox: "flex items-center",
                          userButtonTrigger: "focus:shadow-none",
                          userButtonPopoverCard: "z-50",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
                <SignedOut>
                  <Link
                    to="/sign-in"
                    className="text-white hover:text-gray-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="text-white hover:text-gray-300"
                  >
                    Sign Up
                  </Link>
                </SignedOut>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
