"use client";

import { ImageSlider } from "@/components/ImageSlider";
import { PostButton } from "@/components/ui/PostButton";
import { GenerateFormComponents } from "@/components/ui/formAndInput";
import { ACCEPTED_FILE_TYPE } from "@/lib/constants";
import { cn, createTooltipClasses } from "@/lib/utils";
import { Check, Globe, GlobeLock, ImagePlus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type ChangeEvent,
  type DragEvent,
  type ElementRef,
  type HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormState } from "react-dom";
import { postImageAction } from "../Actions";
import { formSchema } from "../formschema";
import { CharacterLimitIndicator } from "./CharacterLimitIndicator";

const { Form, Input, Textarea, ErrorMessage } = GenerateFormComponents({
  schema: formSchema,
});

const CHARACTERLIMIT = 250;

function TextAreaIndicator({
  textAreaCharactersLeft,
}: {
  textAreaCharactersLeft: number;
}) {
  return (
    <>
      <p className="absolute right-1 bottom-1 hidden select-none text-gray-500 text-sm peer-placeholder-shown/textarea:block">
        You can also drag and drop image in this area
      </p>
      <p
        className={cn(
          "absolute right-1 bottom-1 block text-amber-500 peer-placeholder-shown/textarea:hidden",
          { "text-destructive": textAreaCharactersLeft < 10 }
        )}
      >
        {textAreaCharactersLeft < 25 ? textAreaCharactersLeft : null}
      </p>
    </>
  );
}

function ShareIconIndicator() {
  return (
    <>
      <div
        className={cn(
          "peer-checked:hidden",
          createTooltipClasses("hover:after:content-['Only_Me']")
        )}
      >
        <GlobeLock />
        <span className="sr-only">Only Me</span>
      </div>
      <div
        className={cn(
          " hidden peer-checked:block",
          createTooltipClasses("hover:after:content-['Share_to_Public']")
        )}
      >
        <Globe />
        <span className="sr-only">Share to Public</span>
      </div>
    </>
  );
}

type ConfirmationButtonType = {
  albums: {
    name: string[];
  } | null;
  handleAddAlbum: () => void;
  handleBackToSelect: () => void;
};

function ConfirmationButton({
  handleBackToSelect,
  albums,
  handleAddAlbum,
}: ConfirmationButtonType) {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          handleAddAlbum();
        }}
        className="visible hocus-visible:scale-110 text-green-500 active:scale-95 peer-placeholder-shown:invisible"
      >
        <Check />
        <span className="sr-only">add album</span>
      </button>

      {albums?.name.length === 0 ? null : (
        <button
          type="button"
          className="visible hocus-visible:scale-110 text-destructive active:scale-95 peer-placeholder-shown:invisible"
          onClick={() => {
            handleBackToSelect();
          }}
        >
          <span className="sr-only">go Back</span>
          <X />
        </button>
      )}
    </>
  );
}

export function PostImage({
  albums,
  className,
  ...props
}: { albums: { name: string[] } | null } & HTMLAttributes<HTMLDivElement>) {
  const [state, action] = useFormState(postImageAction, {
    images: "",
    description: "",
    shareToPublic: "",
    message: "failed",
  });

  const [textAreaInput, setTextAreaInput] = useState<string>("");
  const [isDragged, setIsDragged] = useState<boolean>(false);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(() => {
    if (albums?.name.length) {
      return true;
    }
    return false;
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumParams = searchParams.get("a");

  const formRef = useRef<ElementRef<"form">>(null);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const fileInputRef = useRef<ElementRef<"input">>(null);
  const albumInputRef = useRef<ElementRef<"input">>(null);

  const textAreaCharactersLeft = CHARACTERLIMIT - textAreaInput.length;

  useEffect(() => {
    if (state?.message === "success") {
      setObjectUrls((urls) => {
        urls.forEach(URL.revokeObjectURL);
        return [];
      });

      if (textAreaRef.current !== null) {
        textAreaRef.current.rows = 5;
        textAreaRef.current.style.height = "100%";
      }

      formRef.current?.reset();

      router.replace("/", { scroll: false });
    }
  }, [state?.message, router]);

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

  const handleBackToSelect = () => {
    if (albumInputRef.current === null) {
      return;
    }
    albumInputRef.current.value = "";

    router.push("/", { scroll: false });

    setIsSelectOpen((prev) => !prev);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <Form action={action} ref={formRef}>
        <div className="relative flex flex-col">
          <CharacterLimitIndicator
            characterLimit={CHARACTERLIMIT}
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
                className={cn(
                  "peer/textarea w-full resize-none rounded-b-md border bg-white p-2 outline-none dark:bg-black ",
                  {
                    "bg-indigo-500": isDragged,
                  }
                )}
                placeholder="Describe your image."
                rows={5}
                name="description"
                onChange={(e) => handleTextAreaChange(e)}
              />

              <TextAreaIndicator textAreaCharactersLeft={textAreaCharactersLeft} />

              <ErrorMessage position="bottomMiddle" useDefaultStyling={false} name="description">
                {state?.description}
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
                <div className={cn(createTooltipClasses("hover:after:content-['Upload_Image']"))}>
                  <ImagePlus />
                </div>

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
                  {state?.images}
                </ErrorMessage>
              </label>
            </fieldset>

            <fieldset>
              <legend className="sr-only">Sharing Options</legend>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="shareToggle"
                  className={cn("relative flex cursor-pointer items-center rounded-full ")}
                >
                  <Input
                    type="checkbox"
                    id="shareToggle"
                    name="shareToPublic"
                    className="peer sr-only"
                    defaultChecked
                  />
                  <ShareIconIndicator />
                  <ErrorMessage useDefaultStyling={false} name="shareToPublic">
                    {state?.shareToPublic}
                  </ErrorMessage>
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="sr-only">Assign Album</legend>
              {isSelectOpen ? (
                <select
                  onChange={(e) => {
                    if (e.target.value === "add_Album") {
                      router.push(`/?a=${albumInputRef.current?.value}`, {
                        scroll: false,
                      });
                      setIsSelectOpen((prev) => !prev);
                    }
                  }}
                  name="albumName"
                  className=" bg-background"
                  defaultValue={albumParams || ""}
                  required
                >
                  <option value="">Select an Album</option>

                  {albums?.name.map((album) => (
                    <option key={album} value={album}>
                      {album}
                    </option>
                  ))}

                  {albumParams === null ? null : <option value={albumParams}>{albumParams}</option>}

                  <option value="add_Album" className=" font-bold text-green-500">
                    Add Album
                  </option>
                </select>
              ) : (
                <div className=" flex items-center">
                  <Input
                    ref={albumInputRef}
                    name="albumName"
                    type="text"
                    placeholder="Add an Album"
                    required
                    className="peer rounded-sm border hocus-visible:border-foreground bg-white active:border-foreground dark:bg-black"
                    autoFocus
                  />

                  <ConfirmationButton
                    handleBackToSelect={handleBackToSelect}
                    albums={albums}
                    handleAddAlbum={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("a", albumInputRef.current?.value ?? "");
                      window.history.pushState(null, "", `?${params.toString()}`);
                      setIsSelectOpen((prev) => !prev);
                    }}
                  />
                </div>
              )}
            </fieldset>
          </div>

          <div className="flex items-center gap-2">
            <PostButton>Post</PostButton>
          </div>
        </div>
      </Form>
    </div>
  );
}
