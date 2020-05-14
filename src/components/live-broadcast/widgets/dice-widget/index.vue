<template>
  <widget-window @close="SET_DICE_VISIBLE(false);dd()" v-if="diceWidget.visible" nameWidget="骰子">
    <transition>
      <div class="dice">
        <div id="content" ref="dice" @click="btn" :class="test">
          <!-- 第一个筛子 -->
          <div>
            <span></span>
          </div>

          <!-- 第二个筛子 -->
          <div>
            <span></span>
            <span></span>
          </div>

          <!-- 第三个筛子 -->
          <div>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <!-- 第四个 -->

          <div>
            <div>
              <span></span>
              <span></span>
            </div>
            <div>
              <span></span>
              <span></span>
            </div>
          </div>
          <!-- 第五个 -->
          <div>
            <div>
              <span></span>
              <span></span>
            </div>
            <div>
              <span></span>
            </div>
            <div>
              <span></span>
              <span></span>
            </div>
          </div>

          <!-- 第六个-->
          <div>
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </widget-window>
</template>
<script>
import WidgetWindow from "../widget-window";
import { mapState, mapMutations, mapGetters } from "vuex";
import { ROLE } from "@/store/account";
export default {
  data() {
    return {
      test: "",
      num:0
    };
  },
  components: {
    WidgetWindow
  },
  computed: {
    ...mapState("workplace", ["diceWidget"]),
    ...mapState("account", ["role"])
  },
  methods: {
    dd(){
      this.num=0;
      this.test="";
    },
    btn() {
      var num = parseInt(1 + Math.random() * 6);
      function sf(){
         return num = parseInt(1 + Math.random() * 6);
      }
      if(this.num==num){
        num = sf();
      }
      this.num=num
      // if(num==6||this.num==num){
      //   this.num=(--num)==0?parseInt(1 + Math.random() * 6):num;
      // }else{
      //  this.num=num
      // }
       console.log(num);
      if (num == 1) {
        this.test = "test";
      } else if (num == 2) {
        this.test = "testa";
      } else if (num == 3) {
        this.test = "testb";
      } else if (num == 4) {
        this.test = "testc";
      } else if(num==5){
        this.test = "testd";
      }else{
        this.test = "teste";

      }
    },
    ...mapMutations("workplace", ["SET_DICE_VISIBLE"])
  },
  watch: {},
  created() {}
};
</script>
<style lang="scss" scoped>
.dice {
  width: 600px;
  height:600px;
  background: #54555d;
  #content {
    width: 134px;
    height: 134px;
    transform-style: preserve-3d;
    transform: rotateY(30deg) rotateX(-20deg);
  }

  #content > div {
    width: 100px;
    height: 100px;
    padding: 15px;
    display: flex;
    background: #fff;
    border-radius: 15px;
    position: absolute;
    /* box-shadow: 2px 1px 5px #333; */
    border: 2px solid #eee;
  }

  #content span {
    width: 25px;
    height: 25px;
    display: block;
    border-radius: 50%;
    background: #c33;
  }

  /* 1 */
  #content > div:nth-child(1) {
    justify-content: center;
    align-items: center;
    transform: translateZ(65px);
  }

  /* 2 */
  #content > div:nth-child(2) {
    justify-content: space-between;
    align-items: center;
    transform: translateZ(-65px);
  }

  /* 3 */
  #content > div:nth-child(3) {
    justify-content: space-between;
    transform: rotateX(90deg) translateZ(65px);
  }

  #content > div:nth-child(3) span:nth-child(2) {
    align-self: center;
  }

  #content > div:nth-child(3) span:nth-child(3) {
    align-self: flex-end;
  }

  /* 4 */
  #content > div:nth-child(4) {
    transform: rotateX(90deg) translateZ(-65px);
    justify-content: space-between;
  }

  #content > div:nth-child(4) div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* 5 */
  #content > div:nth-child(5) {
    transform: rotateY(90deg) translateZ(65px);
    justify-content: space-between;
  }

  #content > div:nth-child(5) div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  #content > div:nth-child(5) div:nth-child(2) {
    justify-content: center;
  }

  /* 6 */
  #content > div:nth-child(6) {
    transform: rotateY(90deg) translateZ(-65px);
    justify-content: space-between;
  }

  #content > div:nth-child(6) div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

@keyframes move1 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  20% {
    transform: rotateY(3600deg) rotateX(3600deg);
  }

  90% {
    transform: rotateY(3600deg) rotateX(3600deg);
  }

  100% {
    transform: rotateY(30deg) rotateX(-20deg);
  }
}

@keyframes move2 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  20% {
    transform: rotateY(3510deg) rotateX(3600deg);
  }

  90% {
    transform: rotateY(3510deg) rotateX(3600deg);
  }

  100% {
    transform: rotateY(30deg) rotateX(-20deg);
  }
}

@keyframes move3 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  20% {
    transform: rotateY(3690deg) rotateX(3600deg);
  }

  90% {
    transform: rotateY(3690deg) rotateX(3600deg);
  }

  100% {
    transform: rotateY(30deg) rotateX(-20deg);
  }
}

@keyframes move4 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  20% {
    transform: rotateY(3780deg) rotateX(3600deg);
  }

  90% {
    transform: rotateY(3780deg) rotateX(3600deg);
  }

  100% {
    transform: rotateY(30deg) rotateX(-20deg);
  }
}

@keyframes move5 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  20% {
    transform: rotateY(3600deg) rotateX(3690deg);
  }

  90% {
    transform: rotateY(3600deg) rotateX(3690deg);
  }

  100% {
    transform: rotateY(30deg) rotateX(-20deg);
  }
}

@keyframes move6 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  20% {
    transform: rotateY(3600deg) rotateX(3510deg);
  }

  90% {
    transform: rotateY(3600deg) rotateX(3510deg);
  }

  100% {
    transform: rotateY(30deg) rotateX(-20deg);
  }
}
.test {
  animation: move1 5s ease-in-out 1;
}
.testa {
  animation: move2 5s ease-in-out 1;
}
.testb {
  animation: move3 5s ease-in-out 1;
}
.testc {
  animation: move4 5s ease-in-out 1;
}

.testd {
  animation: move5 5s ease-in-out 1;
}
.teste {
  animation: move6 5s ease-in-out 1;
}
</style>
