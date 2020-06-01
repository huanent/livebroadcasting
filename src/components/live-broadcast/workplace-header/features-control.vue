<template>
  <el-dialog
    :title="'features-control'"
    :visible.sync="featuresControlVisible"
    :append-to-body="true"
    @close="closeDialog"
    class="features-control"
  >
    <div class="features-control-content">
      <el-card
        class="box-card"
        v-for="(item, index) in featuresList"
        :key="index"
      >
        <el-form ref="form" label-width="300px">
          <el-form-item label="name">
            <span>{{ item.__primaryKey }}</span>
          </el-form-item>

          <el-form-item
            v-for="(feature, i) in featureList"
            :label="feature.name"
            :key="index + '_' + i"
          >
            <el-switch
              v-if="feature.kind === 'boolean'"
              :value="item[feature.propName]"
              @input="onInput($event, feature.propName, item, index)"
              active-text="ON"
              inactive-text="OFF"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-dialog>
</template>

<script>
import { liveBroadcastService } from "../../../core/live-broadcast";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "FeaturesControl",
  props: {
    visible: Boolean
  },
  data() {
    return {};
  },
  filters: {
    transform(value) {}
  },
  methods: {
    ...mapMutations("workplace", ["STUDENT_FEATURES_LIST_BY_USERID"]),
    ...mapActions("features", ["manualControlFeatures"]),
    closeDialog() {
      this.$emit("update:visible", false);
    },
    onInput(e, propName, item, index) {
      this.manualControlFeatures({
        id: item.__primaryKey,
        propName: propName,
        value: e
      });
    }
  },
  computed: {
    ...mapState("workplace", ["featuresList"]),
    featuresControlVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    },

    featureList() {
      let result = [];
      for (let i in this.$store.state.features) {
        if (i !== "timestamp" || i !== "timestamp") {
          let item = this.$store.state.features[i];
          let ob = {};
          ob.name = i;
          ob.propName = i;
          let kind = typeof item;
          ob.kind = kind;
          result.push(ob);
        }
      }

      return result;
    }
  }
};
</script>

<style scoped lang="scss">
.features-control {
  min-height: 30vh;
}
</style>
