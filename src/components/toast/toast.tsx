import { Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

import {
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useTimeoutFn } from 'react-use';
import { useToastStore } from '~/store';
import { Toast } from '~/store/toast';

const types = {
  default: 'bg-blue-50 text-blue-700',
  success: 'bg-green-50 text-green-700',
  error: 'bg-red-50 text-red-700',
  warning: 'bg-yellow-50 text-yellow-700',
};

const icons = {
  default: (
    <InformationCircleIcon
      className="h-5 w-5 text-blue-400"
      aria-hidden="true"
    />
  ),
  success: (
    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
  ),
  error: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />,
  warning: (
    <ExclamationTriangleIcon
      className="h-5 w-5 text-yellow-400"
      aria-hidden="true"
    />
  ),
};

const Toast = ({ content, duration = 3000, id, type = 'default' }: Toast) => {
  const [show, setShow] = useState(!!content);
  const { removeToast } = useToastStore();

  useTimeoutFn(() => {
    setShow(false);
    setTimeout(() => {
      removeToast(id!);
    }, 500);
  }, duration);

  return (
    <Transition
      as={Fragment}
      appear
      show={show}
      enter="transition ease-in-out duration-300 transform"
      enterFrom="-translate-x-6 translate-y-6 opacity-0"
      enterTo="translate-x-0"
      leave="transition ease-in-out duration-300 transform"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-6 -translate-y-6 opacity-0"
    >
      <div className={clsx('rounded-md p-4', types[type])}>
        <div className="flex">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm">{content}</p>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Toast;
