<template>
  <widget-window
    class="award"
    v-if="register.visible"
    @close="SET_VISIBLE({ name: 'register', visible: false })"
    :position="register.position"
    @moved="UPDATE_POSITION({ name: 'register', position: $event })"
  >
    <el-table :data="featuresList" border style="width: 100%">
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.__nickName || scope.row.__primaryKey }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="onAward(scope.row)">
            奖励
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="toggleForbiddenState(scope.row)"
          >
            {{ scope.row.selfMessage ? "取消禁言" : "禁言" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </widget-window>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import WidgetWindow from "../widget-window";
export default {
  computed: {
    ...mapState("widget", ["register"]),
    ...mapState("workplace", ["featuresList"])
  },
  components: {
    WidgetWindow
  },
  methods: {
    ...mapMutations("widget", ["SET_VISIBLE", "SET_AWARD"]),
    ...mapActions("feature", ["manualControlFeatures"]),
    toggleForbiddenState(data) {
      const userId = data.__primaryKey;
      const status = data.selfMessage;
      this.manualControlFeatures({
        id: userId,
        propName: "selfMessage",
        value: !status
      });
    },
    onAward(row) {
      this.SET_AWARD({
        name: row.__nickName || row.__primaryKey,
        visible: true
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.award {
  width: 800px;
}
</style>
