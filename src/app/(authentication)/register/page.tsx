"use client";

import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { registerFormActions } from "../_lib/actions/register-actions";
import AuthComponent from "../_lib/components/AuthComponent";
import { registerUserFormSchema } from "../_lib/schema";

const { Form, Input } = GenerateFormComponents({
  schema: registerUserFormSchema,
});

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="py-1 w-full rounded-md bg-primary text-primary-foreground"
      type="submit"
      disabled={pending}
    >
      {pending ? "loading..." : "Sign Up"}
    </button>
  );
}

export default function LoginPage() {
  const [_, action] = useFormState(registerFormActions, {});

  return (
    <AuthComponent>
      <Form className="flex flex-col gap-4" action={action}>
        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer border p-2 rounded outline-none placeholder-transparent "
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
        </fieldset>

        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer border p-2 rounded outline-none placeholder-transparent "
            name="displayName"
            id="displayName"
            type="text"
            placeholder="displayName"
            required
          />
          <label
            className={cn(
              "absolute text-lg leading-none px-1 backdrop-blur-sm cursor-text left-1.5  -top-2.5 transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:backdrop-blur-sm peer-focus:text-lg peer-focus:leading-none peer-focus:text-foreground ",
              "peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:backdrop-blur-none peer-placeholder-shown:text-gray-400"
            )}
            htmlFor="displayName"
          >
            Display Name
          </label>
        </fieldset>

        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer border p-2 rounded outline-none placeholder-transparent "
            name="email"
            id="email"
            type="text"
            placeholder="email"
            required
          />
          <label
            className={cn(
              "absolute text-lg leading-none px-1 backdrop-blur-sm cursor-text left-1.5  -top-2.5 transition-all ",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:backdrop-blur-sm peer-focus:text-lg peer-focus:leading-none peer-focus:text-foreground ",
              "peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:backdrop-blur-none peer-placeholder-shown:text-gray-400"
            )}
            htmlFor="email"
          >
            Email
          </label>
        </fieldset>

        <fieldset className="relative ">
          <Input
            showErrors={false}
            className="peer border p-2 rounded outline-none placeholder-transparent "
            name="password"
            id="password"
            type="text"
            placeholder="password"
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
        </fieldset>

        <div className=" space-y-1">
          <LoginButton />
          <div className="text-sm">
            Already have an account?{" "}
            <Link className="underline text-primary" href={"/login"}>
              Sign in
            </Link>
          </div>
        </div>
      </Form>
    </AuthComponent>
  );
}
