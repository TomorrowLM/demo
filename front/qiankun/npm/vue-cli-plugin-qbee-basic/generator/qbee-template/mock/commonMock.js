const posts = [];
const deletes = [];
const puts = ['/test/mock'];

exports.registerCommonMock = function (app) {
  posts.forEach((url) => {
    app.post(url, function (req, res) {
      const data = {
        code: 200,
        data: {
          id: Math.random() + ''
        },
        msg: ''
      };
      setTimeout(() => {
        res.json(data);
      }, 500);
    });
  });

  deletes.forEach((url) => {
    app.delete(url, function (req, res) {
      const data = {
        code: 200,
        msg: ''
      };
      setTimeout(() => {
        res.json(data);
      }, 500);
    });
  });

  puts.forEach((url) => {
    app.put(url, function (req, res) {
      const data = {
        code: 200,
        msg: ''
      };
      setTimeout(() => {
        res.json(data);
      }, 500);
    });
  });
};
