<script>
	import Button from '../Button/Button.svelte';
	import Logo from '../Logo/Logo.svelte';

	export let showType = false;

	function hoverType() {
		showType = true;
	}

	function leaveType() {
		showType = false;
	}
</script>

<nav>
	<div class="logo" on:mouseenter={hoverType} on:mouseleave={leaveType}>
		<Logo {showType} />
	</div>
	<Button label="Sair" />
</nav>

<style lang="scss">
	nav {
		padding: 20px 20px 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: $accent-background;
	}

	.logo {
		position: relative;
		height: 44px;
		width: 80px;
		background: transparent;
	}

	.type {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: transparent;
	}
</style>
