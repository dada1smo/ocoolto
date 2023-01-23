import * as yup from 'yup';

const groupValidationSchema = yup.object({
	group_name: yup.string().label('Nome do grupo').min(3).max(64).required(),
	name: yup.string().label('Nome de exibição').min(3).max(64).required(),
	starts_at: yup.date().label('Data de início')
});

export default groupValidationSchema;
