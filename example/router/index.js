import Vue from 'vue';
import Router from 'vue-router';
import routesMap from './map.json';

Vue.use(Router);

let routes = routesMap.map((route) => {
    return {
        path: route.path,
        name: route.name,
        component: require(`../pages/${route.componentName}.md`).default
    };
});

routes.push({
    path: '/', // 根路径，重定向到工作台
    redirect: '/changelog'
});

export default new Router({
    history: false,
    routes: routes
});
