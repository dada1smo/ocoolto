<script>
	export let label = 'Teste';

	/**
	 * @type {"button" | "submit" | "reset" | null | undefined}
	 */
	export let type = 'button';
	export let isLink = false;
	export let sendTo = '';
</script>

{#if !isLink}
	<button class="button" {type} on:click>{label}</button>
{:else}
	<a class="button" href={sendTo}>{label}</a>
{/if}

<style lang="scss">
	.button {
		outline: none;
		border: unset;
		font-size: 16px;
		line-height: 20px;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 10px 14px 10px;
		cursor: pointer;
		transition: 0.3s;
		color: $foreground-dark;
		border: 1px solid $foreground-medium;
		font-family: $font-head;
		color: $accent-click;

		&:hover {
			box-shadow: -4px -4px 0px $foreground-medium;
			transform: translate(4px, 4px);
		}
	}

	a {
		text-decoration: none;
	}
</style>
