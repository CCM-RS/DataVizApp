<script context="module">
	import * as homepage from '../../static/data/entities/config/homepage.json'
</script>

<script>
	import Map from "@anoram/leaflet-svelte";
	import { getContext } from 'svelte';

	const global_data = getContext('global_data');

	let options={
		center: [13,80],
		markers: [
			{
				lat: 13,
				lng: 80
			}
		],
		mapID: "map"
	};
</script>

<svelte:head>
	<title>{ global_data.site_name }</title>
	<meta property="og:title" content="{ homepage.title }">
	<meta property="og:desc" content="{ homepage.desc }">
	<meta property="og:image" content="{ 'process.env.BASE_URL' + homepage.image ? homepage.image : '/theme/chouette-logo-1200x630.png' }">
	<meta property="og:url" content="{ 'process.env.BASE_URL' + homepage.path ? homepage.path : '' }">
	<meta name="twitter:card" content="{ homepage.twitter_card ? homepage.twitter_card : 'summary_large_image' }">
	<meta property="og:site_name" content="{ global_data.site_name }">
	<meta name="twitter:image:alt" content="{ homepage.image_alt ? homepage.image_alt : global_data.site_name }">
</svelte:head>

<div>
	<h1>{ homepage.title }</h1>
	<p>{ homepage.desc }</p>
</div>

<div class="map-wrap">
	<Map {options} />
</div>

<style>
	.map-wrap {
		width: auto;
		min-height: 400px;
	}
</style>
