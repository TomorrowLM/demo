function registerMock(app) {
  app.get('/test/mock', function (req, res) {
    const data = {
      code: 200,
      msg: '',
      data: {
        list: [1, 2, 3, 4]
      }
    };
    setTimeout(() => {
      res.json(data);
    }, 300);
  });
}
module.exports.registerMock = registerMock;
