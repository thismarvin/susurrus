import { terser } from "rollup-plugin-terser";

export default [
	{
		input: "./build/susurrus.js",
		output: [
			{
				format: "umd",
				name: "Susurrus",
				file: "dist/susurrus.js",
			},
			{
				format: "umd",
				name: "Susurrus",
				file: "dist/susurrus.min.js",
				plugins: [terser()],
			},
			{
				format: "esm",
				file: "dist/susurrus.mjs",
			},
		],
	},
];
