import * as yup from 'yup';

export const friendValidation = {
	name: yup.string().label('Nome de exibição').min(3).max(64).required(),
	email: yup.string().email().label('E-mail').required(),
	access_token: yup
		.string()
		.label('Senha de acesso')
		.min(6)
		.max(6)
		.matches(/^[0-9]*$/)
		.required()
};

const friendValidationSchema = yup.object(friendValidation);

export default friendValidationSchema;
