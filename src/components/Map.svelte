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

	import { colorByPhase } from '../lib/projects.js';

	// Debug.
	// import GeoJson from './GeoJson.svelte';

	// import L from 'leaflet';

	export let projects;

	let map;
	let markerSize = 24;

	// const markerLocations = [
	// 	[-30.020949, -51.4108658],
	// 	[-30.9776091, -52.6464844],
	// 	[-29.1521613, -54.1845703],
	// 	[-28.3430649, -51.4160156],
	// ];

	// const lines = markerLocations.slice(1).map((latLng, i) => {
	// 	let prev = markerLocations[i];
	// 	return {
	// 		latLngs: [prev, latLng],
	// 		color: '#000',
	// 	}
	// });

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

<!-- Debug. -->
<!-- <pre>Map.svelte : projects = {JSON.stringify(projects, null, 2)}</pre> -->

<svelte:window on:resize={resizeMap} />

<!-- <svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin="" />
</svelte:head> -->

<Leaflet bind:map view={initialView} zoom={7}>
	<Control position="topright">
		<MapToolbar bind:eye bind:lines={showLines} on:click-reset={resetMapView} />
	</Control>

	{#if eye}
		{#each projects as project}
			<Polyline latLngs={project.geometry.coordinates} color={colorByPhase(project)} fill={true} fillOpacity={100} />
		{/each}
	{/if}

	{#if showLines}
		{#each projects as project}
			<Marker latLng={project.geometry.centerPoint} width={markerSize} height={markerSize}>
				<svg style="width:{markerSize}px;height:{markerSize}px" fill="none" stroke="{colorByPhase(project)}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path></svg>
				<Popup>
					<dl>
						<dt>Municipio</dt>
						<dd>{project.municipality}</dd>
						<dt>Modificado</dt>
						<dd>{project.modified}</dd>
						<dt>Fase</dt>
						<dd>{project.fase}</dd>
						<dt>Area (ha)</dt>
						<dd>{project.area_ha}</dd>
						<dt>Ultimo evento</dt>
						<dd>{project.ultimo_evento}</dd>
						<dt>Titular</dt>
						<dd>{project.titular}</dd>
						<dt>Substancia</dt>
						<dd>{project.substancia}</dd>
						<dt>Uso</dt>
						<dd>{project.uso}</dd>
						<dt>Processo</dt>
						<dd>{project.processo}</dd>
					</dl>
				</Popup>
			</Marker>
		{/each}
	{/if}

	<!-- {#if eye}
		{#each markerLocations as latLng}
			<Marker {latLng} width={30} height={30}>
				<svg style="width:30px;height:30px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path></svg>
				<Popup>A popup!</Popup>
			</Marker>
		{/each}
	{/if}

	{#if showLines}
		{#each lines as {latLngs, color}}
			<Polyline {latLngs} {color} opacity={0.5}>
				<Popup>Another popup!</Popup>
			</Polyline>
		{/each}
	{/if} -->

	<!-- Debug. -->
	<!-- <GeoJson /> -->

</Leaflet>

<style>
	dt {
		font-weight: bold;
	}
</style>
