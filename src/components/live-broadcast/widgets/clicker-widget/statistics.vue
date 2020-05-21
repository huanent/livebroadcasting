<template>
  <div>
    统计答题情况
    <ul>
      <li v-for="(item, index) in clicker.statistics" :key="index">
        <div>
          <h1>
            {{ item.__nickName || item.__primaryKey }} 答案：{{
              getAnswer(item.result)
            }}
          </h1>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("widget", ["clicker"])
  },
  methods: {
    getAnswer(result) {
      return result.map(m => String.fromCharCode(m + 65)).join(",");
    }
  }
};
</script>
