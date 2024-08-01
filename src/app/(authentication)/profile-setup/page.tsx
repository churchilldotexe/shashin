"use client";

import { ACCEPTED_FILE_TYPE } from "@/app/(content)/_lib/formschema";
import { ImageSlider } from "@/components/ImageSlider";
import { PageSection } from "@/components/PageSection";
import { PostButton } from "@/components/ui/PostButton";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { cn } from "@/lib/utils/cn";
import { Images } from "lucide-react";
import { useState } from "react";
import { useFormState } from "react-dom";
import { profileSetupAction } from "../_lib/actions/actions";
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

  const handleImageChange = (fileList: FileList | null) => {
    if (fileList === null) {
      return;
    }

    const files = Array.from(fileList);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    // const newUrls =  URL.createObjectURL(file)
    setObjectUrls((prevUrls) => {
      for (const url of prevUrls) {
        URL.revokeObjectURL(url);
      }
      return newUrls;
    });
  };

  return (
    <PageSection>
      <div className="shadow-elevate-dark shadow-elevate-light">
        <Form action={action}>
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
              {state?.displayName || ""}
            </ErrorMessage>
          </fieldset>
          <fieldset>
            <legend className="sr-only">user avatar</legend>
            <legend className="sr-only">Image Upload</legend>
            <label className="relative cursor-pointer" htmlFor="imageFile">
              <Images />
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

          {objectUrls.length > 0 && <ImageSlider className="m-auto size-1/2" url={objectUrls} />}
          <PostButton>Finish Setup</PostButton>
        </Form>
      </div>
    </PageSection>
  );
}
