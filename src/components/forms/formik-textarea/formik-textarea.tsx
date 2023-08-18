import { useField } from 'formik';
import Textarea from '~/components/textarea';

interface Props {
  name: string;
  hint?: string;
  label?: string | null;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

const FormikTextarea = ({
  name,
  className,
  hint,
  label,
  placeholder,
  disabled,
  rows,
}: Props) => {
  const [{ value }, { error, touched }, { setValue }] = useField(name);

  return (
    <Textarea
      name={name}
      value={value}
      setValue={setValue}
      className={className}
      disabled={disabled}
      error={touched && error ? error : ''}
      hint={hint}
      label={label}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

export default FormikTextarea;
