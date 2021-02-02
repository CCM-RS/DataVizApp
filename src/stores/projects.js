import { writable } from 'svelte/store';
import * as highlights from '../../static/data/cache/projects/rs/highlights.json';

export const projectsStore = writable(highlights.default);
