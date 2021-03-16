<script>
	export let segment;
</script>

<nav>
	<a href="/" title="Inicio">
		<img class="logo" src="/android-chrome-192x192.png" alt="Logo shape do comitê" />
	</a>
	<div class="nav-item">
		<a aria-current="{segment === 'detalhes' ? 'page' : undefined}" href="/detalhes">Detalhes</a>
	</div>
	<div class="nav-item">
		<a aria-current="{segment === 'sobre' ? 'page' : undefined}" href="/sobre">Sobre</a>
	</div>
</nav>

<style>
	nav {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: .33rem .4rem .25rem .4rem;
		background-color: #444;
		font-size: .86rem;
	}
	.logo {
		border-radius: 50%;
		width: 1.66rem;
	}
	.nav-item {
		margin-left: var(--space);
		padding: 0 var(--space-s);
	}
	.nav-item a {
		border: 3px solid transparent;
		padding: .25rem .4rem;
		color: #fff;
		text-decoration: none;
	}
	.nav-item [aria-current] {
		border-top-color: currentColor;
	}
	.nav-item a:hover,
	.nav-item a:focus {
		color: cornflowerblue;
	}
</style>
