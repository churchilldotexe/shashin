import {
  type CSSProperties,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
  useRef,
} from "react";

const srOnlyStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
} as CSSProperties;

export function DragAndDrop({
  addClickSelect,
  multiple,
  children,
  name,
  ...props
}: {
  name?: string;
  addClickSelect?: boolean;
  multiple?: boolean;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  let id = "";
  if (addClickSelect) {
    id = "dragDropInput";
  } else {
    id = "";
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // handleChange(e.dataTransfer.files);
    if (fileInputRef.current === null) {
      return;
    }
    fileInputRef.current.files = e.dataTransfer.files;
  };

  return (
    <label htmlFor={id}>
      <div
        onDrop={(e) => {
          handleDrop(e);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
        }}
        {...props}
      >
        {children}
        <input
          type="file"
          ref={fileInputRef}
          name={name}
          style={srOnlyStyle}
          id={id}
          multiple={multiple}
        />
      </div>
    </label>
  );
}
