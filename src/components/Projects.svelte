<!-- <script context="module">
	// import * as data from '../../static/data/cache/projects/rs/all-projects.json';
	import * as data from '../../static/data/cache/projects/rs/highlights.json';
</script> -->

<script>
	// import { writable } from 'svelte/store';
	import Select from 'svelte-select';
	import { colorByPhase } from '../lib/projects.js';

	// const initialProjects = data.projects;
	// const documentsStore = writable([...initialProjects]);

	import { projectsStore } from '../stores/projects.js';
	import { initialProjects } from '../stores/projects.js';

	// {"processo":"810265/2009","id":"{93500A54-5457-49C8-A8B2-D3A8E6585A4B}","numero":"810265","ano":"2009","area-ha":"1,97","fase":"LICENCIAMENTO","ultimo-evento":"742 - LICEN/PRORROGAÇÃO REGISTRO LICENÇA AUTORIZADA EM 21/09/2017","titular":"ANNA M. WALKER","substancia":"CASCALHO","uso":"Construção civil","uf":"RS"}

	let selectItems = [];

	const multiSelectSearchesInKeys = ['fase', 'titular', 'substancia', 'uso', 'municipality'];
	let filterOp = 'and';
	let selectedFilterItems;

	/**
	 * Populates the multi-select field items.
	 */
	const getSelectItems = (docs) => {
		// if (!docs || !docs.length) {
		// 	docs = [...initialProjects];
		// }
		docs.forEach(doc => {
			multiSelectSearchesInKeys.forEach(key => {
				if (key in doc) {
					doc[key].split(',').forEach(val => {
						val = val.trim();
						if (!val.length) {
							return;
						}
						selectItems.push({
							key,
							value: val,
							label: `${val} <span style="color:grey">(${key})</span>`
						});
					});
				}
			});
		});

		// Remove duplicates.
		let seen = {};
		const dedup = selectItems.filter(item =>
			seen.hasOwnProperty(item.label) ? false : (seen[item.label] = true)
		);

		// Sort alphabetically (using translitteration).
		dedup.sort((a, b) => a.value.localeCompare(b.value));

		return dedup;
	};

	/**
	 * Filters results based on the multi-select field current selection.
	 */
	const applySelectFilter = (selectedVal) => {
		if (!selectedFilterItems) {
			clearSelectFilter();
			return;
		}

		// Debug.
		// console.log(`applySelectFilter() : selectedFilterItems (${filterOp}) = ${JSON.stringify(selectedFilterItems.map(v => v.value))}`);

		switch (filterOp) {
			case 'and':
				applySelectFilterAnd();
				break;
			case 'or':
				applySelectFilterOr();
				break;
		}
	};

	/**
	 * Applies "and" filtering for the multi-select field.
	 */
	const applySelectFilterAnd = () => {
		projectsStore.update(currentResults => {
			let newResults = [];

			for (let i = 0; i < initialProjects.length; i++) {
				const result = initialProjects[i];
				let allFilterValuesMatch = true;

				selectedFilterItems.forEach(selectedFilterItem => {
					if (!(selectedFilterItem.key in result) || !result[selectedFilterItem.key].includes(selectedFilterItem.value)) {
						allFilterValuesMatch = false;
					}
				});

				if (allFilterValuesMatch) {
					newResults.push(result);
				}
			}

			return newResults;
		});
	};

	/**
	 * Applies "or" filtering for the multi-select field.
	 */
	const applySelectFilterOr = () => {
		projectsStore.update(currentResults => {
			let newResults = [];

			for (let i = 0; i < initialProjects.length; i++) {
				const result = initialProjects[i];
				let anyFilterValueMatches = false;

				selectedFilterItems.forEach(selectedFilterItem => {
					if (selectedFilterItem.key in result && result[selectedFilterItem.key].includes(selectedFilterItem.value)) {
						anyFilterValueMatches = true;
					}
				});

				if (anyFilterValueMatches) {
					newResults.push(result);
				}
			}

			return newResults;
		});
	};

	/**
	 * Resets results to initially loaded documents.
	 */
  const clearSelectFilter = () => {
		// Debug.
		// console.log(`clearSelectFilter() : (${filterOp}, ${initialProjects.length} results)`);

		projectsStore.set(initialProjects);
	};

	/**
	 * Helper to return value by given key or fallback value if doc has no key.
	 *
	 * fallback value defaults to empty string.
	 */
	const getDocValOr = (doc, key, fallback) => {
		if (!fallback) {
			fallback = '';
		}
		if (!(key in doc)) {
			return fallback;
		}
		return doc[key];
	}

	/**
	 * Sorts results on given key.
	 *
	 * Inverts order if already active.
	 */
	const sortBy = (e, key) => {
		let btn = e.target;
		if (e.target.tagName !== 'BUTTON') {
			btn = e.target.closest('button');
		}

		const isOff = btn.classList.contains('is-off');
		const isAsc = btn.classList.contains('is-asc');
		const isDesc = btn.classList.contains('is-desc');

		let newState;

		switch (key) {
			case 'area_ha':
				if (isOff || isAsc) {
					initialProjects.sort((a, b) => parseFloat(a[key].replace(",", ".")) - parseFloat(b[key].replace(",", ".")));
					newState = 'is-desc';
				} else {
					initialProjects.sort((a, b) => parseFloat(b[key].replace(",", ".")) - parseFloat(a[key].replace(",", ".")));
					newState = 'is-asc';
				}
				break;

			// Sort 1. by phase, and 2. by last modified date.
			case 'fase':
				if (isOff || isAsc) {
					initialProjects.sort((a, b) => {
						if (b['fase_id'] != a['fase_id']) {
							return b['fase_id'] - a['fase_id'];
						}
						return b['modified'] - a['modified'];
					});
					newState = 'is-desc';
				} else {
					initialProjects.sort((a, b) => {
						if (a['fase_id'] != b['fase_id']) {
							return a['fase_id'] - b['fase_id'];
						}
						return a['modified'] - b['modified'];
					});
					newState = 'is-asc';
				}
				break;

			default:
				if (isOff || isDesc) {
					initialProjects.sort((a, b) => getDocValOr(a, key, 'z').localeCompare(getDocValOr(b, key, 'z')));
					newState = 'is-asc';
				} else {
					initialProjects.sort((a, b) => getDocValOr(b, key, 'z').localeCompare(getDocValOr(a, key, 'z')));
					newState = 'is-desc';
				}
				break;
		}

		// Update docs in their new order.
		projectsStore.set(initialProjects);

		// Re-apply active filters (if any).
		if (selectedFilterItems) {
			switch (filterOp) {
				case 'and':
					applySelectFilterAnd();
					break;
				case 'or':
					applySelectFilterOr();
					break;
			}
		}

		// Sync sort links state classes.
		const allSortLinks = Array.from(btn.closest('thead').querySelectorAll('.sort'));

		allSortLinks.forEach(sortLink => {
			sortLink.classList.remove('is-asc', 'is-desc');
			sortLink.classList.add('is-off');
			sortLink.closest('th').classList.remove('is-active');
		});

		btn.classList.remove('is-off');
		btn.classList.add(newState);
		btn.closest('th').classList.add('is-active');
	};
