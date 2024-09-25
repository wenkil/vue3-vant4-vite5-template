import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import postcssPresetEnv from 'postcss-preset-env';
import postCssPxToRem from 'postcss-pxtorem';
import AutoImport from 'unplugin-auto-import/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// 动态计算 rootValue
// const designWidth = 375; // 设计稿宽度
// const rootValue = designWidth / 10; // 1rem = 设计稿宽度 / 10

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd());
	const isReport = env.VITE_REPORT === 'true';

	const visualizerPlugin = visualizer({
		open: true,
		filename: 'dist/stats.html',
		gzipSize: true,
		brotliSize: true,
	})

	const plugins = [
		vue(),
		Components({
			resolvers: [VantResolver()],
		}),
		AutoImport({
			imports: ['pinia', 'vue'],
		}),
		VueI18nPlugin({
			include: path.resolve(__dirname, './src/locales/**'),
		  }),
	]

	// 检查命令行参数中是否包含 --report
	if (isReport) {
		plugins.push(visualizerPlugin);
	}

	return {
		base: env.VITE_BASE_PATH,
		resolve: {
			alias: {
				// 配置src目录
				"@": path.resolve(__dirname, "src"),
			}
		},
		plugins: plugins,
		css: {
			postcss: {
				plugins: [
					postcssPresetEnv(),
					postCssPxToRem({
						rootValue: 37.5,
						propList: ['*'],
						selectorBlackList: ['.norem']
					})
				]
			}
		},
		// 跨域代理
		server: {
			port: 8000,
			proxy: {
				// 选项写法
				'/api': {
					target: 'https://td-talent-uat.ddileaf.com',//UAT
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, 'api')
				}
			},
			hmr: {
				overlay: false // 禁用服务器错误遮罩层，防止错误覆盖整个页面
			},
			host: '0.0.0.0'
		}
	};
});
