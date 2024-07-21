"use client";

import { PageSection } from "@/components/PageSection";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { loginFormAction } from "../_lib/actions/login-actions";
import { loginFormSchema } from "../_lib/schema";

const { Form, Input } = GenerateFormComponents({ schema: loginFormSchema });

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "logging in..." : "Login"}
    </button>
  );
}

export default function LoginPage() {
  const [_, action] = useFormState(loginFormAction, {});

  const searchParamsValue = useSearchParams().get("callbackUrl");
  const callbackUrl = searchParamsValue ?? "/";
  return (
    <PageSection>
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
        <Input name="callbackUrl" value={callbackUrl} type="hidden" />
        {/* TODO: add a function for remember 30days (radio btn)*/}
      </Form>
    </PageSection>
  );
}
