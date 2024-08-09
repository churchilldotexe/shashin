"use client";

import { profileSetupFormSchema } from "@/app/(authentication)/_lib/schema";
import { AvatarWithFallBack } from "@/components/AvatarWithFallBack";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { cn } from "@/lib/utils";
import { updateDisplayName } from "@/server/use-cases/user-use-cases";
import { CameraIcon, Check, Edit, X } from "lucide-react";
import { type ElementRef, useRef, useState } from "react";
import { updateProfileDisplayName } from "./action";

const { Form, Input, ErrorMessage } = GenerateFormComponents({
  schema: profileSetupFormSchema,
});

export default function DisplayProfile({
  displayName,
  avatar,
}: {
  displayName: string;
  avatar: string | null;
}) {
  const [showNameEdit, setShowNameEdit] = useState<boolean>(false);
  const [currentDisplayName, setCurrentDisplayName] = useState<string>(displayName);
  const [displayError, setDisplayError] = useState<{
    displayName: string;
    images: string;
  }>({
    displayName: "",
    images: "",
  });
  const inputRef = useRef<ElementRef<"input">>(null);
  // FIX: DO THE UPDATE AVATAR NEXT
  return (
    <div className="relative w-full">
      <Form>
        <div className="group/avatar relative w-fit">
          <AvatarWithFallBack
            avatar={avatar}
            displayName={displayName}
            className="size-40 rounded "
          />
          <label
            htmlFor="editImage"
            className="absolute right-0 bottom-0 z-10 size-fit cursor-pointer rounded-lg hocus-visible:opacity-100 opacity-0 backdrop-blur group-hover/avatar:opacity-100"
          >
            <input type="file" className="hidden" id="editImage" />
            <abbr title="Edit Profile Picture">
              <CameraIcon className="" />
            </abbr>
          </label>
        </div>
        <div className="-translate-x-1/2 absolute bottom-5 left-1/2 w-fit text-5xl capitalize ">
          {showNameEdit ? (
            <fieldset className="relative w-fit">
              <legend className="sr-only">Change Profile Name</legend>
              <Input
                name="displayName"
                ref={inputRef}
                id="profileName"
                type="text"
                className={cn("w-[20ch] bg-transparent text-center capitalize outline-none")}
                defaultValue={currentDisplayName}
                // biome-ignore lint/a11y/noAutofocus: <this is a toggle focus>
                autoFocus
              />
              <ErrorMessage name="displayName" useDefaultStyling={false}>
                {displayError.displayName || null}
              </ErrorMessage>

              <div className="-bottom-8 -translate-x-1/2 absolute left-1/2 space-x-4">
                <button
                  type="button"
                  className="text-green-500"
                  onClick={async () => {
                    if (inputRef.current !== null) {
                      setCurrentDisplayName(inputRef.current.value);
                      setShowNameEdit((prev) => !prev);
                      const { displayName } = await updateProfileDisplayName(
                        inputRef.current.value
                      );
                      setDisplayError((prevError) => ({
                        ...prevError,
                        displayName: displayName as string,
                      }));
                    }
                  }}
                >
                  <Check />
                </button>
                <button
                  type="button"
                  className="text-destructive"
                  onClick={() => {
                    setShowNameEdit((prev) => !prev);
                  }}
                >
                  <X />
                </button>
              </div>
            </fieldset>
          ) : (
            <div className="group/display relative">
              {currentDisplayName}
              <abbr title="Edit Name">
                <button
                  type="button"
                  className="-right-4 absolute bottom-0 z-10 rounded-lg leading-none opacity-0 backdrop-blur group-hover/display:opacity-100"
                  onClick={() => {
                    setShowNameEdit((prev) => !prev);
                  }}
                >
                  <Edit className="size-4" />
                </button>
              </abbr>
            </div>
          )}
        </div>
        {/* <input type="text" className="bg-transparent" /> */}
        <div
          className={cn(
            "-mt-3 w-full rounded-lg p-4 shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]",
            "css-border-animateInline"
          )}
        />
      </Form>
    </div>
  );
}
