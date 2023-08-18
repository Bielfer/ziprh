import { ErrorMessage, useField } from "formik";
import type { FC } from "react";
import FormikNumber from "../formik-number";
import IconButton from "~/components/icon-button";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

type ClockIn = { hours: number; minutes: number; id: number };

const FieldsList: FC = () => {
  const [{ value: clockIns }, , { setValue }] = useField<ClockIn[]>("clockIns");

  const push = () => {
    setValue([...clockIns, { hours: 0, minutes: 0, id: -1 }]);
  };

  const remove = (idx: number) => {
    setValue(clockIns.filter((item, itemIdx) => itemIdx !== idx));
  };

  return (
    <>
      <div className="grid grid-cols-11 gap-x-3 gap-y-3 lg:grid-cols-12 lg:gap-x-5">
        <div className="col-span-3 col-start-5 font-medium lg:col-start-6">
          Horas
        </div>
        <div className="col-span-3 font-medium">Minutos</div>
        {clockIns?.map((item, idx) => (
          <div
            key={idx}
            className="col-span-11 grid grid-cols-11 items-center gap-x-3 lg:col-span-12 lg:grid-cols-12 lg:gap-x-5"
          >
            <p className="col-span-4 font-medium lg:col-span-5">
              Ponto {idx + 1}
            </p>
            <FormikNumber
              className="col-span-3"
              name={`clockIns[${idx}].hours`}
            />
            <FormikNumber
              className="col-span-3"
              name={`clockIns[${idx}].minutes`}
            />
            <div>
              {clockIns.length > 1 && (
                <IconButton
                  icon={TrashIcon}
                  variant="link-danger"
                  size="sm"
                  onClick={() => remove(idx)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-red-600" id="error">
        <ErrorMessage name="clockIns" />
      </div>
      <div className="flex justify-center pt-4">
        <IconButton
          size="lg"
          icon={PlusIcon}
          variant="secondary"
          onClick={() => push()}
        />
      </div>
    </>
  );
};

export default FieldsList;
