import { useField } from "formik";
import { type ChangeEvent, useState } from "react";
import Input from "../../input";

interface Props {
  label?: string;
  name: string;
  hint?: string;
  format?: "default" | "currency";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const FormikNumber = ({
  name,
  label,
  hint,
  className,
  format = "default",
  placeholder,
  disabled,
}: Props) => {
  const [{ value }, { error, touched }, { setValue }] = useField(name);
  const [input, setInput] = useState(value);

  const formats = {
    default: (val: string) => Number(val.replace(",", ".")),
    currency: (val: string) => Math.floor(Number(val.replace(",", ".")) * 100),
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setInput(value);
    setValue(formats[format](value));
  };

  return (
    <Input
      value={input}
      onChange={handleChange}
      label={label}
      className={className}
      error={touched && error ? error : ""}
      hint={hint}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
    />
  );
};

export default FormikNumber;
