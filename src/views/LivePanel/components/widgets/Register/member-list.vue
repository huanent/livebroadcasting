<template>
  <el-table
    class="member-table"
    :data="featuresList"
    style="width: 100%"
    :show-header="false"
  >
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
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "MemberList",
  computed: {
    ...mapState("workplace", ["featuresList"]),
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
      console.log("scope.row", row);
      this.SET_AWARD({
        name: row.__nickName || row.__primaryKey,
        visible: true,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.member-table {
  background-color: transparent;
  @include themeify {
    color: themed("font_color1");
  }
  .el-button--text {
    @include themeify {
      color: themed("font_color1");
    }
  }
  &:before {
    display: none;
  }
  /deep/ {
    .el-table__body tr:hover > td {
      background-color: transparent;
    }
    th,
    tr,
    td {
      background-color: transparent;
    }
    td {
      padding: 7px 0;
      border-bottom-color: transparent;
    }
    .el-table_1_column_2 {
      text-align: right;
    }
    .cell {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
}
</style>
