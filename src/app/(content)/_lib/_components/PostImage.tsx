"use client";

import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { cn } from "@/lib/utils/cn";
import { Images } from "lucide-react";
import { type HTMLAttributes, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ACCEPTED_FILE_TYPE, formSchema } from "../formschema";
import { postImageAction } from "../postImageAction";

const { Form, Input, Textarea, errorMessage } = GenerateFormComponents({
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

function Button() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "posting" : "post"}
    </button>
  );
}

export function PostImage({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [_, action] = useFormState(postImageAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  const characterLimit = 250;
  const [textAreaInput, setTextAreaInput] = useState<string>("");
  const [isDragged, setIsDragged] = useState<boolean>(false);
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
            className={cn("resize-none p-2 outline-none", {
              "border border-green-500 bg-indigo-500 ": isDragged,
            })}
            rows={5}
            name="description"
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
        <div className="flex items-center justify-between">
          {/* TODO: after the user chose an image, mount/ display the image through image slider component. Remember that the component needs an array */}
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
            />
          </label>
          <Button />
        </div>
        {/* TODO: add new input (select) for private and public.. (may do a switch btn for public or private same with dstorage)*/}
      </Form>
    </div>
  );
}
