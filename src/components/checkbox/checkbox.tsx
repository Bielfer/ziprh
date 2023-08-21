import type { ChangeEvent, FC } from "react";

type Props = {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
};

const CheckBox: FC<Props> = ({ checked, onChange, name }) => {
  return (
    <input
      checked={checked}
      id={name}
      name={name}
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
      onChange={onChange}
    />
  );
};

export default CheckBox;
