var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(11);
  console.log(req.cookies);
  const data = req.cookies.USER === 'admin' ?
    {
      name: 'admin',
      role: 'admin',
      routes: []
    } : req.cookies.USER === 'liming' ? {
      name: 'liming',
      role: 'second',
      routes: []
    } : {
      name: 'third',
      role: 'third',
      routes: []
    }
  res.send({
    code: 200,
    message: 'success',
    data: {
      ...data,
      routes: req.cookies.USER === 'admin' ? [
        {
          path: '/',
          name: '主页',
        },
        {
          path: '/demo',
          name: 'demo',
          children: [
            {
              path: 'access',
              name: '权限',
              meta: {
                button: {
                  'btn:createUser': 2, //隐藏
                  'btn:editUser': 2, //禁用
                  'module:module1': 2
                }, roles: ['admin', 'second'],
              },
            },
            {
              path: 'skin',
              name: '皮肤',
            },
          ],
        },
        {
          path: '/task',
          name: '案例',
          children: [
            {
              path: 'PickupTask',
              name: '物流智能管控应用',
            },
          ],
        }
      ] :
        req.cookies.USER === 'liming' ? [
          {
            path: '/',
            name: '主页',
          },
          {
            path: '/demo',
            name: 'demo',
            children: [
              {
                path: 'access',
                name: '权限',
                meta: {
                  button: {
                    'btn:createUser': 0, //隐藏
                    'btn:editUser': 1, //禁用
                    'module:module1': 0
                  },
                  roles: ['admin', 'second'],
                },
              },
              {
                path: 'skin',
                name: '皮肤',
              },
            ],
          },
          {
            path: '/task',
            name: '案例',
            children: [
              {
                path: 'PickupTask',
                name: '物流智能管控应用',
              },
            ],
          }
        ] :
          [
            {
              path: '/',
              name: '主页',
            },
            {
              path: '/demo',
              name: 'demo',
              children: [
                {
                  path: 'access',
                  name: '权限',
                  meta: {
                    roles: ['admin', 'second'],
                  },
                },
                {
                  path: 'skin',
                  name: '皮肤',
                },
              ],
            },
            {
              path: '/task',
              name: '案例',
              children: [
                {
                  path: 'PickupTask',
                  name: '物流智能管控应用',
                },
              ],
            }
          ]
    }
  });
});

module.exports = router;
