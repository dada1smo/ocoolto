<script>
	export let label = 'Teste';
</script>

<button>{label}</button>

<style lang="scss">
	button {
		outline: none;
		border: none;
		font-size: 16px;
		line-height: 28px;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 12px 40px;
		border-radius: 4444px;
		cursor: pointer;
		transition: 0.3s;

		&:hover {
			background: #333333;
		}
	}
</style>
