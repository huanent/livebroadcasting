<template>
  <widget-window
    class="award"
    v-if="register.visible"
    nameWidget="花名册"
    @close="SET_VISIBLE({ name: 'register', visible: false })"
    :position="register.position"
    @moved="UPDATE_POSITION({ name: 'register', position: $event })"
  >
    <el-table :data="featuresList" style="width: 100%">
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
            class="forbid-btn"
            type="text"
            size="small"
            @click="toggleForbiddenState(scope.row)"
          >
            {{ scope.row.selfMessage ? "禁止发言" : "取消禁言" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </widget-window>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import WidgetWindow from "../WidgetWindow";
export default {
  name: "Register",
  computed: {
    ...mapState("widget", ["register"]),
    ...mapState("workplace", ["featuresList"]),
  },
  components: {
    WidgetWindow,
  },
  methods: {
    ...mapMutations("widget", ["SET_VISIBLE", "SET_AWARD"]),
    ...mapActions("features", ["manualControlFeatures"]),
    toggleForbiddenState(data) {
      const userId = data.__primaryKey;
      const status = data.selfMessage;
      this.manualControlFeatures({
        id: userId,
        propName: "selfMessage",
        value: !status,
      });
    },
    onAward(row) {
      this.SET_AWARD({
        name: row.__nickName || row.__primaryKey,
        visible: true,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.award {
  width: 750px;
  background-color: white;
  padding: 0 24px 24px;
  /deep/ header {
    color: #1a1b29;
  }
  /deep/ .el-table {
    font-size: 0.875rem;
    thead th {
      font-size: 0.875rem;
      font-weight: 400;
      color: #8a8a99;
      padding: 7px 0;
      border-bottom: 0 none;
    }
    td {
      font-size: 0.875rem;
      font-weight: 400;
      color: #1a1b29;
      line-height: 1.1875rem;
      padding: 17px 0;
      border-bottom-color: #ebebf0;
    }
    th > .cell,
    td > .cell {
      padding-left: 0;
      padding-right: 0;
    }
    .el-button {
      font-size: 0.875rem;
      + .el-button {
        margin-left: 24px;
      }
    }
    .forbid-btn {
      color: #FF331F;
    }
  }
}
</style>
