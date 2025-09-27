import { createApp } from 'vue'
import { vMaska } from "maska/vue"

import App from './App.vue'
import router from './router'
import store from "./store";
import '@/assets/scss/themes.scss'

import bootstrapVue from "./plugins/bootstrap-vue";
import vueMoment from "./plugins/vue-moment";

import TagMasks from "./utils/tagMasks"; // Máscaras

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { useToast } from 'vue-toastification'

const app = createApp(App).directive('maska', vMaska)

app.use(Toast, {
    // Opções globais podem ser definidas aqui
    timeout: 5000,
    position: 'top-right',
    maxToasts: 4,
    newestOnTop: true,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: false,
    draggablePercent: 0,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    rtl: false
})

app.use(router)
app.use(store)
app.use(TagMasks)
app.use(bootstrapVue)
app.use(vueMoment)

app.config.globalProperties.$toast = useToast();

app.mount('#app')
