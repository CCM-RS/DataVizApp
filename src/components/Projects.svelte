<script context="module">
	import * as data from '../../static/data/cache/parsed-projects.json';
</script>

<script>
	import { writable } from 'svelte/store';
	import Select from 'svelte-select';

	const documents = data.projects;
	const documentsStore = writable([...documents]);

	// {"processo":"810265/2009","id":"{93500A54-5457-49C8-A8B2-D3A8E6585A4B}","numero":"810265","ano":"2009","area-ha":"1,97","fase":"LICENCIAMENTO","ultimo-evento":"742 - LICEN/PRORROGAÇÃO REGISTRO LICENÇA AUTORIZADA EM 21/09/2017","titular":"ANNA M. WALKER","substancia":"CASCALHO","uso":"Construção civil","uf":"RS"}

	let selectItems = [];

	const multiSelectSearchesInKeys = ['fase', 'titular', 'substancia', 'uso'];
	let filterOp = 'and';
	let selectedFilterItems;

	/**
	 * Populates the multi-select field items.
	 */
	const getSelectItems = (docs) => {
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
		documentsStore.update(currentResults => {
			let newResults = [];

			for (let i = 0; i < documents.length; i++) {
				const result = documents[i];
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
		documentsStore.update(currentResults => {
			let newResults = [];

			for (let i = 0; i < documents.length; i++) {
				const result = documents[i];
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
		// console.log(`clearSelectFilter() : (${filterOp}, ${documents.length} results)`);

		documentsStore.set(documents);
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
			case 'area-ha':
				if (isOff || isAsc) {
					documents.sort((a, b) => parseFloat(a[key].replace(",", ".")) - parseFloat(b[key].replace(",", ".")));
					newState = 'is-desc';
				} else {
					documents.sort((a, b) => parseFloat(b[key].replace(",", ".")) - parseFloat(a[key].replace(",", ".")));
					newState = 'is-asc';
				}
				break;

			default:
				if (isOff || isDesc) {
					documents.sort((a, b) => getDocValOr(a, key, 'z').localeCompare(getDocValOr(b, key, 'z')));
					newState = 'is-asc';
				} else {
					documents.sort((a, b) => getDocValOr(b, key, 'z').localeCompare(getDocValOr(a, key, 'z')));
					newState = 'is-desc';
				}
				break;
		}

		// Update docs in their new order.
		documentsStore.set(documents);

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

<form>
	<div class="select">
		<Select items={getSelectItems($documentsStore)} isMulti={true}
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

<p><strong>{ $documentsStore.length }</strong> results</p>

<!-- DEBUG -->
<!-- <pre>ExpChannelsIndex.svelte : documents = {JSON.stringify($documentsStore, null, 2)}</pre> -->
<!-- <pre>ExpChannelsIndex.svelte : filterOp = {JSON.stringify(filterOp, null, 2)}</pre> -->
<!-- <pre>ExpChannelsIndex.svelte : documents = {JSON.stringify(getDocuments(), null, 2)}</pre> -->

<div class="full-vw">
	<table>
		<thead>
			<th class="is-active">
				<button class="sort is-desc" on:click={e => sortBy(e, 'ano')} title="Sort by year">
					<span class="is-asc">↑</span>
					<span class="is-desc">↓</span>
					Ano
				</button>
			</th>
			<th>
				<button class="sort is-off" on:click={e => sortBy(e, 'fase')} title="Sort by phase">
					<span class="is-asc">↑</span>
					<span class="is-desc">↓</span>
					Fase
				</button>
			</th>
			<th>
				<button class="sort is-off" on:click={e => sortBy(e, 'area-ha')} title="Sort by Area (ha)">
					<span class="is-asc">↑</span>
					<span class="is-desc">↓</span>
					Area (ha)
				</button>
			</th>
			<th>
				<button class="sort is-off" on:click={e => sortBy(e, 'processo')} title="Sort by process">
					<span class="is-asc">↑</span>
					<span class="is-desc">↓</span>
					Processo
				</button>
			</th>
			<th>
				<button class="sort is-off" on:click={e => sortBy(e, 'ultimo-evento')} title="Sort by last event">
					<span class="is-asc">↑</span>
					<span class="is-desc">↓</span>
					Ultimo Evento
				</button>
			</th>
			<th>
				<button class="sort is-off" on:click={e => sortBy(e, 'titular')} title="Sort by titular">
					<span class="is-asc">↑</span>
					<span class="is-desc">↓</span>
					Titular
				</button>
			</th>
			<th>
				<button class="sort is-off" on:click={e => sortBy(e, 'substancia')} title="Sort by substance">
					<span class="is-asc">↑</span>
					<span class="is-desc">↓</span>
					Substancia
				</button>
			</th>
			<th>
				<button class="sort is-off" on:click={e => sortBy(e, 'uso')} title="Sort by usage">
					<span class="is-asc">↑</span>
					<span class="is-desc">↓</span>
					Uso
				</button>
			</th>
		</thead>
		<tbody>
		{#each $documentsStore as doc, i}
			<tr>
				<td>{ doc.ano || '' }</td>
				<td>{ doc.fase || '' }</td>
				<td>{ doc['area-ha'] || '' }</td>
				<td>{ doc.processo || '' }</td>
				<td>{ doc['ultimo-evento'] || '' }</td>
				<td>{ doc.titular || '' }</td>
				<td>{ doc.substancia || '' }</td>
				<td>{ doc.uso || '' }</td>
			</tr>
		{/each}
		</tbody>
	</table>
</div>

<style>
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
</style>
