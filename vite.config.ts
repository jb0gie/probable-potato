import UnoCSS from "unocss/vite"
import { defineConfig } from "vite"

export default defineConfig({
	base: "/probable-potato/",
	plugins: [UnoCSS()],
	esbuild: {
		jsxImportSource: "webjsx",
	},
})
