import Vue from 'vue'
import Router from 'vue-router'
import formatTime from '@/pages/formatTime.md'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/formatTime',
            name: 'formatTime',
            component: formatTime
        },
        {
            path: '/',
            redirect: '/formatTime'
        }
    ]
});
