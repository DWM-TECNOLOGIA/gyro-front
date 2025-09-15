// bootstrap.js (ou onde você está configurando)
import { BModal, BTooltip, createBootstrap } from 'bootstrap-vue-next'

// Importe os estilos CSS necessários
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

export default {
    install(app) {
        // Registra o Bootstrap Vue
        app.use(createBootstrap())

        // Registra componentes específicos
        app.component('BModal', BModal)
        app.directive('b-tooltip', BTooltip)
    }
}