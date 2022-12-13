import * as yup from 'yup';

const groupValidationSchema = yup.object({
  name: yup.string().label('Nome do grupo').min(3).max(64).required(),
  starts_at: yup.date().label('Data de início').required(),
});

export default groupValidationSchema;
