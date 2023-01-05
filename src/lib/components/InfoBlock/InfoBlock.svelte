<script>
	export let label = '';
	export let info = '';
</script>

<div class="block">
	<h4>{label}</h4>
	<p>{info}</p>
</div>

<style lang="scss">
	.block {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 0 8px;
		margin: 0 0 8px;
		border-bottom: 1px dashed $foreground-medium;
	}
</style>
