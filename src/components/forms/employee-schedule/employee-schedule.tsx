"use client";
import { Form, Formik } from "formik";
import { useState, type FC, useEffect } from "react";
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
import {
  scheduleTypes,
  type scheduleTypesValues,
} from "~/constants/schedule-types";
import FormikNumber from "../formik-number";
import FormikDate from "../formik-date";
import { hints, validations } from "~/constants/validations";
import Select from "~/components/select";

type Props = {
  employeeId: string;
};

const FormEmployeeSchedule: FC<Props> = ({ employeeId }) => {
  const { addToast } = useToast();
  const {
    data: employeeSchedules,
    isLoading,
    isSuccess,
    refetch: refetchSchedules,
  } = trpc.schedules.getMany.useQuery({
    userId: employeeId,
  });
  const { mutate: createSchedule } = trpc.schedules.create.useMutation();
  const { mutate: updateSchedule } = trpc.schedules.update.useMutation();
  const { mutate: deleteSchedule } = trpc.schedules.delete.useMutation();
  const [type, setType] = useState<(typeof scheduleTypesValues)[number]>(
    scheduleTypes.customizable
  );

  const intervalSchedule = employeeSchedules?.filter(
    (item) => item.type === scheduleTypes.interval
  )?.[0];

  useEffect(() => {
    setType(
      !!intervalSchedule ? scheduleTypes.interval : scheduleTypes.customizable
    );
  }, [isSuccess, setType, intervalSchedule]);

  const customizableEmployeeSchedules = employeeSchedules
    ?.filter((item) => item.type === scheduleTypes.customizable)
    .map(({ id, beginning, end, days }) => ({
      id,
      beginning,
      end,
      days,
    }));

  const initialValues = {
    employeeSchedules:
      !!customizableEmployeeSchedules &&
      customizableEmployeeSchedules.length > 0
        ? customizableEmployeeSchedules
        : [{ id: -1, beginning: "", end: "", days: [] }],
    id: intervalSchedule?.id ?? -1,
    beginning: intervalSchedule?.beginning ?? "",
    end: intervalSchedule?.end ?? "",
    daysWorked: intervalSchedule?.daysWorked ?? 0,
    daysOff: intervalSchedule?.daysOff ?? 0,
    firstDayOff: intervalSchedule?.firstDayOff ?? new Date(),
  };

  const validationSchema =
    type === scheduleTypes.customizable
      ? z.object({
          employeeSchedules: z
            .object({
              beginning: z
                .string()
                .min(4, "Escolha um horário de entrada")
                .max(5),
              end: z.string().min(4, "Escolha um horário de saída").max(5),
              days: z.number().array(),
            })
            .array(),
        })
      : z.object({
          beginning: z
            .string({
              required_error: validations.required,
            })
            .min(4, "Escolha um horário de entrada")
            .max(5),
          end: z
            .string({
              required_error: validations.required,
            })
            .min(4, "Escolha um horário de saída")
            .max(5),
          daysWorked: z
            .number({
              required_error: validations.required,
              invalid_type_error: validations.number,
            })
            .min(1, validations.valueGreaterThan(0)),
          daysOff: z
            .number({
              required_error: validations.required,
              invalid_type_error: validations.number,
            })
            .min(1, validations.valueGreaterThan(0)),
          firstDayOff: z.date({
            required_error: validations.required,
            invalid_type_error: validations.calendar,
          }),
        });

  const handleSubmit = async (values: typeof initialValues) => {
    const {
      employeeSchedules: formEmployeeSchedules,
      ...valuesWithoutEmployeeSchedules
    } = values;
    const isIntervalType = type === scheduleTypes.interval;
    const toDeleteSchedules = isIntervalType
      ? employeeSchedules
          ?.filter((schedule) => schedule.type === scheduleTypes.customizable)
          .map((item) => item.id)
      : [
          ...(employeeSchedules
            ?.filter((schedule) => schedule.type === scheduleTypes.interval)
            .map((item) => item.id) ?? []),
          ...initialValues.employeeSchedules
            .map((schedule) => schedule.id)
            .filter(
              (scheduleId) =>
                !values.employeeSchedules.find(
                  (schedule) => schedule.id === scheduleId
                ) && scheduleId > 0
            ),
        ];

    const schedules = isIntervalType
      ? [{ ...valuesWithoutEmployeeSchedules, type: scheduleTypes.interval }]
      : formEmployeeSchedules;

    const allPromises = Promise.all([
      toDeleteSchedules?.map((id) => deleteSchedule({ id })),
      schedules.map((item) =>
        item.id > 0
          ? updateSchedule({ ...item, employeeId })
          : createSchedule({ ...item, employeeId })
      ),
    ]);

    const [, error] = await tryCatch(allPromises);

    if (error) {
      addToast({
        type: "error",
        content: "Ocorreu algum erro, recarregue a página e tente novamente!",
        duration: 5000,
      });
      return;
    }

    addToast({
      type: "success",
      content: "Horários salvos com sucesso, você já pode olhar a nova escala",
      duration: 5000,
    });

    const [, errorRefetching] = await tryCatch(refetchSchedules());

    if (errorRefetching)
      addToast({
        type: "error",
        content: "Ocorreu algum erro, recarregue a página e tente novamente!",
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
          <Container smallerContainer smallerContainerSize="max-w-xl">
            <Form className="flex flex-col gap-y-5">
              <Select
                selected={type}
                setSelected={(val) =>
                  setType(val as (typeof scheduleTypesValues)[number])
                }
                label="Tipo de Escala"
                name="type"
                options={[
                  { text: "Customizável", value: scheduleTypes.customizable },
                  { text: "Intervalar", value: scheduleTypes.interval },
                ]}
              />
              {type === scheduleTypes.customizable ? (
                <FormikAdd
                  name="employeeSchedules"
                  render={({ remove, value }) => (
                    <div className="flex flex-col">
                      <label>Dias de Trabalho</label>
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
              ) : (
                <>
                  <FormikDate
                    className="w-full"
                    label="Primeira Folga"
                    hint={hints.required}
                    name="firstDayOff"
                    help="Essa deve ser a data na qual ocorrerá a primeira folga do funcionário"
                  />
                  <FormikNumber
                    label="Dias de Trabalho"
                    name="daysWorked"
                    hint={hints.required}
                    help="Quantos dias o funcionário trabalha antes de folgar?"
                  />
                  <FormikNumber
                    label="Dias de Folga"
                    name="daysOff"
                    hint={hints.required}
                    help="Quantos dias de folga o funcionário tem após trabalhar?"
                  />
                  <div className="grid w-full grid-cols-7">
                    <FormikSelect
                      hint={hints.required}
                      label="Entrada"
                      className="col-span-3"
                      name="beginning"
                      options={times.map((time) => ({
                        text: time,
                        value: time,
                      }))}
                    />
                    <div />
                    <FormikSelect
                      hint={hints.required}
                      label="Saída"
                      className="col-span-3"
                      name="end"
                      options={times.map((time) => ({
                        text: time,
                        value: time,
                      }))}
                    />
                  </div>
                </>
              )}
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
            </Form>
          </Container>
        )}
      </Formik>
    </LoadingWrapper>
  );
};

export default FormEmployeeSchedule;
