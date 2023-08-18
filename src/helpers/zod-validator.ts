import { type z } from "zod";

const zodValidator =
  <T extends z.ZodTypeAny>(schema: T) =>
  (values: Record<string, any>) => {
    const valuesCopy = { ...values };

    Object.entries(valuesCopy).forEach(([key, value]) => {
      if (value === "") valuesCopy[key] = undefined;
    });

    const parse = schema.safeParse(valuesCopy);

    if (parse.success) return {};

    const { fieldErrors } = parse.error.flatten();
    const errors: Record<string, any> = {};

    Object.keys(fieldErrors).forEach((errorKey) => {
      errors[errorKey] = fieldErrors[errorKey]?.[0];
    });

    return errors;
  };

export default zodValidator;
