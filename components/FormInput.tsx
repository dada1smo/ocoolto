import { FunctionComponent, HTMLInputTypeAttribute } from 'react';
import { Controller } from 'react-hook-form';

interface OCFormInputProps {
  type?: HTMLInputTypeAttribute;
  mode?:
    | 'email'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | undefined;
  label: string;
  name: string;
  step?: number;
  placeholder?: string;
  control: any;
  errors: any;
  preffix?: string;
}

const OCFormInput: FunctionComponent<OCFormInputProps> = ({
  type = 'text',
  mode = 'text',
  label,
  name,
  step = 1,
  placeholder,
  control,
  errors,
  preffix,
}) => {
  return (
    <>
      <label>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            id={name}
            type={type}
            inputMode={mode}
            step={step}
            value={value}
            onBlur={onBlur}
            placeholder={placeholder}
            onChange={onChange}
          />
        )}
      />
    </>
  );
};

export default OCFormInput;
