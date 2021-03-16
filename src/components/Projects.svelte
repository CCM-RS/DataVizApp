<script>
	import { colorByPhase } from '../lib/projects.js';
	import { projectsStore } from '../stores/projects.js';
	import { initialProjects } from '../stores/projects.js';
	import ProjectsFilters from './ProjectsFilters.svelte';

	// {"processo":"810265/2009","id":"{93500A54-5457-49C8-A8B2-D3A8E6585A4B}","numero":"810265","ano":"2009","area-ha":"1,97","fase":"LICENCIAMENTO","ultimo-evento":"742 - LICEN/PRORROGAÇÃO REGISTRO LICENÇA AUTORIZADA EM 21/09/2017","titular":"ANNA M. WALKER","substancia":"CASCALHO","uso":"Construção civil","uf":"RS"}

	let sortBy;
</script>

<!-- DEBUG -->
<!-- <pre>Projects.svelte : initialProjects = {JSON.stringify(initialProjects, null, 2)}</pre> -->
<!-- <pre>Projects.svelte : $projectsStore = {JSON.stringify($projectsStore, null, 2)}</pre> -->
<!-- <pre>Projects.svelte : filterOp = {JSON.stringify(filterOp, null, 2)}</pre> -->
<!-- <pre>Projects.svelte : $projectsStore.length = {$projectsStore.length}</pre>
<pre>Projects.svelte : initialProjects.length = {initialProjects.length}</pre> -->

<div class="filters">
	<ProjectsFilters bind:sortBy />
</div>

<table>
	<thead>
		<th>
			<button class="sort is-off" on:click={e => sortBy(e, 'municipality')} title="Ordenar por Municipio">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Municipio
			</button>
		</th>
		<th class="is-active">
			<button class="sort is-desc" on:click={e => sortBy(e, 'modified')} title="Ordenar por Data do Ultimo Evento">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Modificado
			</button>
		</th>
		<th>
			<button class="sort is-off" on:click={e => sortBy(e, 'fase')} title="Ordenar por Fase">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Fase
			</button>
		</th>
		<th>
			<button class="sort is-off" on:click={e => sortBy(e, 'area_ha')} title="Ordenar por Area (ha)">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Area (ha)
			</button>
		</th>
		<th>
			<button class="sort is-off" on:click={e => sortBy(e, 'ultimo_evento')} title="Ordenar por Ultimo Evento">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Ultimo Evento
			</button>
		</th>
		<th>
			<button class="sort is-off" on:click={e => sortBy(e, 'titular')} title="Ordenar por Titular">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Titular
			</button>
		</th>
		<th>
			<button class="sort is-off" on:click={e => sortBy(e, 'substancia')} title="Ordenar por Substancia">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Substancia
			</button>
		</th>
		<th>
			<button class="sort is-off" on:click={e => sortBy(e, 'uso')} title="Ordenar por Uso">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Uso
			</button>
		</th>
		<th>
			<button class="sort is-off" on:click={e => sortBy(e, 'processo')} title="Ordenar por Processo">
				<span class="is-asc">↑</span>
				<span class="is-desc">↓</span>
				Processo
			</button>
		</th>
	</thead>
	<tbody>
	{#each $projectsStore as doc, i}
		<tr>
			<!-- <td>{ doc.ano || '' }</td> -->
			<td>{ doc.municipality || '' }</td>
			<td>{ doc.modified || '' }</td>
			<td>
				<span class="phase">
					<span class="color-square" style="background-color:{ colorByPhase(doc) }"></span>
					<span class="label">{ doc.fase || '' }</span>
				</span>
			</td>
			<td>{ doc.area_ha || '' }</td>
			<td>{ doc.ultimo_evento || '' }</td>
			<td>{ doc.titular || '' }</td>
			<td>{ doc.substancia || '' }</td>
			<td>{ doc.uso || '' }</td>
			<td>{ doc.processo || '' }</td>
		</tr>
	{/each}
	</tbody>
</table>

<style>
	.filters {
		margin: 0 auto var(--space) auto;
		width: var(--content-width);
	}
	.sort {
		display: flex;
		cursor: pointer;
	}
	.sort > span {
		padding-right: var(--space-s);
	}
	:global(
		table .sort.is-off .is-asc,
		table .sort.is-off .is-desc
	) {
		display: none;
	}
	:global(table .sort.is-asc .is-desc) {
		display: none;
	}
	:global(table .sort.is-desc .is-asc) {
		display: none;
	}
	/* th:hover,
	th:focus, */
	:global(table th.is-active) {
		background-color: cornflowerblue;
		color: white;
		font-weight: bold;
	}
	:global(table th.is-active button) {
		color: inherit;
	}
	.phase {
		display: flex;
		align-items: center;
	}
	.phase > .color-square {
		min-width: 3.5ch;
		min-height: 3.5ch;
	}
	.phase > .label {
		padding-left: 1ch;
	}
</style>
