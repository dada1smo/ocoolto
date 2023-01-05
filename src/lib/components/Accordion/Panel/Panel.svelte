<script>
	import { slide, fade } from 'svelte/transition';

	export let id;
	export let title;
	export let content = '';
	export let isOpen = false;

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<div class="panel" aria-expanded={isOpen}>
	<div class="header">
		<h3><button on:click={toggle}>{title}</button></h3>
		<button class="trigger" on:click={toggle}>
			{#if isOpen}
				<span transition:fade={{ duration: 200 }}>-</span>
			{:else}
				<span transition:fade={{ duration: 200 }}>+</span>
			{/if}
		</button>
	</div>
	{#if isOpen}
		<div ul transition:slide={{ duration: 300 }} class="content">
			<div transition:fade={{ delay: 100 }}>{content}</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.panel {
		padding: 8px 12px 8px;
		border-bottom: 1px solid $foreground-medium;

		&:last-of-type {
			border-bottom: none;
		}
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.content {
		padding: 8px 0 12px;
	}

	button {
		outline: none;
		border: unset;
		font-size: inherit;
		line-height: inherit;
		font-weight: inherit;
		display: inline-flex;
		cursor: pointer;
		transition: 0.3s;
	}

	h3 {
		font-family: $font-head;
		color: $accent-click;
		flex: 1;

		button {
			width: 100%;
			font-family: inherit;
			color: inherit;
		}
	}

	.trigger {
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 28px;
		height: 28px;
		font-size: 28px;
		line-height: 0;
		position: relative;
		font-weight: 400;

		span {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-family: 'Fira Code', monospace;
			color: #2563eb;
		}
	}
</style>
