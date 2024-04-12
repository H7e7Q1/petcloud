import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";

import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, "src")
		}
	},
	server: {
		host: '0.0.0.0',
		port: 9527,
		proxy: {
			'/api': {
				target: 'https://212j1413x1.vicp.fun/',
				changeOrigin: true
				// rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