</script>

<div class="filters">
	<form>
		<div class="select">
			<Select items={getSelectItems($projectsStore)} isMulti={true}
				on:select={applySelectFilter}
				on:clear={clearSelectFilter}
				bind:selectedValue={selectedFilterItems}
				>
			</Select>
		</div>
		<div>
			<div class="radio">
				<input type="radio" id="filter-op-or" name="filter-op" value="or"
					bind:group={filterOp}
					on:change={applySelectFilter}
					/>
				<label for="filter-op-or">Or</label>
			</div>
			<div class="radio">
				<input type="radio" id="filter-op-and" name="filter-op" value="and"
					bind:group={filterOp}
					on:change={applySelectFilter}
					/>
				<label for="filter-op-and">And</label>
			</div>
		</div>
	</form>
	<p><strong>{ $projectsStore.length }</strong> results</p>
</div>

<!-- DEBUG -->
<!-- <pre>Projects.svelte : initialProjects = {JSON.stringify(initialProjects, null, 2)}</pre> -->
<!-- <pre>Projects.svelte : $projectsStore = {JSON.stringify($projectsStore, null, 2)}</pre> -->
<!-- <pre>Projects.svelte : filterOp = {JSON.stringify(filterOp, null, 2)}</pre> -->
<!-- <pre>Projects.svelte : $projectsStore.length = {$projectsStore.length}</pre>
<pre>Projects.svelte : initialProjects.length = {initialProjects.length}</pre> -->

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
	form {
		display: flex;
		justify-items: center;
		align-items: center;
	}
	form > * + * {
		padding-left: var(--space-s);
	}
	.select {
		flex-grow: 1;
	}
	.radio,
	.radio > * {
		cursor: pointer;
	}
	.radio {
		display: flex;
	}
	.radio label {
		padding-left: var(--space-s);
	}
	.radio label:hover {
		text-decoration: underline;
	}
	p {
		margin-top: var(--space-s);
	}
	table {
		margin-left: var(--space);
		margin-right: var(--space);
	}
	/* .title {
		display: inline-block;
		word-wrap: break-word;
		max-width: 42ch;
	}
	.desc {
		max-width: 76ch;
	} */
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
