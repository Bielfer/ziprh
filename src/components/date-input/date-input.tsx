import { CalendarDaysIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { format } from 'date-fns';
import { type Dispatch, type FC, type SetStateAction, useState } from 'react';
import InputLayout from '~/components/input-layout';
import Modal from '~/components/modal';
import Calendar from './calendar';

type Props = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  name?: string;
  className?: string;
  error?: string;
  hint?: string;
  label?: string;
  disabled?: boolean;
};

const DateInput: FC<Props> = ({
  date,
  setDate,
  name,
  className,
  error,
  hint,
  label,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InputLayout
        name={name}
        className={className}
        error={error}
        hint={hint}
        label={label}
      >
        <button
          type="button"
          className={clsx(
            'block w-full rounded-lg border py-2 pl-3 pr-10 text-left shadow-sm',
            disabled && 'bg-gray-200 text-gray-600',
            !error
              ? 'border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
              : 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm'
          )}
          onClick={() => setIsOpen(true)}
          disabled={disabled}
        >
          <span className="block truncate">{format(date, 'dd/MM/yyyy')}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <CalendarDaysIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </button>
      </InputLayout>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-full max-w-sm"
      >
        <Calendar
          date={date}
          setDate={setDate}
          onDateSelected={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

export default DateInput;
