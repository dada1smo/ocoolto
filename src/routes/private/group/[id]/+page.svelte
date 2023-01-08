<script>
	import Accordion from '$lib/components/Accordion/Accordion.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import InfoBlock from '$lib/components/InfoBlock/InfoBlock.svelte';

	export let data;
</script>

<div class="content">
	<h1>{data.group.name}</h1>
	<div class="details">
		<InfoBlock label="Quem criou" info={data.group.owner} />
		<InfoBlock label="Começa em" info={data.group.starts_at} />
	</div>
	<Button label="Editar preferências" isLink sendTo="/" />
	<Accordion panels={data.group.friends} />
</div>

<style>
	.content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.details {
		padding: 8px 0;
	}
</style>
