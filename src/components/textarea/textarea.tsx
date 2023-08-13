import clsx from 'clsx';
import type { Dispatch, FC, SetStateAction } from 'react';
import InputLayout from '~/components/input-layout';

interface Props {
  name: string;
  hint?: string;
  label?: string | null;
  className?: string;
  placeholder?: string;
  error?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
  rows?: number;
}

const Textarea: FC<Props> = ({
  name,
  className,
  hint,
  label,
  placeholder,
  error,
  value,
  setValue,
  disabled,
  rows,
}) => (
  <InputLayout
    name={name}
    className={className}
    error={error}
    hint={hint}
    label={label}
  >
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={clsx(
        'block w-full rounded-lg border shadow-sm',
        disabled && 'bg-gray-200',
        !error
          ? 'border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
          : 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm'
      )}
      id={name}
      disabled={disabled}
      rows={rows}
    />
  </InputLayout>
);

export default Textarea;
