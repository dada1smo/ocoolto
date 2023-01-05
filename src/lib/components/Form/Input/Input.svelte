<script>
	export let name = '';
	export let type = 'text';
	export let label = '';
	export let error = '';
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

<label for={name}>{label}</label>
<input use:handleType {name} id={name} bind:value on:input />
{#if error}
	<span>{error}</span>
{/if}
