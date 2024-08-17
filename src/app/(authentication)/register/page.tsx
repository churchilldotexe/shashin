"use client";

import { PostButton } from "@/components/ui/PostButton";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { usePageTransition } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { type CSSProperties, useReducer, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { registerFormActions } from "../_lib/actions/actions";
import AuthComponent from "../_lib/components/AuthComponent";
import { TransitionLink } from "../_lib/components/TransitionLink";
import { registerUserFormSchema } from "../_lib/schema";

const { Form, Input, ErrorMessage } = GenerateFormComponents({
  schema: registerUserFormSchema,
});

type PasswordVisibilityAction = { type: "TOGGLE_VERIFIED_PASSWORD" } | { type: "TOGGLE_PASSWORD" };
type PasswordVisibilityState = {
  showPassword: boolean;
  showVerifiedPassword: boolean;
};

const initialState: PasswordVisibilityState = {
  showPassword: false,
  showVerifiedPassword: false,
};

const passwordVisibilityReducer = (
  state: PasswordVisibilityState,
  action: PasswordVisibilityAction
): PasswordVisibilityState => {
  switch (action.type) {
    case "TOGGLE_VERIFIED_PASSWORD":
      return { ...state, showVerifiedPassword: !state.showVerifiedPassword };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
};

export default function RegisterPage() {
  const [state, action] = useFormState(registerFormActions, {
    email: "",
    password: "",
    userName: "",
    verifiedPassword: "",
  });
  const [isMatched, setIsMatched] = useState<boolean>(true);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [reducerState, dispatch] = useReducer(passwordVisibilityReducer, initialState);

  const { transitionedPush } = usePageTransition();
  if (state.message === "success") {
    transitionedPush("/profile-setup");
  }

  return (
    <AuthComponent>
      <Form
        style={{ "--transition": "unset" } as CSSProperties}
        className="flex flex-col gap-y-6"
        action={action}
      >
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
            {state?.userName}
          </ErrorMessage>
        </fieldset>

        <fieldset className="relative ">
          <Input
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
            {state?.email}
          </ErrorMessage>
        </fieldset>

        <fieldset className="relative ">
          <Input
            ref={passwordInputRef}
            className="peer w-full rounded border p-2 placeholder-transparent outline-none "
            name="password"
            id="password"
            type={reducerState.showPassword ? "text" : "password"}
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

          <button
            type="button"
            className="-translate-y-1/2 absolute top-1/2 right-2 peer-placeholder-shown:hidden"
            onClick={() => {
              dispatch({ type: "TOGGLE_PASSWORD" });
            }}
          >
            {reducerState.showPassword ? <Eye /> : <EyeOff />}
          </button>

          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="password">
            {state?.password}
          </ErrorMessage>
        </fieldset>

        <fieldset className="relative ">
          <Input
            className="peer w-full rounded border p-2 placeholder-transparent outline-none "
            name="verifiedPassword"
            id="verifiedPassword"
            type={reducerState.showVerifiedPassword ? "text" : "password"}
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
            htmlFor="verifiedPassword"
          >
            Verify Password
          </label>

          <button
            type="button"
            className="-translate-y-1/2 absolute top-1/2 right-2 peer-placeholder-shown:hidden"
            onClick={() => {
              dispatch({ type: "TOGGLE_VERIFIED_PASSWORD" });
            }}
          >
            {reducerState.showVerifiedPassword ? <Eye /> : <EyeOff />}
          </button>

          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="password">
            {isMatched ? null : "Passwords didn't match. Please reverify."}
            {state?.verifiedPassword}
          </ErrorMessage>
        </fieldset>

        <div className=" space-y-1">
          <PostButton className="w-full">Sign Up</PostButton>
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
