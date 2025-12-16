import {defineConfig} from 'wxt';
import manifest from "./manifest";
import vue from '@vitejs/plugin-vue';

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
		],
	}),
	dev: {
		server: {
			host: '0.0.0.0',
			//  host: '172.15.0.2',
		}
	},
	outDir: 'dist',
	entrypointsDir: 'src',
	manifestVersion: 3,
	manifest,
});