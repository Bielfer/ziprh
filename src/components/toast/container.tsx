import { Transition } from "@headlessui/react";
import { useToastStore } from "~/store";
import Toast from "./toast";
import { type FC } from "react";

const ToastContainer: FC = () => {
  const { toasts } = useToastStore();

  return (
    <Transition appear show={toasts.length > 0}>
      <div className="fixed right-5 top-5 flex w-5/6 max-w-sm flex-col gap-y-3 overflow-hidden">
        {toasts.map((item) => (
          <Toast key={item.id} {...item} />
        ))}
      </div>
    </Transition>
  );
};

export default ToastContainer;
