export default [
    {
        path: '/',
        name: 'menu',
        component: () => import('@/views/index'),
        children: [
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/user/index'),
            }
        ]
    }
]