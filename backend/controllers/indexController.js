const getIndex = async function (req, res) {
  res.status(200).render('index');
};

module.exports = {
  getIndex,
};
