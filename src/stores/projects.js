import { writable } from 'svelte/store';
import * as highlights from '../../static/data/cache/projects/rs/highlights.json';

const initialProjects = highlights.default.projects;
const projectsStore = writable(initialProjects);
const activeFilters = writable(null);

export { projectsStore, initialProjects, activeFilters };
