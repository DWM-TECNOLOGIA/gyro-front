<template>
  <div class="reusable-table">
    <b-card :title="title" class="mb-4">
      <b-table
        striped
        hover
        responsive
        :items="formattedItems"
        :fields="computedFields"
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        @row-clicked="handleRowClick"
        variant="dark"
      >
        <!-- Slot para avatar personalizado -->
        <template v-for="field in avatarFields" #[`cell(${field.key})`]="data" :key="field.key">
          <div class="avatar-cell" :key="field.key">
            <img
              v-if="data.value"
              :src="data.value"
              :alt="`Avatar de ${data.item[field.nameField || 'name']}`"
              class="avatar-img"
            />
            <div v-else class="avatar-default">
              <MdiUserCircle />
            </div>
          </div>
        </template>

        <!-- Slot para ações -->
        <template #cell(actions)="data">
          <slot name="actions" v-bind="data"></slot>
        </template>
      </b-table>

      <!-- Botão Carregar Mais -->
      <div class="d-flex justify-content-center mt-4" v-if="hasNextPage">
        <b-button variant="outline-primary" @click="$emit('load-more')" :disabled="loading">
          <b-spinner small v-if="loading" class="me-2"></b-spinner>
          Carregar mais
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import MdiUserCircle from '~icons/mdi/user-circle'

export default {
  name: 'ReusableTable',
  components: { MdiUserCircle },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    fields: {
      type: Array,
      required: true,
      validator: (value) => value.every((col) => typeof col.key === 'string' && typeof col.label === 'string'),
    },
    hasNextPage: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showDetails: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Lista de Itens',
    },
    avatarFieldsConfig: {
      type: Array,
      default: () => [],
      validator: (value) => value.every((field) => typeof field.key === 'string'),
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      sortBy: null,
      sortDesc: false,
    }
  },
  computed: {
    // Separa os campos de avatar dos campos normais
    avatarFields() {
      return this.avatarFieldsConfig.map((config) => ({
        key: config.key,
        nameField: config.nameField || 'name',
      }))
    },

    // Filtra os campos normais (não-avatar)
    normalFields() {
      return this.fields.filter(
        (field) => !this.avatarFieldsConfig.some((avatarField) => avatarField.key === field.key),
      )
    },

    // Combina todos os campos com formatação apropriada
    computedFields() {
      const fields = this.avatarFields.map((field) => ({
        key: field.key,
        label: this.fields.find((f) => f.key === field.key)?.label || 'Avatar',
        sortable: false,
        class: 'avatar-column',
      }))

      this.normalFields.forEach((field) => {
        fields.push({
          key: field.key,
          label: field.label,
          sortable: true,
          formatter: field.formatter,
        })
      })

      // Adiciona a coluna de ações apenas se ela não existir nos fields originais
      const hasActionsColumn = this.fields.some((field) => field.key === 'actions')
      if (!hasActionsColumn) {
        fields.push({
          key: 'actions',
          label: '',
          sortable: false,
        })
      }

      return fields
    },

    // Aplica os formatadores aos itens
    formattedItems() {
      return this.items.map((item) => {
        const formattedItem = { ...item }
        this.normalFields.forEach((field) => {
          if (field.formatter && this.$root[field.formatter]) {
            formattedItem[field.key] = this.$root[field.formatter](item[field.key])
          }
        })
        return formattedItem
      })
    },
  },
  methods: {
    toggleDetails(row) {
      row.toggleDetails()
      this.$emit('details-clicked', row.item)
    },
    handleRowClick(item) {
      this.$emit('row-clicked', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.reusable-table {
  margin: 20px 0;

  :deep(.avatar-column) {
    width: 60px;
    color: transparent;
  }

  :deep(td) {
    vertical-align: middle;
  }

  :deep(.card-body) {
    padding: 16px !important;
  }
}

.avatar-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-default {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
