const expDate = () => {
  let todayDate = new Date();
  todayDate.setMonth(todayDate.getMonth() + 1);
  return todayDate;
};

module.exports.expDate = expDate;
