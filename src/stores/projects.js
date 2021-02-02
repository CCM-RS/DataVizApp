import { writable } from 'svelte/store';
import * as highlights from '../../static/data/cache/projects/highlights.json';

export const projectsStore = writable(highlights.default);
