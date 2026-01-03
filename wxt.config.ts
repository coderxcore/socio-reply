import {defineConfig} from 'wxt';
import manifest from "./manifest";
import vue from '@vitejs/plugin-vue';

// const common: string[] = [];

// See https://wxt.dev/api/config.html
export default defineConfig({
	imports: {
		addons: {
			vueTemplate: true,
		}
	},
	vite: () => ({
		plugins: [
			vue(),
		]
	}),
	outDir: 'dist',
	entrypointsDir: 'src',
	manifestVersion: 3,
	manifest
});
