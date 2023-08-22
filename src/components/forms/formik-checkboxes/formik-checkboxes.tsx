import { useField } from "formik";
import type { FC } from "react";
import CheckBox from "~/components/checkbox";
import cn from "~/helpers/cn";

type Props = {
  name: string;
  options: { name: string; value: number }[];
  className?: string;
  textSide?: "right" | "bottom";
};

const FormikCheckbox: FC<Props> = ({
  name,
  options,
  className,
  textSide = "right",
}) => {
  const [{ value }, , { setValue }] = useField<number[]>(name);

  const handleChange = (optionValue: number) => {
    if (value.includes(optionValue)) {
      setValue(value.filter((item) => item !== optionValue));
      return;
    }
    setValue([...value, optionValue]);
  };

  return (
    <div className={cn("flex flex-wrap gap-x-3", className)}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={cn(
            "flex cursor-pointer items-center justify-center",
            textSide === "bottom" ? "flex-col" : "flex-row gap-x-2"
          )}
          onClick={() => handleChange(option.value)}
        >
          <CheckBox
            checked={value.includes(option.value)}
            onChange={() => {
              return;
            }}
            name={`${name}-${option.name}`}
          />
          <label className="cursor-pointer">{option.name}</label>
        </button>
      ))}
    </div>
  );
};

export default FormikCheckbox;
