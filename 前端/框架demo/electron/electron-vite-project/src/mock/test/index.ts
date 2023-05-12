// export default [
//   {
//     url: "/getData", // 注意，这里只能是string格式
//     method: "GET",
//     data: () => {
//       return {
//         "list|5-10": [
//           {
//             name: "@cname",
//             url: "choose1.png",
//             sportsman: "足球运动员",
//             age: "29",
//           },
//         ],
//       };
//     },
//   },
// ];
export default [
  {
    url: "getData", //匹配到指定url
    method: "get", //请求类型
    response: () => {
      return {
        code: 0,
        message: "ok",
        data: {
          name: "串口",
          key: "com",
          panels: [
            {
              title: "链路配置",
              elements: [
                {
                  type: "input",
                  label: "设备地址",
                  key: "address",
                  defaultValue: "121233",
                  width: "50%",
                },
                {
                  type: "select",
                  label: "波特率",
                  key: "bp",
                  defaultValue: "",
                  width: "30%",
                  options: [
                    {
                      key: "9600",
                      value: "9600",
                    },
                    {
                      key: "4800",
                      value: "4800",
                    },
                  ],
                },
                {
                  type: "textarea",
                  label: "设备名",
                  key: "name",
                  defaultValue: "",
                  width: "30%",
                },
                {
                  type: "checkbox",
                  label: "波特率",
                  key: "checkbox123",
                  defaultValue: "",
                  width: "30%",
                  options: [
                    {
                      key: "q",
                      value: "q",
                    },
                    {
                      key: "w",
                      value: "w",
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
    },
  },
];
