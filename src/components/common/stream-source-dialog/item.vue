<template>
  <div class="item" @click="$emit('selected', source)">
    <img :src="source.thumbnail.toDataURL()" />
    {{ source.id }}
  </div>
</template>
<script>
export default {
  props: ["source"]
};
</script>
