import clsx from 'clsx';
import { type ChangeEvent, type FC } from 'react';
import InputLayout from '../input-layout';
import cn from '~/helpers/cn';

interface Props {
  label?: string | null;
  password?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
  name?: string;
  type?: 'password' | 'text' | 'number';
  disabled?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  help?: string;
  leftAddOn?: string;
}

const Input: FC<Props> = ({
  label,
  placeholder,
  password,
  className,
  type,
  error,
  name,
  hint,
  disabled,
  value,
  onChange,
  help,
  leftAddOn,
}) => (
  <InputLayout
    name={name}
    className={className}
    error={error}
    hint={hint}
    label={label}
    help={help}
  >
    <div
      className={cn(
        'flex overflow-hidden rounded-lg border shadow-sm focus-within:ring-1',
        !error
          ? 'border-gray-300 shadow-sm focus-within:border-primary-500 focus-within:ring-primary-500 '
          : 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus-within:border-red-500 focus-within:outline-none focus-within:ring-red-500'
      )}
    >
      {!!leftAddOn && (
        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
          {leftAddOn}
        </span>
      )}
      <input
        onChange={onChange}
        value={value}
        className={clsx(
          'block w-full border-0 focus:ring-0 sm:text-sm',
          disabled && 'bg-gray-200'
        )}
        placeholder={placeholder}
        type={password ? 'password' : type ?? 'text'}
        id={name}
        disabled={disabled}
      />
    </div>
  </InputLayout>
);

export default Input;
