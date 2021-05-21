<script>
	import Projects from "../components/Projects.svelte";
	import { getContext } from 'svelte';
	const global_data = getContext('global_data');
</script>

<svelte:head>
	<title>Detalhes dos projetos | { global_data.site_name }</title>
	<meta property="og:title" content="Detalhes dos projetos | { global_data.site_name }">
	<meta property="og:desc" content="Lista dos projetos">
	<meta property="og:site_name" content="{ global_data.site_name }">
</svelte:head>

<div class="content-wrap">
	<h1>Detalhes dos projetos</h1>
	<a href="/">→ Ver no 🗺️ mapa</a>
</div>

<div class="projects-list">
	<Projects />
</div>

<style>
	a {
		text-decoration: none;
	}
	.projects-list {
		flex-grow: 1;
	}
</style>
