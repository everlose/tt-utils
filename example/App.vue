<template>
    <div id="app">
        <router-view/>
        {{ time | formatTime('YYYY-MM-DD') }}
        {{ time1 }}
        {{ time2 }}
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: 'app',
    data () {
        return {
            time: new Date(),
            time1: new Date(),
            time2: new Date()
        };
    },
    created() {
        this.time1 = Vue.formatTime(this.time1, 'YYYY-MM-DD');
        this.time2 = this.$formatTime(this.time2, 'YYYY-MM-DD');
    }
}
</script>

<style>
@import 'highlight.js/styles/github.css';
</style>
