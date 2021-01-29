<script context="module">
	import * as homepage from '../../static/data/entities/config/homepage.json'
</script>

<script>
	// Workaround : a dependency is using a direct reference to window.
	// import Map from "../components/Map.svelte";
	import { getContext } from 'svelte';
	import { onMount } from 'svelte'

	const global_data = getContext('global_data');

	// Workaround : a dependency is using a direct reference to window.
	let mounted = false;
	onMount(async ()=>{
		mounted = true;
	})
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

<h1 class="full-vw">{ homepage.title }</h1>
<p>{ homepage.desc }</p>

<div class="map-wrap full-vw">
	<!-- Workaround : a dependency is using a direct reference to window. -->
	{#if mounted}
		{#await import("../components/Map.svelte") then m}
			<svelte:component this="{m.default}" />
		{/await}
	{/if}
</div>

<style>
	h1 {
		text-align: center;
		font-size: 1.5rem;
	}
	.map-wrap {
		position: relative;
		flex-grow: 1;
	}
	:global(.map-wrap > *) {
		position: absolute !important;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
</style>
