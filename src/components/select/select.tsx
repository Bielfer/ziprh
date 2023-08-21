import InputLayout from "~/components/input-layout";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { type FC, Fragment } from "react";

interface Props {
  selected: string;
  setSelected: (value: string) => void;
  options: Array<{ text: string; value: string | number }>;
  className?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

const Select: FC<Props> = ({
  selected,
  setSelected,
  options,
  className,
  placeholder,
  label,
  name,
  hint,
  error,
  disabled,
}) => (
  <InputLayout
    name={name}
    className={className}
    error={error}
    hint={hint}
    label={label}
  >
    <Listbox value={selected} onChange={setSelected} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          className={clsx(
            "relative w-full cursor-pointer rounded-lg border py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm",
            disabled && "bg-gray-200",
            !error
              ? "border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
          )}
        >
          <span className="block truncate">
            {options.find((item) => item.value === selected)?.text ??
              placeholder ??
              "Selecione"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((item) => (
              <Listbox.Option
                key={`${item.value} ${item.text}`}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-6 pr-4 sm:pl-10 ${
                    active ? "bg-primary-100 text-primary-900" : "text-gray-900"
                  }`
                }
                value={item.value}
              >
                {({ selected: isSelected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        isSelected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {item.text}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 hidden items-center pl-3 text-primary-600 sm:flex">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  </InputLayout>
);

export default Select;
