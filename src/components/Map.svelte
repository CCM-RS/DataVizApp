<script>
	/**
	 * See https://imfeld.dev/writing/domless_svelte_component
	 */
	import Leaflet from './Leaflet.svelte';
	import Marker from './Marker.svelte';
	import Popup from './Popup.svelte';
	import Polyline from './Polyline.svelte';

	import { projectsStore } from '../stores/projects.js';
	import { colorByPhase, iconBySubstance } from '../lib/projects.js';

	let map;
	let markerSize = 48;

	const initialView = [ -30.020949, -51.4108658 ];

	function resizeMap() {
	  if (map) {
			map.invalidateSize();
		}
  }
</script>

<!-- Debug. -->
<!-- <pre>Map.svelte : projects = {JSON.stringify(projects.map(i => i.municipality), null, 2)}</pre> -->

<svelte:window on:resize={resizeMap} />

<Leaflet bind:map view={initialView} zoom={7}>
	{#each $projectsStore as project}
		<Polyline latLngs={project.geometry.coordinates} color={colorByPhase(project)} fill={true}>
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
		</Polyline>
		<Marker latLng={project.geometry.centerPoint} width={markerSize} height={markerSize}>
			<img src="{iconBySubstance(project)}" alt="{project.substancia}" style="width:{markerSize}px;height:{markerSize}px">
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
</Leaflet>

<style>
	dt {
		font-weight: bold;
	}
</style>
