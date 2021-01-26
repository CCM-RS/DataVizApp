<script context="module">
	import * as homepage from '../../static/data/entities/config/homepage.json'
</script>

<script>
	import { getContext } from 'svelte';
	const global_data = getContext('global_data');
</script>

<svelte:head>
	<title>{ global_data.site_name }</title>
</svelte:head>

<div>
	<h1>{ homepage.title }</h1>
	<p>wip</p>
</div>
