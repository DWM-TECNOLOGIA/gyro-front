import { createStore } from 'vuex'

// Função para carregar módulos com Vite
const loadModules = () => {
	const modules = {}
	const moduleFiles = import.meta.glob('./modules/**/index.js', { eager: true })

	Object.keys(moduleFiles).forEach((filePath) => {
		// Extrai o nome do módulo do caminho do arquivo
		const moduleName = filePath.replace('./modules/', '').replace('/index.js', '')

		// Obtém o conteúdo do módulo
		const moduleContent = moduleFiles[filePath].default

		if (moduleContent) {
			modules[moduleName] = moduleContent
			modules[moduleName].namespaced = true
		}
	})

	return modules
}

export default createStore({
	state: {},
	mutations: {},
	actions: {},
	modules: loadModules()
})