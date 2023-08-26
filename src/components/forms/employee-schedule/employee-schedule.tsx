"use client";
import { Form, Formik } from "formik";
import type { FC } from "react";
import FormikAdd from "../formik-add";
import IconButton from "~/components/icon-button";
import { TrashIcon } from "@heroicons/react/20/solid";
import { times } from "~/constants/times";
import FormikSelect from "../formik-select";
import FormikCheckbox from "../formik-checkboxes";
import { dayAbbreviations } from "~/constants/dates";
import Button from "~/components/button";
import Container from "~/components/container";
import { trpc } from "~/services/trpc";
import { tryCatch } from "~/helpers/try-catch";
import { useToast } from "~/components/toast";
import LoadingWrapper from "~/components/loading-wrapper";
import { z } from "zod";
import zodValidator from "~/helpers/zod-validator";

type Props = {
  employeeId: string;
};

const FormEmployeeSchedule: FC<Props> = ({ employeeId }) => {
  const { addToast } = useToast();
  const { data: employeeSchedules, isLoading } =
    trpc.schedules.getMany.useQuery({
      userId: employeeId,
    });
  const { mutateAsync: upsertSchedules } =
    trpc.schedules.upsertMany.useMutation();

  const initialValues = {
    employeeSchedules:
      !!employeeSchedules && employeeSchedules.length > 0
        ? employeeSchedules?.map(({ id, beginning, end, days }) => ({
            id,
            beginning,
            end,
            days,
          }))
        : [{ id: -1, beginning: "", end: "", days: [] }],
  };

  const validationSchema = z.object({
    employeeSchedules: z
      .object({
        beginning: z.string().min(4, "Escolha um horário de entrada").max(5),
        end: z.string().min(4, "Escolha um horário de saída").max(5),
        days: z.number().array().min(1, "Você deve escolher ao menos um dia"),
      })
      .array(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const toDeleteSchedules = initialValues.employeeSchedules
      .map((schedule) => schedule.id)
      .filter(
        (scheduleId) =>
          !values.employeeSchedules.find(
            (schedule) => schedule.id === scheduleId
          ) && scheduleId > 0
      );

    const [, error] = await tryCatch(
      upsertSchedules({
        deleteSchedules: toDeleteSchedules,
        employeeId,
        employeeSchedules: values.employeeSchedules,
      })
    );

    if (error) {
      addToast({
        type: "error",
        content:
          "Falha ao salvar horários, tente novamente quando essa mensagem fechar!",
        duration: 5000,
      });
      return;
    }

    addToast({
      type: "success",
      content: "Horários salvos com sucesso, você já pode olhar a nova escala",
      duration: 5000,
    });
  };

  return (
    <LoadingWrapper isLoading={isLoading}>
      <Formik
        initialValues={initialValues}
        validate={zodValidator(validationSchema)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Container smallerContainer smallerContainerSize="max-w-xl">
              <FormikAdd
                name="employeeSchedules"
                render={({ remove, value }) => (
                  <div className="flex flex-col">
                    <label className="font-semibold">Dias de Trabalho</label>
                    {value?.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-x-2 border-b py-7 lg:gap-x-5"
                      >
                        <div className="flex w-full flex-col items-center">
                          <FormikCheckbox
                            name={`employeeSchedules[${idx}].days`}
                            className="mx-auto mb-1.5"
                            textSide="bottom"
                            options={dayAbbreviations.map((day, idx) => ({
                              name: day,
                              value: idx,
                            }))}
                          />
                          <div className="grid w-full grid-cols-7 items-center lg:w-5/6">
                            <FormikSelect
                              className="col-span-3"
                              name={`employeeSchedules[${idx}].beginning`}
                              options={times.map((time) => ({
                                text: time,
                                value: time,
                              }))}
                            />
                            <div className="mx-auto w-3 border-t border-gray-300" />
                            <FormikSelect
                              className="col-span-3"
                              name={`employeeSchedules[${idx}].end`}
                              options={times.map((time) => ({
                                text: time,
                                value: time,
                              }))}
                            />
                          </div>
                        </div>
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
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Salvar
                </Button>
              </div>
            </Container>
          </Form>
        )}
      </Formik>
    </LoadingWrapper>
  );
};

export default FormEmployeeSchedule;
