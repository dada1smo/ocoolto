import * as yup from 'yup';
import { friendValidation } from './friend.validation';

const groupValidationSchema = yup.object({
  ...friendValidation,
  group_name: yup.string().label('Nome do grupo').min(3).max(64).required(),
  starts_at: yup.date().label('Data de início'),
});

export default groupValidationSchema;
