import * as yup from 'yup';

const friendValidationSchema = yup.object({
  name: yup.string().label('Nome de exibição').min(3).max(64).required(),
  email: yup.string().email().label('E-mail').required(),
  access_token: yup
    .string()
    .label('Senha de acesso')
    .min(6)
    .max(6)
    .matches(/^[0-9]*$/)
    .required(),
});

export default friendValidationSchema;
