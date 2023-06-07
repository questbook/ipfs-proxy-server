//generated file, run 'yarn generate:routes-index' to update

export default {
	cat: async() => (await import('./cat')).default,
	version: async() => (await import('./version')).default,
}