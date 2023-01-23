<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Menu from '$lib/components/Menu/Menu.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ groups } = data);
</script>

{#if groups && groups.length > 0}
	<Menu path="/private/group/" items={groups} />
{/if}
<Button isLink sendTo="/private/group" label="Criar sorteio" />

<!-- <div class="block">
	<p>Protected content for {user.email}</p>
	<p>server-side fetched data with RLS:</p>
	<pre>{JSON.stringify(testTable, null, 2)}</pre>
</div>
<div class="block">
	<p>user:</p>
	<pre>{JSON.stringify(user, null, 2)}</pre>
</div> -->
