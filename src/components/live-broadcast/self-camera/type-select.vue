<template>
  <multiselect
    :value="selected"
    ref="select"
    style="height: 100%;width: 100%"
    :searchable="false"
    :options="options"
    :allow-empty="false"
    @select="onSelect"
  >
    <template slot="singleLabel" slot-scope="props"
      ><div class="select-header">
        <span>{{ props.option.title }}</span>

        <span>
          <icon name="angle-down" size="14"></icon>
        </span>
      </div>
    </template>
    <template slot="option" slot-scope="props">
      <div class="select-option">
        {{ props.option.title }}
      </div>
    </template>
  </multiselect>
</template>

<script>
import { Multiselect } from "vue-multiselect";
export default {
  name: "TypeSelect",
  props: {
    selected: {
      require: true
    }
  },
  data() {
    return {
      options: [
        {
          title: "本地",
          type: "local"
        },
        {
          title: "老师",
          type: "teacher"
        }
      ]
    };
  },
  mounted() {
    this.d_selected = this.selected;
  },
  components: {
    Multiselect
  },
  methods: {
    onSelect(value) {
      this.$emit("update:selected", value);
    }
  }
};
</script>

<style scoped lang="scss">
.select-header {
  padding: 0 0.5rem;
  cursor: pointer;
  color: #eeeeee;
  font-size: 12px;
  .svg-icon {
    padding: 0 0.2rem;
    fill: #eeeeee;
  }
}
.select-option {
  z-index: 100;
  font-size: 12px;
  cursor: pointer;
  color: #eeeeee;
  width: 100%;
  padding: 0.2rem 0.5rem;
}
.select-option:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
/deep/ .multiselect:focus {
  outline: none;
}
/deep/ .multiselect__content-wrapper {
  position: absolute;
  z-index: 999;
  border-radius: 1px;
  color: #eeeeee;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.32);
}
/deep/ .multiselect__select {
  float: right;
  color: #eeeeee;
  line-height: 1.8rem;
}
</style>
