import Head from 'next/head';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import friendValidationSchema from '../validations/friend.validation';
import OCForm from '../components/Form';
import OCFormInput from '../components/FormInput';
import OCButton from '../components/Button';
import supabase from './api/supabase';

const defaultValues = {
  name: '',
  email: '',
  access_token: '',
};

export default function Home() {
  const {
    control,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm({
    defaultValues,
    resolver: yupResolver(friendValidationSchema),
  });

  const onSubmit = async (data: any) => {
    const response = await supabase.from('friends').insert(data).select();

    console.log(response);
  };

  //console.log(errors);

  return (
    <OCForm onSubmit={handleSubmit(onSubmit)}>
      <OCFormInput
        name="name"
        label="Seu nome"
        errors={errors}
        control={control}
      />
      <OCFormInput
        name="email"
        label="Seu e-mail"
        errors={errors}
        control={control}
      />
      <OCFormInput
        name="access_token"
        label="Sua senha de acesso"
        errors={errors}
        control={control}
      />
      <OCButton type="submit" label="Cria conta" variant="primary" />
    </OCForm>
  );
}
