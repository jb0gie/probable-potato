import { defineConfig } from "vite"

export default defineConfig({
	base: "/probable-potato/",
	plugins: [],
	esbuild: {
		jsxImportSource: "webjsx",
	},
})
