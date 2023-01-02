import Head from 'next/head';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import OCForm from '../components/Form';
import OCFormInput from '../components/FormInput';
import OCButton from '../components/Button';
import supabase, { createFriend, createGroup } from './api/supabase';
import groupValidationSchema from '../validations/group.validation';
import { GroupModel } from '../models/group.model';

const defaultValues = {
  group_name: '',
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
    resolver: yupResolver(groupValidationSchema),
  });

  const onSubmit = async (data: any) => {
    const group = await createGroup({ name: data.group_name });

    if (group && group[0].id) {
      const friend = await createFriend({
        name: data.name,
        email: data.email,
        access_token: data.access_token,
        group: group[0].id,
      });

      console.log(group, friend);
    }
  };

  //console.log(errors);

  return (
    <OCForm onSubmit={handleSubmit(onSubmit)}>
      <OCFormInput
        name="group_name"
        label="Nome do grupo"
        errors={errors}
        control={control}
      />
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
