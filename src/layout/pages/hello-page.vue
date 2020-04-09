<template>
    <div class="main-container">
        {{ msg }}
        {{ $t("login") }}
        <img src="../../assets/1.png" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "hello-page",
    data() {
        return { msg: "hello-page" };
    },
<<<<<<< HEAD
    mounted () {
        console.log(this.token)
        console.log('123')
    },
    computed: {
        ...mapGetters("account", ["token"]),
    }
=======
    mounted() {
        console.log("test");
    },
>>>>>>> ed950e77da638a27d3eca96ea91bb30318b3437a
};
</script>

<style scoped lang="scss">
.main-container {
    background-color: $kb-navy;
}
</style>
