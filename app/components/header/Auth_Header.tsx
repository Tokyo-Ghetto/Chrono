import { Input } from "~/components/ui/input";
import { Form, useSubmit } from "@remix-run/react";

// Add shadcn/ui navigation menu to the header

export function Auth_Header() {
  const submit = useSubmit();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submit(formData, { method: "get", action: "/test" });
  };
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
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
        </div>
      </div>
      <div className="flex items-center space-x-8">
        <a href="/overview" className="text-white">
          Overview
        </a>
        <a href="/login" className="text-white">
          Login
        </a>
        <a href="/signup" className="text-white">
          Sign Up
        </a>
      </div>
    </header>
  );
}
