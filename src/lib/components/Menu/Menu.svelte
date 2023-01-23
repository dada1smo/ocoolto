<script>
	export let items = [];
	export let path = '';
</script>

<div class="menu">
	{#if items && items.length > 0}
		{#each items as { id, label } (id)}
			<a href={`${path}${id}`}>{label}</a>
		{/each}
	{:else}
		<div>-</div>
	{/if}
</div>

<style lang="scss">
	.menu {
		margin: 20px 0;
		display: flex;
		flex-direction: column;
	}

	a {
		color: $accent-click;
		text-decoration: none;
		font-weight: 600;
		padding: 12px 08px;
		border-bottom: 1px dashed $foreground-medium;
		transition: 0.3s;
		width: 100%;

		&:hover {
			background: $accent-click-light;
		}
	}
</style>
