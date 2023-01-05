<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button/Button.svelte';
	import Input from '$lib/components/Form/Input/Input.svelte';
	import groupValidationSchema from '$lib/validation/group.validation';

	let values = {};
	let errors = {};

	export let data;
	export let form;

	async function handleSubmit(data, cancel) {
		const formValues = Object.fromEntries(data.entries());
		console.log(values);
		try {
			await groupValidationSchema.validate(formValues, { abortEarly: false });
			errors = {};
		} catch (err) {
			console.log('erros');
			cancel();
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			console.log(errors);
		}
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<form
	method="POST"
	action="?/create"
	use:enhance={({ data, cancel }) => handleSubmit(data, cancel)}
	novalidate
>
	<Input
		type="text"
		name="group_name"
		label="Grupo"
		error={errors.group_name}
		bind:value={values.group_name}
	/>
	<Input type="text" name="name" label="Seu nome" error={errors.name} bind:value={values.name} />
	<Input
		type="email"
		name="email"
		label="Seu e-mail"
		error={errors.email}
		bind:value={values.email}
	/>
	<Input
		type="text"
		name="access_token"
		label="Sua senha de acesso"
		error={errors.access_token}
		bind:value={values.access_token}
	/>
	<Button label="Button" type="submit" />
</form>
<Button label="Nav" isLink sendTo="/group/2" />

{#if form?.success}
	<p>Successfully logged in! Welcome back</p>
{/if}
