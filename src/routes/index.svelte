<script context="module">
	import * as homepage from '../../static/data/entities/config/homepage.json';
</script>

<script>
	import Map from "../components/Map.svelte";
	import ProjectsFilters from "../components/ProjectsFilters.svelte";
	import { getContext } from 'svelte';

	const global_data = getContext('global_data');
</script>

<svelte:head>
	<title>{ global_data.site_name }</title>
	<meta property="og:title" content="{ homepage.title }">
	<meta property="og:desc" content="{ homepage.desc }">
	<!-- <meta property="og:image" content="{ 'process.env.BASE_URL' + homepage.image ? homepage.image : '/theme/chouette-logo-1200x630.png' }">
	<meta property="og:url" content="{ 'process.env.BASE_URL' + homepage.path ? homepage.path : '' }"> -->
	<!-- <meta name="twitter:card" content="{ homepage.twitter_card ? homepage.twitter_card : 'summary_large_image' }"> -->
	<meta property="og:site_name" content="{ global_data.site_name }">
	<!-- <meta name="twitter:image:alt" content="{ homepage.image_alt ? homepage.image_alt : global_data.site_name }"> -->
</svelte:head>

<header class="content-wrap content-wrap--l">
	<div class="info">
		<h1>{ homepage.title }</h1>
	</div>
	<div class="filters">
		<ProjectsFilters />
	</div>
</header>

<div class="map-wrap">
	<Map />
</div>

<style>
	header {
		display: flex;
		justify-content: center;
	}
	.info,
	.filters {
		padding: var(--space) var(--space-s);
	}
	.filters {
		position: relative;
		z-index: 2;
		flex-grow: 1;
	}
	h1 {
		margin: 0;
		padding: .33rem .4rem .25rem .4rem;
		font-size: 1rem;
		width: 33ch;
	}
	.map-wrap {
		position: relative;
		flex-grow: 1;
		z-index: 1;
	}
	/* :global(.map-wrap > *) {
		position: absolute !important;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	} */
</style>
