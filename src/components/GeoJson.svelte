<!-- <script context="module">
	import * as geoJsonData from '../../static/data/cache/geo/RS.json'
</script> -->

<script>
  import {
    // createEventDispatcher,
    getContext
    // setContext,
    // onDestroy,
	} from 'svelte';

	// import L from 'leaflet';

	export let geoJsonData;

  let layerGroup = getContext('layerGroup')();
  const L = getContext('getL')();

  L.geoJSON(geoJsonData).addTo(layerGroup);
</script>

<slot />
