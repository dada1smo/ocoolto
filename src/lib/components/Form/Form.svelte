<script>
	import { enhance } from '$app/forms';

	export let method = '';
	export let handleSubmit;
</script>

<form {method} novalidate use:enhance={handleSubmit}>
	<slot />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}
</style>
