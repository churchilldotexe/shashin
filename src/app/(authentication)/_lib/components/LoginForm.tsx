"use client";

import { GenerateFormComponents } from "@/components/ui/formAndInput";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { loginFormAction } from "../actions/login-actions";
import { loginFormSchema } from "../schema";

const { Form, Input } = GenerateFormComponents({ schema: loginFormSchema });

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "logging in..." : "Login"}
    </button>
  );
}

export default function LoginFormComponent() {
  const [_, action] = useFormState(loginFormAction, {});

  return (
    <Form className="space-y-4" action={action}>
      <div>
        <label htmlFor="username">Username:</label>
        <Input name="userName" id="username" type="text" required />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <Input name="password" id="password" type="password" required />
      </div>
      <div>
        <div>
          <Link href="/register">Sign up</Link> <span>for an account</span>
        </div>
        <LoginButton />
      </div>
    </Form>
  );
}
