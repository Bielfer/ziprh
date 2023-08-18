import {
  type ChangeEvent,
  type FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useField } from 'formik';
import Input from '~/components/input';

interface Props {
  label?: string | null;
  name: string;
  password?: boolean;
  formatter?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  type?: 'text' | 'password';
  help?: string;
  leftAddOn?: string;
}

const FormikInput: FC<Props> = ({
  label,
  name,
  password,
  formatter,
  className,
  hint,
  disabled,
  placeholder,
  type,
  help,
  leftAddOn,
}) => {
  const [{ value }, { error, touched }, { setValue }] = useField<string>(name);
  const [formattedValue, setFormattedValue] = useState('');

  const formatValue = useCallback(
    (valueParameter: string) => {
      if (!formatter) return valueParameter;

      const fieldValue = valueParameter.split('');
      const notUnderscoreIndexes = [];

      for (let i = 0; i < formatter.length; i += 1) {
        if (formatter[i] === '_') continue;

        notUnderscoreIndexes.push(i);
      }

      for (const toInsertCharacterIndex of notUnderscoreIndexes) {
        if (toInsertCharacterIndex > fieldValue.length - 1) break;

        fieldValue.splice(
          toInsertCharacterIndex,
          0,
          formatter[toInsertCharacterIndex] ?? ''
        );
      }

      return fieldValue.join('');
    },
    [formatter]
  );

  const removeFormatterCharacters = (valueParameter: string) => {
    if (!formatter) return valueParameter;

    const formatterCharacters: Record<string, boolean> = {};

    for (const formatterCharacter of formatter) {
      if (formatterCharacter === '_') continue;

      formatterCharacters[formatterCharacter] = true;
    }

    const arrayFormatterCharacters = Object.keys(formatterCharacters);

    return valueParameter
      .split('')
      .filter((character) => !arrayFormatterCharacters.includes(character))
      .join('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formatter) {
      setValue(e.target.value);
      return;
    }

    const valueWithoutFormatter = removeFormatterCharacters(e.target.value);

    setValue(valueWithoutFormatter);
    setFormattedValue(formatValue(valueWithoutFormatter));
  };

  useEffect(() => {
    if (!formatter) return;

    setFormattedValue(formatValue(value));
  }, [formatValue, formatter, value]);

  return (
    <Input
      value={formatter ? formattedValue : value}
      onChange={handleChange}
      password={password}
      label={label}
      className={className}
      error={touched && error ? error : ''}
      hint={hint}
      disabled={disabled}
      name={name}
      placeholder={placeholder}
      type={type}
      help={help}
      leftAddOn={leftAddOn}
    />
  );
};

export default FormikInput;
