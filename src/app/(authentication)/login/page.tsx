"use client";

import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { loginFormAction } from "../_lib/actions/login-actions";
import AuthComponent from "../_lib/components/AuthComponent";
import { loginFormSchema } from "../_lib/schema";

const { Form, Input, ErrorMessage } = GenerateFormComponents({
  schema: loginFormSchema,
});

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="py-1 w-full rounded-md bg-primary text-primary-foreground"
      type="submit"
      disabled={pending}
    >
      {pending ? "loading..." : "Log In"}
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useFormState(loginFormAction, {});

  const searchParamsValue = useSearchParams().get("callbackUrl");
  const callbackUrl = searchParamsValue ?? "/";
  return (
    <AuthComponent>
      <Form className="space-y-4 w-full  " action={action}>
        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer w-full border p-2 rounded outline-none placeholder-transparent "
            name="userName"
            id="username"
            type="text"
            placeholder="Username"
            required
          />
          <label
            className={cn(
              "absolute text-lg leading-none px-1 backdrop-blur-sm cursor-text left-1.5  -top-2.5 transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:backdrop-blur-sm peer-focus:text-lg peer-focus:leading-none peer-focus:text-foreground ",
              "peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:backdrop-blur-none peer-placeholder-shown:text-gray-400"
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
            className="peer w-full border p-2 rounded outline-none placeholder-transparent "
            name="password"
            id="password"
            type="text"
            placeholder="Password"
            required
          />
          <label
            className={cn(
              "absolute text-lg leading-none px-1 backdrop-blur-sm cursor-text left-1.5  -top-2.5 transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:backdrop-blur-sm peer-focus:text-lg peer-focus:leading-none peer-focus:text-foreground ",
              "peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:backdrop-blur-none peer-placeholder-shown:text-gray-400"
            )}
            htmlFor="password"
          >
            Password
          </label>
          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="password">
            {state.password}
          </ErrorMessage>
        </fieldset>

        <div className=" space-y-1">
          <LoginButton />
          <div className="text-sm">
            Dont have an Account?{" "}
            <Link className="underline text-primary" href={"/login"}>
              Sign Up
            </Link>
          </div>
        </div>
        <Input name="callbackUrl" value={callbackUrl} type="hidden" />
        {/* TODO: add a function for remember 30days (radio btn)*/}
      </Form>
    </AuthComponent>
  );
}
