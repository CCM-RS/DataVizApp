<script context="module">
	// By default, show only projects of "advanced" phases.
	// import * as advancedProjects from '../../static/data/cache/projects/by-phase/1-2-3.json';
</script>

<script>
	/**
	 * See https://imfeld.dev/writing/domless_svelte_component
	 */
	import Leaflet from './Leaflet.svelte';
	import Control from './Control.svelte';
	import Marker from './Marker.svelte';
	import Popup from './Popup.svelte';
	import Polyline from './Polyline.svelte';
	import MapToolbar from './MapToolbar.svelte';

	// Debug.
	// import GeoJson from './GeoJson.svelte';

	// import L from 'leaflet';

	let map;

	const markerLocations = [
		[-30.020949, -51.4108658],
		[-30.9776091, -52.6464844],
		[-29.1521613, -54.1845703],
		[-28.3430649, -51.4160156],
	];

	const lines = markerLocations.slice(1).map((latLng, i) => {
		let prev = markerLocations[i];
		return {
			latLngs: [prev, latLng],
			color: '#000',
		}
	});

	// const initialView = [39.8283, -98.5795];
	const initialView = [-30.020949, -51.4108658];

	let eye = true;
	let showLines = true;

	function resizeMap() {
	  if (map) {
			map.invalidateSize();
		}
  }

	function resetMapView() {
		map.setView(initialView, 7);
	}
</script>

<svelte:window on:resize={resizeMap} />

<!-- <svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin="" />
</svelte:head> -->

<Leaflet bind:map view={initialView} zoom={6}>
	<Control position="topright">
		<MapToolbar bind:eye bind:lines={showLines} on:click-reset={resetMapView} />
	</Control>

	{#if eye}
		{#each markerLocations as latLng}
			<Marker {latLng} width={30} height={30}>
				<svg style="width:30px;height:30px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path></svg>
				<Popup>A popup!</Popup>
			</Marker>
		{/each}
	{/if}

	{#if showLines}
		{#each lines as {latLngs, color}}
			<Polyline {latLngs} {color} opacity={0.5} />
		{/each}
	{/if}

	<!-- Debug. -->
	<!-- <GeoJson /> -->

</Leaflet>
