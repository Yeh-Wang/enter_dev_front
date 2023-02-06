import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import loginView from "@/views/LoginView.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'login',
        component: loginView
    },
    {
        path: '/orgAdm/:id',
        name: 'organization_administrator',
        component: () => import('../views/OrgAdmView.vue'),
        children: [
            {
                path: '/orgInfoManage/:id/:adm_id',
                name: 'organization_info_manage',
                component: () => import('../components/orgInfoManage.vue')
            },
            {
                path: '/stuInfoManage/:id',
                name: 'student_info_manage',
                component: () => import('../components/stuInfoManage.vue')
            },
            {
                path: '/orgTrainingManage/:id/:adm_id',
                name: 'organization_training_manage',
                component: () => import('../components/orgTrainingManage.vue')
            },
            {
                path: '/planResourceConf/:id/:adm_id',
                name: 'plan_resource_conf',
                component: () => import('../components/planResourceConf.vue'),
            }
        ]
    },
    {
        path: '/superAdm/:id',
        name: 'super_adm',
        component: () => import('../views/SuperAdmView.vue')
    },
    {
        path: '/regularAdm/:id',
        name: 'regular_adm',
        component: () => import('../views/RegularUserView.vue')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
