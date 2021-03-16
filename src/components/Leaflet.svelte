<script>
  import { createEventDispatcher, setContext } from 'svelte';
	import { onMount } from 'svelte';

	import 'leaflet/dist/leaflet.css';
  // import L from 'leaflet';

	let L;
	let map;
	let node;

  export let height = '100%';
  export let width = '100%';

	// Must set either bounds, or view and zoom.
  export let bounds = undefined;
	export let view = undefined;
	export let zoom = undefined;

	export const invalidateSize = () => map.invalidateSize();
	export const getMap = () => map;
	export const getL = () => L;

	const dispatch = createEventDispatcher();

  setContext('layerGroup', getMap);
  setContext('layer', getMap);
  setContext('map', getMap);
  setContext('L', getL);

	$: if (map) {
		if (bounds) {
			map.fitBounds(bounds)
		} else {
			map.setView(view, zoom);
		}
	}

	/**
	 * Component container function.
	 */
  function createLeaflet(el) {
		node = el;

		// Debug.
		// console.log('Leaflet.svelte - createLeaflet()');

    return {
      destroy() {
        if (map) {
					map.remove();
					map = undefined;
      	}
      },
    };
  }

	/**
	 * Implements onMount().
	 *
	 * See https://stackoverflow.com/questions/64632577/svelte-js-with-sapper-ssr-possible-to-make-window-available-for-leaflet-js
	 */
	onMount(async () => {
		const l = await import('leaflet');
		L = l.default;

		// Debug.
		// console.log('Leaflet.svelte - onMount()');

		map = L.map(node).on('zoom', (e) => dispatch('zoom', e));

		if (bounds) {
      map.fitBounds(bounds)
		} else {
			map.setView(view, zoom);
		}

		L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
          &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
        subdomains: 'abcd',
        maxZoom: 14,
      }
    ).addTo(map);
	});

</script>

<style>
  :global(.leaflet-control-container) {
    position: static;
  }
</style>

<div style="height:{height};width:{width}" use:createLeaflet>
  {#if map}
    <slot {map} />
  {/if}
</div>
