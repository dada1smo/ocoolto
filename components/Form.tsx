import { FormEventHandler, FunctionComponent, ReactNode } from 'react';

interface OCFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

const OCForm: FunctionComponent<OCFormProps> = ({ onSubmit, children }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

export default OCForm;
