<template>
  <div class="item" @click="$emit('selected', source)" :title="source.title">
    <img :src="source.thumbnail.toDataURL()" />
    {{ source.name }}
  </div>
</template>
<script>
export default {
  props: ["source"]
};
</script>
