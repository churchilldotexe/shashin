"use client";

import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { cn } from "@/lib/utils/cn";
import { Images } from "lucide-react";
import { type HTMLAttributes, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
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

function PostButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-primary px-2 py-1 text-primary-foreground"
      type="submit"
      disabled={pending}
    >
      {pending ? "loading..." : "Post"}
    </button>
  );
}

export function PostImage({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [_, action] = useFormState(postImageAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const characterLimit = 250;
  const [textAreaInput, setTextAreaInput] = useState<string>("");
  const [isDragged, setIsDragged] = useState<boolean>(false);
  const [isShared, setIsShared] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("w-full", className)} {...props}>
      <Form action={action} ref={formRef}>
        <div className="relative flex flex-col">
          <CharacterLimitIndicator
            characterLimit={characterLimit}
            textCount={textAreaInput.length}
          />
          <Textarea
            ref={textAreaRef}
            className={cn("resize-none rounded-b-md p-2 outline-none ", {
              "border border-green-500 bg-indigo-500 ": isDragged,
            })}
            rows={5}
            name="description"
            onBlur={() => {
              if (textAreaRef.current !== null) {
                textAreaRef.current.style.height = "auto";
                textAreaRef.current.rows = 0;
                textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
                console.log(textAreaRef.current.scrollHeight, "scrollheight");
              }
            }}
            onChange={(e) => {
              setTextAreaInput(e.target.value);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (fileInputRef.current === null) {
                return;
              }
              fileInputRef.current.files = e.dataTransfer.files;
              setIsDragged(false);
            }}
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
          />
        </div>
        <div className="flex items-center justify-between py-2">
          {/* TODO: after the user chose an image, mount/ display the image through image slider component. Remember that the component needs an array */}
          <div className="flex gap-2">
            <fieldset>
              <legend className="sr-only">Image Upload</legend>
              <label className="cursor-pointer" htmlFor="imageFile">
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
                  required
                />
              </label>
            </fieldset>

            <fieldset>
              <legend className="sr-only">Sharing Options</legend>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="shareToggle"
                  className="flex h-5 w-10 items-center rounded-full bg-gray-400 data-[is-check=true]:bg-green-500"
                  data-is-check={isShared}
                >
                  <input
                    type="checkbox"
                    id="shareToggle"
                    name="isShared"
                    className="peer sr-only"
                    checked={isShared}
                    onChange={() => setIsShared(!isShared)}
                  />
                  <span className="ml-[.15em] size-4 rounded-full bg-gray-400 peer-checked:mr-[.15em] peer-checked:ml-auto" />
                  <span className="sr-only">{isShared ? "Shared" : "Share"}</span>
                </label>
                <span>{isShared ? "Shared" : "Share to Public?"}</span>
              </div>
            </fieldset>
          </div>

          <PostButton />
        </div>
        {/* TODO: add new input (select) for private and public.. (may do a switch btn for public or private same with dstorage)*/}
      </Form>
    </div>
  );
}
