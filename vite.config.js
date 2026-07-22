import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('.', import.meta.url))
const page = (...p) => resolve(dir, ...p)

export default {
  build: {
    rollupOptions: {
      input: {
        main: page('index.html'),
        blog: page('blog', 'index.html'),
        alemania: page('blog', 'importar-coche-de-alemania-a-espana.html'),
        costes: page('blog', 'cuanto-cuesta-importar-un-coche-de-lujo.html'),
        homologacion: page('blog', 'homologacion-y-matriculacion-coche-importado.html'),
        eeuu: page('blog', 'importar-coche-de-estados-unidos-a-espana.html'),
      },
    },
  },
}
