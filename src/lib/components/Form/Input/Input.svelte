<script>
	export let name = '';
	export let type = 'text';
	export let label = '';
	export let error = '';
	export let placeholder = '';
	/**
	 * @type {string | number | undefined}
	 */
	export let value;

	/**
	 * @param {{ type: string; }} node
	 */
	function handleType(node) {
		node.type = type;
	}
</script>

<div class="form">
	<label for={name}>{label}</label>
	<input use:handleType {name} id={name} {placeholder} {value} on:input />
	{#if error}
		<span class="errorMessage">{error}</span>
	{/if}
</div>

<style lang="scss">
	.form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	label {
		text-transform: uppercase;
		font-size: 14px;
		font-family: $font-head;
		font-weight: 600;
		color: $foreground-medium;
		width: 100%;
	}

	input {
		width: 100%;
		background: $background-light;
		height: 40px;
		border-bottom: 1px solid $foreground-medium;
		transition: 0.2s;
		padding: 4px 8px;

		&:focus,
		&:focus-visible {
			outline: none;
			border-bottom: 1px solid $accent-click;
		}
	}

	.errorMessage {
		color: $accent-error;
		font-size: 14px;
	}
</style>
