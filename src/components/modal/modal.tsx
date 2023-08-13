import { type FC, Fragment, type ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import cn from '~/helpers/cn';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  fakePage?: boolean;
}

const Modal: FC<Props> = ({
  isOpen,
  onClose,
  className,
  children,
  fakePage,
}) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div
          className={cn(
            'flex min-h-full items-center justify-center p-4 text-center',
            fakePage && 'p-0'
          )}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={cn(
                'transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                fakePage && 'h-screen w-screen rounded-none',
                className
              )}
            >
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default Modal;
