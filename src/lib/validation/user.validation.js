import * as yup from 'yup';

export const userValidation = {
	email: yup.string().email().label('E-mail').required()
};

const userValidationSchema = yup.object(userValidation);

export default userValidationSchema;
