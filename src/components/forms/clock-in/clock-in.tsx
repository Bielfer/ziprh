import {
  endOfDay,
  format,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { Form, Formik } from "formik";
import { useParams } from "next/navigation";
import { type FC } from "react";
import Button from "~/components/button";
import LoadingWrapper from "~/components/loading-wrapper";
import { trpc } from "~/services/trpc";
import zodValidator from "~/helpers/zod-validator";
import { z } from "zod";
import { tryCatch } from "~/helpers/try-catch";
import { useToast } from "~/components/toast";
import FormikAdd from "../formik-add";
import FormikNumber from "../formik-number";
import IconButton from "~/components/icon-button";
import { TrashIcon } from "@heroicons/react/24/solid";

type Props = {
  date: Date;
  className?: string;
  afterSubmit: () => void;
};

const FormClockIn: FC<Props> = ({ date, className, afterSubmit }) => {
  const { userId } = useParams();
  const { addToast } = useToast();
  const { data: clockIns, isLoading } = trpc.clockIns.getMany.useQuery(
    {
      userId: userId ?? "",
      startDate: startOfDay(date),
      endDate: endOfDay(date),
    },
    { cacheTime: 0 }
  );
  const { mutateAsync: upsertClockIns } =
    trpc.clockIns.upsertMany.useMutation();

  const initialValues = {
    clockIns:
      clockIns && clockIns.length > 0
        ? clockIns.map((item) => ({
            hours: getHours(item.punchTime),
            minutes: getMinutes(item.punchTime),
            id: item.id,
          }))
        : [{ hours: 0, minutes: 0, id: -1 }],
  };

  const validationSchema = z.object({
    clockIns: z
      .object({
        hours: z
          .number({ invalid_type_error: "Insira apenas números" })
          .min(0, { message: "As horas não podem ser menores que 0" })
          .max(23, { message: "As horas não podem passar de 23" }),
        minutes: z
          .number({ invalid_type_error: "Insira apenas números" })
          .min(0, { message: "Os minutos não podem ser menores que 0" })
          .max(59, { message: "Os minutos não podem passar de 59" }),
      })
      .array(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const toDeleteClockIns = initialValues.clockIns
      .map((clockIn) => clockIn.id)
      .filter(
        (clockInId) =>
          !values.clockIns.find((clockIn) => clockIn.id === clockInId) &&
          clockInId > 0
      );

    const [, error] = await tryCatch(
      upsertClockIns({
        clockIns: values.clockIns.map((clockIn) => ({
          id: clockIn.id,
          punchTime: setMinutes(setHours(date, clockIn.hours), clockIn.minutes),
        })),
        userId: userId ?? "",
        deleteClockIns: toDeleteClockIns,
      })
    );

    if (error) {
      addToast({
        type: "error",
        content:
          "Falha ao atualizar pontos, favor tente novamente em 5 segundos!",
      });
      return;
    }

    afterSubmit();
  };

  return (
    <div className={className}>
      <h2 className="mb-6">Pontos em {format(date, "dd/MM")}</h2>
      <LoadingWrapper isLoading={isLoading}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={zodValidator(validationSchema)}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormikAdd
                name="clockIns"
                render={({ remove, value }) => (
                  <div className="grid grid-cols-11 gap-x-3 gap-y-3 lg:grid-cols-12 lg:gap-x-5">
                    <div className="col-span-3 col-start-5 font-medium lg:col-start-6">
                      Horas
                    </div>
                    <div className="col-span-3 font-medium">Minutos</div>
                    {value?.map((item, idx) => (
                      <div
                        key={item.id}
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
                          {value.length > 1 && (
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
                )}
              />
              <div className="flex justify-end pt-4">
                <Button variant="primary" type="submit" loading={isSubmitting}>
                  Salvar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </LoadingWrapper>
    </div>
  );
};

export default FormClockIn;
