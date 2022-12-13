import { FunctionComponent } from 'react';

export type ButtonVariantType = 'primary' | 'secondary' | 'subtle' | 'text';

interface OCButtonProps {
  label: string;
  type: 'button' | 'submit' | 'reset' | undefined;
  variant: ButtonVariantType;
  disabled?: boolean;
}

const OCButton: FunctionComponent<OCButtonProps> = ({
  label,
  type,
  variant,
  disabled = false,
}) => {
  return <button type={type}>{label}</button>;
};

export default OCButton;
