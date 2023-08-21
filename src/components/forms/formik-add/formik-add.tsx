import { PlusIcon } from "@heroicons/react/24/outline";
import { ErrorMessage, FieldArray, useField } from "formik";
import { useMemo, type FC, type ReactNode, useState } from "react";
import IconButton from "~/components/icon-button";

type Props = {
  name: string;
  render: (helpers: { remove: RemoveType; value: ValueType[] }) => ReactNode;
};

type RemoveType = <T>(index: number) => T | undefined;
type ValueType = { id: number; [key: string]: any };

const FormikAdd: FC<Props> = ({ name, render }) => {
  const [{ value }, { initialValue }] = useField<ValueType[]>(name);
  const [id, setId] = useState(-2);

  const emptyValue = useMemo(() => {
    const newObj: ValueType = { id };

    Object.entries(initialValue?.[0] ?? {}).forEach(([key, value]) => {
      if (key === "id") return;
      if (typeof value === "string") newObj[key] = "";
      else newObj[key] = 0;
    });

    return newObj;
  }, [initialValue, id]);

  return (
    <FieldArray name={name}>
      {({ push, remove }: { push: (obj: any) => void; remove: RemoveType }) => (
        <>
          {render({ remove, value })}
          <div className="mt-2 text-sm text-red-600" id="error">
            <ErrorMessage name={name} />
          </div>
          <div className="flex justify-center pt-4">
            <IconButton
              size="lg"
              icon={PlusIcon}
              variant="secondary"
              onClick={() => {
                push(emptyValue);
                setId((prev) => prev - 1);
              }}
            />
          </div>
        </>
      )}
    </FieldArray>
  );
};

export default FormikAdd;
