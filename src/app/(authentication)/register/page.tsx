"use client";

import { PageSection } from "@/components/PageSection";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { registerFormActions } from "../_lib/actions/register-actions";
import { registerUserFormSchema } from "../_lib/schema";

const { Form, Input } = GenerateFormComponents({
  schema: registerUserFormSchema,
});

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "loading..." : "Login"}
    </button>
  );
}

export default function LoginPage() {
  const [_, action] = useFormState(registerFormActions, {});

  // TODO: clear the field when and only when it is successful
  // - doing server action redirect is good too.
  // - but if fails the input should not be deleted but instead send the error message
  return (
    <PageSection>
      <Form className="space-y-4" action={action}>
        <fieldset>
          <label htmlFor="username">Username:</label>
          <Input name="userName" id="username" type="text" required />
        </fieldset>

        <fieldset>
          <label htmlFor="displayName">Display Name:</label>
          <Input name="displayName" id="displayName" type="text" required />
        </fieldset>

        <fieldset>
          <label htmlFor="email">Email:</label>
          <Input name="email" id="email" type="email" required />
        </fieldset>

        <fieldset>
          <label htmlFor="password">Password:</label>
          <Input name="password" id="password" type="password" required />
        </fieldset>
        <div>
          {/* NOTE: feature- forgot password */}
          <div>
            already have an account? <Link href={"/login"}>Sign in</Link>
          </div>
          <LoginButton />
        </div>
      </Form>
    </PageSection>
  );
}
