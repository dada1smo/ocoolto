<script>
	import { fly, slide } from 'svelte/transition';
	export let refresh = '';
</script>

{#key refresh}
	<!-- <div in:fly={{ x: 50, duration: 250, delay: 800 }} out:fly={{ x: -50, duration: 250 }}>
		<slot />
	</div> -->
	<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
		<slot />
	</div>
{/key}
