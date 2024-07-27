"use client";

import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { TransitionLink } from "@/components/utils/TransitionLink";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { registerFormActions } from "../_lib/actions/register-actions";
import AuthComponent from "../_lib/components/AuthComponent";
import { registerUserFormSchema } from "../_lib/schema";

const { Form, Input, ErrorMessage } = GenerateFormComponents({
  schema: registerUserFormSchema,
});

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-md bg-primary py-1 text-primary-foreground"
      type="submit"
      disabled={pending}
    >
      {pending ? "loading..." : "Sign Up"}
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useFormState(registerFormActions, {});
  console.log(state);
  const [isMatched, setIsMatched] = useState<boolean>(true);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  return (
    <AuthComponent>
      <Form className="flex flex-col gap-y-6" action={action}>
        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer w-full rounded border p-2 placeholder-transparent outline-none "
            name="userName"
            id="username"
            type="text"
            placeholder="Username"
            required
          />
          <label
            className={cn(
              "-top-2.5 absolute left-1.5 cursor-text px-1 text-lg leading-none backdrop-blur-sm transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:text-foreground peer-focus:text-lg peer-focus:leading-none peer-focus:backdrop-blur-sm ",
              "peer-placeholder-shown:top-2 peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:backdrop-blur-none"
            )}
            htmlFor="username"
          >
            Username
          </label>
          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="userName">
            {state.userName}
          </ErrorMessage>
        </fieldset>

        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer w-full rounded border p-2 placeholder-transparent outline-none "
            name="displayName"
            id="displayName"
            type="text"
            placeholder="displayName"
            required
          />
          <label
            className={cn(
              " -top-2.5 absolute left-1.5 cursor-text px-1 text-lg leading-none backdrop-blur-sm transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:text-foreground peer-focus:text-lg peer-focus:leading-none peer-focus:backdrop-blur-sm ",
              "peer-placeholder-shown:top-2 peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:backdrop-blur-none"
            )}
            htmlFor="displayName"
          >
            Display Name
          </label>
          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="displayName">
            {state.displayName}
          </ErrorMessage>
        </fieldset>

        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer w-full rounded border p-2 placeholder-transparent outline-none "
            name="email"
            id="email"
            type="text"
            placeholder="email"
            required
          />
          <label
            className={cn(
              "-top-2.5 absolute left-1.5 cursor-text px-1 text-lg leading-none backdrop-blur-sm transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:text-foreground peer-focus:text-lg peer-focus:leading-none peer-focus:backdrop-blur-sm ",
              "peer-placeholder-shown:top-2 peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:backdrop-blur-none"
            )}
            htmlFor="email"
          >
            Email
          </label>
          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="email">
            {state.email}
          </ErrorMessage>
        </fieldset>

        <fieldset className="relative ">
          <Input
            ref={passwordInputRef}
            showErrors={false}
            className="peer w-full rounded border p-2 placeholder-transparent outline-none "
            name="password"
            id="password"
            type="password"
            placeholder="password"
            required
          />
          <label
            className={cn(
              "-top-2.5 absolute left-1.5 cursor-text px-1 text-lg leading-none backdrop-blur-sm transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:text-foreground peer-focus:text-lg peer-focus:leading-none peer-focus:backdrop-blur-sm ",
              "peer-placeholder-shown:top-2 peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:backdrop-blur-none"
            )}
            htmlFor="password"
          >
            Password
          </label>
          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="password">
            {state.password}
          </ErrorMessage>
        </fieldset>

        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer w-full rounded border p-2 placeholder-transparent outline-none "
            name="verifiedPassword"
            id="verifiedPassword"
            type="password"
            placeholder="Verify password"
            required
            onBlur={(e) => {
              if (passwordInputRef.current === null) {
                return;
              }
              if (passwordInputRef.current.value !== e.target.value) {
                setIsMatched(false);
              } else {
                setIsMatched(true);
              }
            }}
          />
          <label
            className={cn(
              "-top-2.5 absolute left-1.5 cursor-text px-1 text-lg leading-none backdrop-blur-sm transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:text-foreground peer-focus:text-lg peer-focus:leading-none peer-focus:backdrop-blur-sm ",
              "peer-placeholder-shown:top-2 peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:backdrop-blur-none"
            )}
            htmlFor="password"
          >
            Verify Password
          </label>
          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="password">
            {isMatched ? null : "Passwords didn't match. Please reverify."}
            {state.verifiedPassword}
          </ErrorMessage>
        </fieldset>

        <div className=" space-y-1">
          <LoginButton />
          <div className="text-sm">
            Already have an account?{" "}
            <TransitionLink className="text-primary underline " href={"/login"}>
              Sign in
            </TransitionLink>
          </div>
        </div>
      </Form>
    </AuthComponent>
  );
}
