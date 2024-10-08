"use client";

import {
  type ChangeEvent,
  type Dispatch,
  type FocusEvent,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SetStateAction,
  type TextareaHTMLAttributes,
  createContext,
  forwardRef,
  useContext,
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

  type ErrorContextType = {
    error: Record<Keys, string | undefined>;
    setError: Dispatch<SetStateAction<Record<keyof z.TypeOf<T>, string | undefined>>>;
  };

  const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

  function useErrorContext() {
    const context = useContext(ErrorContext);
    if (context === undefined) {
      throw new Error("this component must be inside the Form component");
    }
    return context;
  }

  const validateInput = ({
    setError,
    name,
    files,
    value,
  }: {
    name: string;
    files?: FileList | null;
    value?: unknown;
    setError: Dispatch<SetStateAction<Record<keyof z.TypeOf<T>, string | undefined>>>;
  }) => {
    const inputSchema = schema.shape[name];
    if (inputSchema === undefined) {
      return;
    }
    const validatedFile = inputSchema.safeParse(files ?? value);
    if (validatedFile.success === false) {
      if (validatedFile.error.formErrors.formErrors[0] !== undefined) {
        setError((prev) => ({
          ...prev,
          [name]: validatedFile.error.formErrors.formErrors[0],
        }));
      }
    } else {
      setError((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const Form = forwardRef<HTMLFormElement, FormType>(function Form({ children, ...props }, ref) {
    const [error, setError] = useState<Record<Keys, string | undefined>>(
      {} as Record<Keys, string | undefined>
    );
    return (
      <ErrorContext.Provider value={{ setError, error }}>
        <form ref={ref} {...props}>
          {children}
        </form>
      </ErrorContext.Provider>
    );
  });

  type InputType = Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "required"> & {
    name: Keys;
    required?: boolean;
  };

  const Input = forwardRef<HTMLInputElement, InputType>(function Inputs(
    { onChange, onBlur, name, ...props },
    ref
  ) {
    const { error, setError } = useErrorContext();

    const onBlurValidation = (
      e: FocusEvent<HTMLInputElement, Element> | ChangeEvent<HTMLInputElement>
    ) => {
      e.preventDefault();
      const inputType = e.target.type;

      if (inputType === "file") {
        validateInput({
          setError,
          name: e.target.name,
          value: e.target.value,
          files: e.target.files,
        });
      } else if (inputType === "checkbox" || inputType === "radio") {
        if (e.target.checked) {
          validateInput({
            setError,
            name: e.target.name,
            value: e.target.value,
          });
        }
      } else {
        validateInput({
          setError,
          name: e.target.name,
          value: e.target.value,
        });
      }
    };

    return (
      <input
        ref={ref}
        onBlur={(e) => {
          onBlurValidation(e);
          if (onBlur === undefined) {
            return;
          }
          onBlur(e);
        }}
        onChange={(e) => {
          if (error[name]) {
            onBlurValidation(e);
          }
          if (onChange === undefined) {
            return;
          }
          onChange(e);
        }}
        name={name as string}
        {...props}
      />
    );
  });

  type TextareaProp = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "required"> & {
    name: Keys;
    required?: boolean;
  };

  const Textarea = forwardRef<HTMLTextAreaElement, TextareaProp>(function TextAreas(
    { onChange, name, onBlur, ...props },
    ref
  ) {
    const { setError, error } = useErrorContext();

    const onBlurValidation = (
      e: FocusEvent<HTMLTextAreaElement, Element> | ChangeEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      validateInput({
        name: e.target.name,
        value: e.target.value,
        setError,
      });
    };

    return (
      <textarea
        ref={ref}
        {...props}
        name={name as string}
        onBlur={(e) => {
          onBlurValidation(e);
          if (onBlur === undefined) {
            return;
          }
          onBlur(e);
        }}
        onChange={(e) => {
          if (error[name]) {
            onBlurValidation(e);
          }
          if (onChange === undefined) {
            return;
          }
          onChange(e);
        }}
      />
    );
  });

  type ErrorMessagePropType = {
    name: Keys;
    useDefaultStyling?: boolean;
    position?: Position;
    errorMessageVariant?: ValidationMessageVariant;
    children?: ReactNode;
  } & HTMLAttributes<HTMLDivElement>;

  const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessagePropType>(function ErrorMessage(
    {
      position = "bottomLeft",
      errorMessageVariant = "error",
      useDefaultStyling = true,
      name,
      children,
      ...props
    },
    ref
  ) {
    const { error } = useErrorContext();

    const { textAreaStyles } = popUpPosition({
      position,
      variant: errorMessageVariant,
    });

    return useDefaultStyling ? (
      <div ref={ref} {...props}>
        {error[name] ?? children}
      </div>
    ) : (
      Boolean(error[name] ?? children) && (
        <div ref={ref} style={textAreaStyles.divStyle} {...props}>
          {error[name] !== undefined ? error[name] : children}
        </div>
      )
    );
  });

  return { Form, Input, Textarea, ErrorMessage };
}
