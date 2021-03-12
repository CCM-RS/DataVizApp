<script>
	import { getContext } from 'svelte';
	const global_data = getContext('global_data');
</script>

<svelte:head>
	<title>Sobre o Mapa | { global_data.site_name }</title>
	<meta property="og:title" content="Sobre o Mapa | { global_data.site_name }">
	<!-- <meta property="og:desc" content=""> -->
	<meta property="og:site_name" content="{ global_data.site_name }">
</svelte:head>

<div class="content-wrap">
	<h1>Sobre o Mapa</h1>
	<p>Todo</p>
</div>

<style>
	.content-wrap {
		flex-grow: 1;
	}
</style>
