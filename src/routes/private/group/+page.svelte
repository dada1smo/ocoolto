<script>
	import { applyAction } from '$app/forms';
	import Button from '$lib/components/Button/Button.svelte';
	import Input from '$lib/components/Form/Input/Input.svelte';
	import Form from '$lib/components/Form/Form.svelte';
	import Notification from '$lib/components/Notification/notification.svelte';
	import groupValidationSchema from '$lib/validation/group.validation';

	let errors = {};

	let loading = false;
	export let form;

	async function handleSubmit(data, cancel) {
		loading = true;
		const formValues = Object.fromEntries(data.entries());
		try {
			await groupValidationSchema.validate(formValues, { abortEarly: false });
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
	<h1>Criar grupo</h1>

	{#if form?.message}
		<Notification message={form?.message} />
	{:else}
		<div class="form">
			<Form
				method="POST"
				action="?/create"
				handleSubmit={({ data, cancel }) => handleSubmit(data, cancel)}
			>
				<Input
					type="text"
					name="group_name"
					label="Nome do grupo"
					placeholder="Amigo Ocoolto"
					error={errors.group_name}
					value={form?.values?.group_name ?? ''}
				/>
				<Input
					type="text"
					name="name"
					label="Seu nome"
					placeholder="Amigo"
					error={errors.name}
					value={form?.values?.name ?? ''}
				/>
				<Button label="Criar" type="submit" />
			</Form>
		</div>
	{/if}
</div>

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
