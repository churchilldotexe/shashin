"use client";

import { ImageSlider } from "@/components/ImageSlider";
import { PostButton } from "@/components/ui/PostButton";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { cn } from "@/lib/utils/cn";
import { Globe, GlobeLock, Images } from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormState } from "react-dom";
import { postImageAction } from "../Actions";
import { ACCEPTED_FILE_TYPE, formSchema } from "../formschema";

const { Form, Input, Textarea, ErrorMessage } = GenerateFormComponents({
  schema: formSchema,
});

const getPercentage = ({
  baseNumber,
  limit,
}: {
  baseNumber: number;
  limit: number;
}) => {
  return Math.floor(((limit - baseNumber) / limit) * 100);
};

function CharacterLimitIndicator({
  characterLimit,
  textCount,
}: {
  characterLimit: number;
  textCount: number;
}) {
  const basePercentage = getPercentage({
    baseNumber: textCount,
    limit: characterLimit,
  });

  return (
    <div
      style={{
        width: `${basePercentage}%`,
        transition: "width 0.5s ease-out",
      }}
      className={cn("h-1 bg-green-500", {
        "bg-destructive": basePercentage < 10,
      })}
    />
  );
}

export function PostImage({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [state, action] = useFormState(postImageAction, {
    images: "",
    description: "",
    shareToPublic: "",
    message: "failed",
  });

  const characterLimit = 250;
  const [textAreaInput, setTextAreaInput] = useState<string>("");
  const [isDragged, setIsDragged] = useState<boolean>(false);
  const [isSharedToPublic, setIsSharedToPublic] = useState<boolean>(true);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.message === "success") {
      setObjectUrls((urls) => {
        urls.forEach(URL.revokeObjectURL);
        return [];
      });
      if (textAreaRef.current !== null) {
        textAreaRef.current.rows = 5;
        textAreaRef.current.style.height = "100%";
      }
      formRef.current?.reset();
    }
  }, [state.message]);

  const handleImageChange = (fileList: FileList | null) => {
    if (fileList === null || textAreaRef.current === null) {
      return;
    }
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.rows = 0;
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;

    const files = Array.from(fileList);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setObjectUrls((prevUrls) => {
      for (const url of prevUrls) {
        URL.revokeObjectURL(url);
      }
      return newUrls;
    });
  };

  const handleDroppedImage = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (fileInputRef.current === null) {
      return;
    }
    fileInputRef.current.files = event.dataTransfer.files;
    handleImageChange(event.dataTransfer.files);
    setIsDragged(false);
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaInput(event.target.value);
    if (!textAreaRef.current) {
      return;
    }
    if (objectUrls.length > 0) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.rows = 0;
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <Form action={action} ref={formRef}>
        <div className="relative flex flex-col">
          <CharacterLimitIndicator
            characterLimit={characterLimit}
            textCount={textAreaInput.length}
          />
          <div
            className={cn({
              "bg-indigo-500 outline outline-green-500": isDragged,
            })}
            onDrop={(e) => handleDroppedImage(e)}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragged(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsDragged(false);
            }}
          >
            <fieldset className="relative">
              <legend className="sr-only">Description</legend>
              <Textarea
                ref={textAreaRef}
                className={cn("w-full resize-none rounded-b-md border p-2 outline-none ", {
                  "bg-indigo-500": isDragged,
                })}
                placeholder="Describe your image. No image yet? Try dragging and dropping one here..."
                rows={5}
                name="description"
                onChange={(e) => handleTextAreaChange(e)}
              />
              <ErrorMessage position="bottomMiddle" useDefaultStyling={false} name="description">
                {state?.description || ""}
              </ErrorMessage>
            </fieldset>

            {objectUrls.length > 0 && <ImageSlider className="m-auto size-1/2" url={objectUrls} />}
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-2">
            <fieldset>
              <legend className="sr-only">Image Upload</legend>
              <label className="relative cursor-pointer" htmlFor="imageFile">
                <Images />
                <span className="sr-only">Select Image</span>
                <Input
                  id="imageFile"
                  ref={fileInputRef}
                  className="sr-only"
                  name="images"
                  type="file"
                  multiple
                  accept={ACCEPTED_FILE_TYPE.join(",")}
                  onChange={(e) => {
                    handleImageChange(e.target.files);
                  }}
                  required
                />
                <ErrorMessage useDefaultStyling={false} name="images">
                  {state?.images || ""}
                </ErrorMessage>
              </label>
            </fieldset>

            <fieldset>
              <legend className="sr-only">Sharing Options</legend>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="shareToggle"
                  className="relative flex cursor-pointer items-center rounded-full "
                >
                  <Input
                    type="checkbox"
                    id="shareToggle"
                    name="shareToPublic"
                    className="peer sr-only"
                    checked={isSharedToPublic}
                    onChange={() => setIsSharedToPublic(!isSharedToPublic)}
                  />
                  <ErrorMessage useDefaultStyling={false} name="shareToPublic">
                    {state?.shareToPublic || ""}
                  </ErrorMessage>

                  <GlobeLock className="transition-all peer-checked:hidden " />
                  <Globe className="hidden transition-all peer-checked:block " />
                  <span className="sr-only">
                    {isSharedToPublic ? "Everyone can see" : "Only Me"}
                  </span>
                </label>
                <span>{isSharedToPublic ? "Everyone can see" : "Only Me"}</span>
              </div>
            </fieldset>
          </div>

          <PostButton>Post</PostButton>
        </div>
      </Form>
    </div>
  );
}
