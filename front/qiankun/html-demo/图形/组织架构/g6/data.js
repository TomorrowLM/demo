const treeData = {
    name: '公司',
    tip: '总公司，成立于2010年',
    symbolSize: [260, 90],
    bg: '#3949f7',
    color: '#fff',
    fontSize: 33,
    children: [
        {
            name: [
                { 
                    name: '产品部', 
                    tip: '负责产品规划与设计',
                    tag: [{ name: '核心部门', borderColor: '#FC6221', color: '#FC6221' }]
                },
                { 
                    name: 'name2', 
                    tip: '产品研发管理',
                    tag: [{ name: '产品2', borderColor: '#FC6221', color: '#FC6221' }]
                },
                { 
                    name: '产品经理', 
                    tip: '产品需求分析'
                },
            ],
            symbolSize: [160, 48],
            color: '#2b2f8f',
            children: [
                { 
                    name: '产品规划', 
                    tip: '制定产品路线图',
                    symbolSize: [120, 40], 
                    color: '#2b2f8f' 
                },
                { 
                    name: '需求分析', 
                    tip: '收集分析用户需求',
                    symbolSize: [120, 40], 
                    color: '#2b2f8f' 
                },
                { 
                    name: '产品运营', 
                    tip: '产品上线后运营管理',
                    symbolSize: [120, 40], 
                    color: '#2b2f8f' 
                },
            ],
        },
        {
            name: '研发部',
            tip: '技术研发与实现',
            symbolSize: [160, 48],
            color: '#2b2f8f',
            children: [
                {
                    name: '前端开发',
                    tip: '用户界面开发',
                    symbolSize: [120, 40],
                    color: '#2b2f8f',
                    children: [
                        { 
                            name: 'Vue.js开发', 
                            tip: '使用Vue.js框架开发',
                            symbolSize: [100, 36], 
                            color: '#2b2f8f',
                            tag: [{ name: '热门', borderColor: '#4CAF50', color: '#4CAF50' }]
                        },
                        { 
                            name: 'React开发', 
                            tip: '使用React框架开发',
                            symbolSize: [100, 36], 
                            color: '#2b2f8f' 
                        },
                    ],
                },
                {
                    name: '后端开发',
                    tip: '服务器端开发',
                    symbolSize: [120, 40],
                    color: '#2b2f8f',
                    children: [
                        { 
                            name: 'Java开发', 
                            tip: 'Java后端服务开发',
                            symbolSize: [100, 36], 
                            color: '#2b2f8f' 
                        },
                        { 
                            name: 'Node.js开发', 
                            tip: 'Node.js后端服务开发',
                            symbolSize: [100, 36], 
                            color: '#2b2f8f',
                            tag: [{ name: '新兴', borderColor: '#FF9800', color: '#FF9800' }]
                        },
                    ],
                },
                { 
                    name: '测试部', 
                    tip: '软件测试与质量保证',
                    symbolSize: [120, 40], 
                    color: '#2b2f8f' 
                },
            ],
        },
        {
            name: '设计部1111111111111111111111111111111111',
            tip: 'UI/UX设计，长文本测试样例',
            symbolSize: [160, 48],
            color: '#2b2f8f',
            children: [
                { 
                    name: '视觉设计', 
                    tip: '界面视觉设计',
                    symbolSize: [120, 40], 
                    color: '#2b2f8f' 
                },
                { 
                    name: '交互设计', 
                    tip: '用户交互体验设计',
                    symbolSize: [120, 40], 
                    color: '#2b2f8f' 
                },
            ],
        },
        {
            name: '运营部',
            tip: '市场运营与内容管理',
            symbolSize: [160, 48],
            color: '#2b2f8f',
            children: [
                { 
                    name: '市场推广', 
                    tip: '市场推广与品牌建设',
                    symbolSize: [120, 40], 
                    color: '#2b2f8f' 
                },
                { 
                    name: '内容运营', 
                    tip: '内容创作与运营',
                    symbolSize: [120, 40], 
                    color: '#2b2f8f' 
                },
            ],
        },
    ],
};