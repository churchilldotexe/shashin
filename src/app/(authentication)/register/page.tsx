"use client";

import { PageSection } from "@/components/PageSection";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { registerFormActions } from "../_lib/actions/register-actions";
import { registerUserFormSchema } from "../_lib/schema";
import Image from "next/image";

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

const images = ["/AZKi.png", "/furina-white.jpg", "/furina.jpeg", "/watame.png"];

export default function LoginPage() {
  const [_, action] = useFormState(registerFormActions, {});

  // TODO: clear the field when and only when it is successful
  // - doing server action redirect is good too.
  // - but if fails the input should not be deleted but instead send the error message
  return (
    <PageSection>
      <div className="rounded-lg  grid grid-cols-[1fr,auto] place-items-center">
        <div className="size-full relative flex items-center justify-center rounded-lg backdrop-blur-lg shadow-[0_8px_6px_0_rgba(0,0,0,0.1),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]  ">
          <h1 className="text-5xl p-4">Shashin</h1>
          {/* <Image */}
          {/*   src="/AZKi.png" */}
          {/*   className="absolute top-4 right-0 size-40 rounded-lg object-contain object-center" */}
          {/*   alt="landing page image" */}
          {/*   width={500} */}
          {/*   height={500} */}
          {/* /> */}
        </div>
        {/* shadow-[0_8px_6px_0_rgba(255,255,255,0.1)_inset,-10px_-10px_10px_black_inset] */}
        <Form
          className="space-y-4 p-8 rounded-xl shadow-[0_8px_6px_0_rgba(0,0,0,0.1)_inset,-6px_-4px_10px_white_inset]  dark:shadow-[0_8px_6px_0_rgba(250,250,250,0.1)_inset,-8px_-6px_12px_black_inset] "
          action={action}
        >
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
      </div>
    </PageSection>
  );
}
