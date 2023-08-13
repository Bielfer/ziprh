import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { type ReactNode } from 'react';

interface Props {
  label?: string | null;
  error?: string;
  hint?: string;
  className?: string;
  name?: string;
  children: ReactNode;
  help?: string;
}

const InputLayout = ({
  label,
  hint,
  error,
  className,
  name,
  children,
  help,
}: Props) => (
  <div className={className}>
    {label && (
      <div className="mb-1 flex justify-between">
        <label htmlFor={name}>{label}</label>
        {hint && (
          <span className="text-sm text-gray-500" id="email-optional">
            {hint}
          </span>
        )}
      </div>
    )}
    <div className="relative">
      {children}

      {!!error && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
    {!!error && (
      <p className="mt-2 text-sm text-red-600" id="error">
        {error}
      </p>
    )}
    {!!help && (
      <p className="mt-2 text-sm text-gray-500" id="email-description">
        {help}
      </p>
    )}
  </div>
);

export default InputLayout;
