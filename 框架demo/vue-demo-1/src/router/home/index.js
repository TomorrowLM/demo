export default [
    {
        path: '/',
        name: 'menu',
        component: () => import('@/views/index'),
        children: [
            {
                path: 'learn',
                name: 'learn',
                component: () => import('@/views/home/index'),
                children: [
                    {
                        path: 'jumpApp',
                        name: 'jumpApp',
                        component: () => import('@/views/home/case/jumpApp')
                    }
                ]
            }
        ]
    }
]