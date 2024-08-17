"use client";

import { PostButton } from "@/components/ui/PostButton";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { usePageTransition } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { loginFormAction } from "../_lib/actions/actions";
import AuthComponent from "../_lib/components/AuthComponent";
import { TransitionLink } from "../_lib/components/TransitionLink";
import { loginFormSchema } from "../_lib/schema";

const { Form, Input, ErrorMessage } = GenerateFormComponents({
  schema: loginFormSchema,
});

export default function LoginPage() {
  const [state, action] = useFormState(loginFormAction, {
    callbackUrl: "",
    userName: "",
    password: "",
  });

  const searchParamsValue = useSearchParams().get("callbackUrl");

  const callbackUrl = searchParamsValue ?? "/";

  const { transitionedPush } = usePageTransition();
  if (state.message === "success") {
    transitionedPush(callbackUrl);
  }

  return (
    <AuthComponent>
      <Form className="w-full space-y-4 " action={action}>
        <fieldset className="relative ">
          <Input
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
            {state?.userName || ""}
          </ErrorMessage>
        </fieldset>

        <fieldset className="relative ">
          <Input
            className="peer w-full rounded border p-2 placeholder-transparent outline-none "
            name="password"
            id="password"
            type="password"
            placeholder="Password"
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
            {state?.password || ""}
          </ErrorMessage>
        </fieldset>

        <PostButton className="w-full">Log In</PostButton>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <fieldset className="flex gap-2">
            <Input id="rememberMe" type="checkbox" name="rememberMe" value="true" />
            <label htmlFor="rememberMe">Remember me for 30 days?</label>
          </fieldset>

          <div className="text-sm">
            Dont have an Account?{" "}
            <TransitionLink className="text-primary underline" href={"/register"}>
              Sign Up
            </TransitionLink>
          </div>
        </div>
        <Input name="callbackUrl" value={callbackUrl} type="hidden" />
      </Form>
    </AuthComponent>
  );
}
