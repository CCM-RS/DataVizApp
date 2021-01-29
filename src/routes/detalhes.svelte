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

<h1 class="full-vw">Detalhes dos projetos</h1>
<p><a href="/">← Homepage</a></p>

<div class="projects-list">
	<Projects />
</div>

<style>
	h1 {
		text-align: center;
		font-size: 1.5rem;
	}
	.projects-list {
		padding-top: 2rem;
		padding-bottom: 2rem;
		flex-grow: 1;
	}
</style>
