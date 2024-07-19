import {
  type ChangeEvent,
  type Dispatch,
  type FocusEvent,
  type FormHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SetStateAction,
  type TextareaHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import type { ZodRawShape, z } from "zod";
import {
  type Position,
  type ValidationMessageVariant,
  popUpPosition,
} from "./generateFormComponentsStyles";

type FormComponentType<T extends z.ZodObject<ZodRawShape>> = {
  schema: T;
};

type FormType = {
  children: ReactNode;
} & FormHTMLAttributes<HTMLFormElement>;

export function GenerateFormComponents<T extends z.ZodObject<ZodRawShape>>({
  schema,
}: FormComponentType<T>) {
  type SchemaTypes = z.infer<T>;
  type Keys = keyof SchemaTypes;

  const errorMessage: Record<Keys, string | undefined> = {} as Record<Keys, string | undefined>;

  const validateInput = ({
    name,
    files,
    value,
    setError,
    schemaName,
  }: {
    name: string;
    files?: FileList | null;
    value?: unknown;
    setError: Dispatch<SetStateAction<string | undefined>>;
    schemaName: keyof z.TypeOf<T>;
  }) => {
    const inputSchema = schema.shape[name];
    if (inputSchema === undefined) {
      return;
    }
    const validatedFile = inputSchema.safeParse(files ?? value);
    if (validatedFile.success === false) {
      setError(validatedFile.error.formErrors.formErrors[0]);
      if (validatedFile.error.formErrors.formErrors[0] !== undefined) {
        errorMessage[schemaName] = validatedFile.error.formErrors.formErrors[0];
      }
    } else {
      setError(undefined);
      errorMessage[schemaName] = undefined;
    }
  };

  const Form = forwardRef<HTMLFormElement, FormType>(function Form({ children, ...props }, ref) {
    return (
      <form ref={ref} {...props}>
        {children}
      </form>
    );
  });

  type InputType = {
    position?: Position;
    errorMessageVariant?: ValidationMessageVariant;
  } & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "required"> & {
      name: Keys;
      required?: boolean;
    };

  const Input = forwardRef<HTMLInputElement, InputType>(function Inputs(
    { errorMessageVariant = "error", position = "bottomMiddle", onChange, name, ...props },
    ref
  ) {
    const [error, setError] = useState<string | undefined>(undefined);

    const { inputStyles } = popUpPosition({
      position,
      variant: errorMessageVariant,
    });
    const onBlurValidation = (
      e: FocusEvent<HTMLInputElement, Element> | ChangeEvent<HTMLInputElement>
    ) => {
      e.preventDefault();
      const inputType = e.target.type;

      if (inputType === "file") {
        validateInput({
          schemaName: name,
          name: e.target.name,
          value: e.target.value,
          setError,
          files: e.target.files,
        });
      } else if (inputType === "checkbox" || inputType === "radio") {
        if (e.target.checked) {
          validateInput({
            schemaName: name,
            name: e.target.name,
            value: e.target.value,
            setError,
          });
        }
      } else {
        validateInput({
          schemaName: name,
          name: e.target.name,
          value: e.target.value,
          setError,
        });
      }
    };

    return (
      <div style={{ position: "relative", display: "grid" }}>
        <input
          ref={ref}
          onBlur={(e) => {
            onBlurValidation(e);
          }}
          onChange={(e) => {
            if (onChange !== undefined) {
              onChange(e);
            }
            if (error) {
              onBlurValidation(e);
            } else {
              return;
            }
          }}
          name={name as string}
          {...props}
          style={{ width: "100%" }}
        />

        {Boolean(error) && (
          <div style={inputStyles.divStyle}>
            <span style={inputStyles.spanStyle} />
            {error}
          </div>
        )}
      </div>
    );
  });

  type TextareaProp = {
    position?: Position;
    errorMessageVariant?: ValidationMessageVariant;
  } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "required"> & {
      name: Keys;
      required?: boolean;
    };

  const Textarea = forwardRef<HTMLTextAreaElement, TextareaProp>(function TextAreas(
    { errorMessageVariant = "error", position = "bottomMiddle", onChange, name, ...props },
    ref
  ) {
    const [error, setError] = useState<string | undefined>(undefined);

    const onBlurValidation = (
      e: FocusEvent<HTMLTextAreaElement, Element> | ChangeEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      validateInput({
        schemaName: name,
        name: e.target.name,
        value: e.target.value,
        setError,
      });
    };

    const { textAreaStyles } = popUpPosition({
      position,
      variant: errorMessageVariant,
    });

    return (
      <div style={{ position: "relative", display: "grid" }}>
        <textarea
          ref={ref}
          {...props}
          name={name as string}
          onBlur={(e) => {
            onBlurValidation(e);
          }}
          style={{ width: "100%" }}
          onChange={(e) => {
            if (onChange !== undefined) {
              onChange(e);
            }
            if (error) {
              onBlurValidation(e);
            } else {
              return;
            }
          }}
        />

        {Boolean(error) && (
          <div style={textAreaStyles.divStyle}>
            <span style={textAreaStyles.spanStyle} />
            {error}
          </div>
        )}
      </div>
    );
  });

  return { Form, Input, Textarea, errorMessage };
}
