<script context="module">
	import * as global_data from '../../static/data/entities/config/globals.json';
</script>

<script>
	import { setContext } from 'svelte';
	import Nav from '../components/Nav.svelte';

	export let segment;

	const globals = global_data.default;
	setContext('global_data', globals);
</script>

<Nav {segment} />

<slot></slot>
