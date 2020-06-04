<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
export default {
  props: ["stream", "status"],
  data() {
    return {
      asnimationFrameCancelId: null
    };
  },
  methods: {
    initWave(stream) {
      let audioContext = new AudioContext();

      let analyser = audioContext.createAnalyser();
      let mediaStreamSource = audioContext.createMediaStreamSource(stream);
      mediaStreamSource.connect(analyser);
      analyser.fftSize = 2048;
      let bufferLength = analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);
      let canvas = this.$refs.canvas;
      let canvasCtx = canvas.getContext("2d");
      let me = this;
      function draw() {
        cancelAnimationFrame(me.asnimationFrameCancelId || 0);
        me.asnimationFrameCancelId = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgba(10, 129, 140)";

        canvasCtx.beginPath();

        let sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0;
          let y = (v * canvas.height) / 2;
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }

      draw();
    }
  },
  watch: {
    stream(value) {
      if (value) this.initWave(value);
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.asnimationFrameCancelId || 0);
  }
};
</script>
<style lang="scss" scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
