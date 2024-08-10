"use client";

import { PostButton } from "@/components/ui/PostButton";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { ACCEPTED_FILE_TYPE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Images } from "lucide-react";
import { useRouter } from "next/navigation";
import { type CSSProperties, useState } from "react";
import { useFormState } from "react-dom";
import { profileSetupAction } from "../_lib/actions/actions";
import AuthComponent from "../_lib/components/AuthComponent";
import { usePageTransition } from "../_lib/hooks";
import { profileSetupFormSchema } from "../_lib/schema";

const { Form, Input, ErrorMessage } = GenerateFormComponents({
  schema: profileSetupFormSchema,
});

export default function ProfileSetupPage() {
  const [state, action] = useFormState(profileSetupAction, {
    displayName: "",
    images: "",
  });
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const router = useRouter();
  const handleImageChange = (fileList: FileList | null) => {
    if (fileList === null) {
      return;
    }
    const files = Array.from(fileList);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    // ensures cleanup before changing/adding new object url
    setObjectUrls((prevUrls) => {
      for (const url of prevUrls) {
        URL.revokeObjectURL(url);
      }
      return newUrls;
    });
  };

  const { transitionedPush } = usePageTransition();
  if (state.message === "success") {
    // animatedRouterPush().then(() => router.push("/"));
    // .then(() => document.documentElement.style.setProperty("--transition", "unset"));
    transitionedPush("/");
  }

  return (
    <AuthComponent>
      <div>
        <Form
          style={{ "--transition": "unset" } as CSSProperties}
          action={action}
          className=" space-y-4 shadow-elevate-light dark:shadow-none "
        >
          <fieldset className="relative">
            <legend className="sr-only">User name</legend>
            <Input
              className="peer w-full rounded border p-2 placeholder-transparent outline-none "
              name="displayName"
              id="username"
              type="text"
              placeholder="displayName"
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
              Display Name
            </label>

            <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="displayName">
              {state?.displayName}
            </ErrorMessage>
          </fieldset>

          <div className="flex items-center justify-between">
            <fieldset className="">
              <legend className="sr-only">user avatar</legend>
              <label
                className="relative flex cursor-pointer items-center justify-center gap-2"
                htmlFor="imageFile"
              >
                <Images /> Set a display photo
                <span className="sr-only">Select Image</span>
                <Input
                  id="imageFile"
                  className="sr-only"
                  name="images"
                  type="file"
                  accept={ACCEPTED_FILE_TYPE.join(",")}
                  onChange={(e) => {
                    handleImageChange(e.target.files);
                  }}
                  required
                />
                <ErrorMessage useDefaultStyling={false} name="images">
                  {state?.images}
                </ErrorMessage>
              </label>
            </fieldset>

            <PostButton>Finish Setup</PostButton>
          </div>

          {objectUrls.length > 0 ? (
            <div className="relative aspect-video size-full shrink-0 ">
              <img
                src={objectUrls[0] as string}
                alt="profile avatar"
                className="size-full rounded-lg object-contain object-center transition-all duration-300 ease-linear "
              />
            </div>
          ) : null}
        </Form>
      </div>
    </AuthComponent>
  );
}
