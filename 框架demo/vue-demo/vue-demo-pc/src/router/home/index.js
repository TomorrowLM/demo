export default [
    {
        path: '/',
        name: '',
        component: () => import('@/views/HomeView'),
        children: [
            {
                path: 'PickupTask',
                name: 'PickupTask',
                component: () => import('@/views/Sd/PickupTask'),
            }
        ]
    }
]