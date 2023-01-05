<script>
	import Panel from './Panel/Panel.svelte';

	export let panels = [];
</script>

<div class="accordion">
	{#each panels as { id, name, gift_preferences } (id)}
		<Panel {id} title={name} content={gift_preferences} />
	{/each}
</div>

<style lang="scss">
	.accordion {
		border: 1px solid $foreground-medium;
	}
</style>
