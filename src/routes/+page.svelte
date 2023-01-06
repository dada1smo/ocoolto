<script>
	import { applyAction, enhance } from '$app/forms';
	import Button from '$lib/components/Button/Button.svelte';
	import Input from '$lib/components/Form/Input/Input.svelte';
	import { page } from '$app/stores';
	import Form from '$lib/components/Form/Form.svelte';
	import userValidationSchema from '$lib/validation/user.validation';
	import Notification from '$lib/components/Notification/notification.svelte';

	let values = {};
	let errors = {};

	let data;
	let loading = false;
	export let form;

	async function handleSubmit(data, cancel) {
		loading = true;
		const formValues = Object.fromEntries(data.entries());
		try {
			await userValidationSchema.validate(formValues, { abortEarly: false });
			errors = {};
		} catch (err) {
			cancel();
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
		}

		return async ({ result }) => {
			loading = false;
			await applyAction(result);
		};
	}
</script>

<div class="content">
	<h1>Cansado de malabarismo pra sortear amigo oculto?</h1>
	<p>Let's make amigo oculto cool again.</p>

	{#if form?.message}
		<Notification message={form?.message} />
	{:else}
		<div class="form">
			<Form method="POST" handleSubmit={({ data, cancel }) => handleSubmit(data, cancel)}>
				<Input
					type="email"
					name="email"
					label="Seu e-mail"
					placeholder="exemplo@exemplo.com"
					error={errors.email}
					value={form?.values?.email ?? ''}
				/>
				<Button label="Entrar" type="submit" />
			</Form>
		</div>
	{/if}
</div>

<!-- <form method="POST" use:enhance={handleSubmit}>
	<div>
		<label for="email">Email</label>
		<input
			id="email"
			name="email"
			value={form?.values?.email ?? ''}
			type="email"
			placeholder="Email"
			required
		/>
	</div>
	<div>
		<button disabled={loading}>Login</button>
	</div>
</form> -->

<!-- <form
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
{/if} -->
<style>
	.content {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.form {
		margin-top: 12px;
	}
</style>
