"use client";
import { Form, Formik } from "formik";
import type { FC } from "react";
import { z } from "zod";
import zodValidator from "~/helpers/zod-validator";
import FormikDate from "../formik-date";
import { hints, validations } from "~/constants/validations";
import FormikNumber from "../formik-number";
import cn from "~/helpers/cn";
import Button from "~/components/button";
import { tryCatch } from "~/helpers/try-catch";
import { useToast } from "~/components/toast";
import { trpc } from "~/services/trpc";
import { dayOffTypes } from "~/constants/days-off";
import LoadingWrapper from "~/components/loading-wrapper";

type Props = {
  userId: string;
  className?: string;
};

const FormDayOff: FC<Props> = ({ userId, className }) => {
  const { addToast } = useToast();
  const { mutateAsync: deleteDayOff, isLoading: isDeletingDayOff } =
    trpc.dayOff.delete.useMutation();
  const {
    data: daysOffRecurring,
    isFetching: isLoadingDaysOff,
    refetch: refetchDaysOff,
  } = trpc.dayOff.getMany.useQuery({
    userId,
    type: dayOffTypes.recurring,
  });
  const { mutateAsync: upsertDayOff } = trpc.dayOff.upsert.useMutation();

  const hasRecurringDayOff = !!daysOffRecurring && daysOffRecurring.length > 0;
  const dayOffRecurring = hasRecurringDayOff ? daysOffRecurring[0] : undefined;

  const initialValues = {
    date: dayOffRecurring?.date ?? new Date(),
    daysWorked: dayOffRecurring?.daysWorked ?? 0,
    daysOff: dayOffRecurring?.daysOff ?? 0,
  };

  const validationSchema = z.object({
    date: z.date({
      required_error: validations.required,
      invalid_type_error: validations.calendar,
    }),
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
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const [, error] = await tryCatch(
      upsertDayOff({ ...values, userId, type: dayOffTypes.recurring })
    );

    if (error) {
      addToast({
        type: "error",
        content:
          "Falha ao salvar folga recorrente, tente novamente no fim dessa mensagem",
        duration: 5000,
      });
      return;
    }

    addToast({
      type: "success",
      content: "Folga recorrente salva com sucesso",
      duration: 5000,
    });
  };

  const handleDeleteDaysOff = async () => {
    await deleteDayOff({ id: dayOffRecurring?.id ?? -1 });

    addToast({
      type: "success",
      content: "Folga recorrente desativada com sucesso",
    });

    await refetchDaysOff();
  };

  return (
    <LoadingWrapper isLoading={isLoadingDaysOff}>
      <Formik
        initialValues={initialValues}
        validate={zodValidator(validationSchema)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={cn("flex flex-col gap-y-4", className)}>
            <h2 className="mb-3">Crie uma folga recorrente</h2>
            <FormikDate
              label="Data de Início"
              hint={hints.required}
              name="date"
              help="Essa deve ser a data na qual ocorrerá a primeira folga recorrente do funcionário"
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
            <div className="flex justify-between pt-3">
              <Button
                variant="danger"
                loading={isDeletingDayOff}
                disabled={!dayOffRecurring?.id}
                onClick={handleDeleteDaysOff}
              >
                Desativar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Salvar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </LoadingWrapper>
  );
};

export default FormDayOff;
