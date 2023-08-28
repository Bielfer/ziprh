"use client";
import { Form, Formik } from "formik";
import type { FC } from "react";
import { z } from "zod";
import zodValidator from "~/helpers/zod-validator";
import FormikInput from "../formik-input";
import { hints, validations } from "~/constants/validations";
import Button from "~/components/button";
import { trpc } from "~/services/trpc";
import { tryCatch } from "~/helpers/try-catch";
import { useToast } from "~/components/toast";
import { useRouter } from "next/navigation";
import { paths } from "~/constants/paths";

type Props = {
  isEmployee: boolean;
};

const FormUser: FC<Props> = ({ isEmployee }) => {
  const router = useRouter();
  const { addToast } = useToast();
  const { mutateAsync: updateUser } = trpc.user.update.useMutation();

  const initialValues = {
    firstName: "",
    lastName: "",
  };

  const validationSchema = z.object({
    firstName: z.string({ required_error: validations.required }),
    lastName: z.string({ required_error: validations.required }),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const [, error] = await tryCatch(updateUser(values));

    if (error) {
      addToast({
        type: "error",
        content:
          "Falha ao atualizar seus dados, tente novamente quando essa mensagem sumir",
        duration: 5000,
      });
      return;
    }

    router.push(isEmployee ? paths.employeeSchedule : paths.employerSchedule);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validationSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex w-full max-w-sm flex-col gap-y-4 rounded-xl border p-6 shadow">
          <h2 className="mb-2">Meus Dados</h2>
          <FormikInput
            label="Primeiro Nome"
            name="firstName"
            placeholder="João"
            hint={hints.required}
          />
          <FormikInput
            label="Último Nome"
            name="lastName"
            placeholder="Silva"
            hint={hints.required}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormUser;
