<script lang="ts" setup>
const props = defineProps({
  action: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false
  }
})

const emits = defineEmits(['tofirstpage', 'toprevpage', 'tonextpage', 'tolastpage'])

const changePage = () => {
  if (props.action == 'tofirstpage') emits('tofirstpage')
  if (props.action == 'toprevpage') emits('toprevpage')
  if (props.action == 'tonextpage') emits('tonextpage')
  if (props.action == 'tolastpage') emits('tolastpage')
}
</script>

<template>
  <u-button
    :icon="props.icon"
    size="xs"
    color="neutral"
    variant="ghost"
    :disabled="props.disabled"
    @click="changePage"
  />
</template>

<style></style>
