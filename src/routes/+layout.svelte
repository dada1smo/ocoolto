<script>
	import Nav from '$lib/components/Nav/Nav.svelte';
	import PageTransition from '$lib/components/PageTransition/PageTransition.svelte';
	import '../app.scss';
	import { page } from '$app/stores';
	import { supabase } from '$lib/db/db';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<PageTransition refresh={$page.url.pathname}>
	<main>
		<div class="container">
			<Nav />
			<div class="divider" />
			<div class="block"><slot /></div>
		</div>
	</main>
</PageTransition>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: stretch;
		gap: 28px;
		padding: 0 0 20px;
	}

	.block {
		padding: 0 20px;
	}

	.divider {
		height: 1px;
		width: 100%;
		background: $foreground-medium;
		margin: 0 0 20px;
	}
	.container {
		width: 40vw;
		max-width: 480px;
		min-width: 320px;
		padding: 0 0 24px;
		display: flex;
		align-items: stretch;
		flex-direction: column;
		border: 1px solid $foreground-medium;
		background: $background-white;
		box-shadow: 4px 4px 0px $foreground-medium;
	}
</style>
