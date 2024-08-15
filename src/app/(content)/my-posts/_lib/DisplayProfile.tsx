"use client";

import { profileSetupFormSchema } from "@/app/(authentication)/_lib/schema";
import { AvatarWithFallBack } from "@/components/AvatarWithFallBack";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { cn } from "@/lib/utils";
import { CameraIcon, Check, Edit, Loader2, X } from "lucide-react";
import { type ElementRef, useRef, useState, useTransition } from "react";
import { updateAvatar, updateProfileDisplayName } from "./action";

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
  const [displayError, setDisplayError] = useState<{
    displayName: string;
    images: string;
  }>({
    displayName: "",
    images: "",
  });
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  const inputRef = useRef<ElementRef<"input">>(null);
  const inputFileRef = useRef<ElementRef<"input">>(null);

  const [isImagePending, startImageTransition] = useTransition();
  const [isDisplayNamePending, startDisplayNameTransition] = useTransition();

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

  const handleUpdateImage = () => {
    startImageTransition(async () => {
      if (inputFileRef.current?.files?.[0]) {
        const file = inputFileRef.current.files[0];
        const formData = new FormData();
        formData.append("image", file);

        const { image } = await updateAvatar(formData);
        setDisplayError((prevError) => ({
          ...prevError,
          images: image ?? "",
        }));

        if (image === undefined) {
          setObjectUrls((prevUrls) => {
            for (const url of prevUrls) {
              URL.revokeObjectURL(url);
            }
            return [];
          });
        }
      }
    });
  };

  return (
    <div className="relative w-full">
      <Form>
        <fieldset className="group/avatar relative w-fit">
          <legend className="sr-only">Update Avatar</legend>

          <AvatarWithFallBack
            isRounded={false}
            avatar={objectUrls[0] ?? avatar}
            displayName={displayName}
            className={cn("size-40", { "grayscale filter": isImagePending })}
          />
          <div
            className={cn("-translate-x-1/2 -translate-y-1/12 absolute top-1/2 left-1/2 hidden ", {
              block: isImagePending,
            })}
          >
            <Loader2 className="animate-spin stroke-[3] text-primary" />
          </div>

          <label
            htmlFor="editImage"
            className={cn(
              "absolute right-0 bottom-0 z-10 size-fit cursor-pointer rounded-lg hocus-visible:opacity-100 opacity-0 group-hover/avatar:opacity-100",
              { "cursor-not-allowed": isImagePending }
            )}
          >
            <Input
              ref={inputFileRef}
              name="images"
              type="file"
              className="hidden"
              id="editImage"
              onChange={(e) => {
                handleImageChange(e.target.files);
              }}
              disabled={isImagePending}
            />
            <ErrorMessage name="images" useDefaultStyling={false}>
              {displayError.images || null}
            </ErrorMessage>

            <abbr title="Edit Profile Picture">
              <CameraIcon className="text-primary-foreground drop-shadow-sm-double " />
            </abbr>
          </label>

          {objectUrls.length === 0 ? null : (
            <div
              className={cn("-bottom-8 -translate-x-1/2 absolute left-1/2 space-x-4", {
                hidden: isImagePending,
              })}
            >
              <button
                type="button"
                className="text-green-500"
                onClick={() => {
                  handleUpdateImage();
                }}
              >
                <Check />
              </button>
              <button
                type="button"
                className="text-destructive"
                onClick={() => {
                  setObjectUrls((prevUrls) => {
                    for (const url of prevUrls) {
                      URL.revokeObjectURL(url);
                    }
                    return [];
                  });
                }}
              >
                <X />
              </button>
            </div>
          )}
        </fieldset>

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
                defaultValue={displayName}
                autoFocus
                autoComplete="off"
                disabled={isDisplayNamePending}
              />

              <ErrorMessage name="displayName" useDefaultStyling={false}>
                {displayError.displayName || null}
              </ErrorMessage>

              <div
                className={cn(
                  "-translate-x-1/2 -translate-y-1/12 absolute top-1/2 left-1/2 hidden ",
                  {
                    block: isDisplayNamePending,
                  }
                )}
              >
                <Loader2 className="animate-spin stroke-[3] text-primary" />
              </div>

              <div
                className={cn("-bottom-8 -translate-x-1/2 absolute left-1/2 space-x-4", {
                  hidden: isDisplayNamePending,
                })}
              >
                <button
                  type="button"
                  className="text-green-500"
                  onClick={() => {
                    startDisplayNameTransition(async () => {
                      if (inputRef.current !== null) {
                        const { displayName } = await updateProfileDisplayName(
                          inputRef.current.value
                        );
                        setDisplayError((prevError) => ({
                          ...prevError,
                          displayName: displayName ?? "",
                        }));
                        setShowNameEdit((prev) => !prev);
                      }
                    });
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
              {displayName}
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
