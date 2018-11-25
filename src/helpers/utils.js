// collection of useful functions

const dateTodayFormatted = () => {
  const dateToday = new Date();
  let dd = dateToday.getDate();
  let mm = dateToday.getMonth() + 1; // January is 0
  const yyyy = dateToday.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '/' + mm + '/' + yyyy;
};

export const isEngineerOrManager = (role) => {
  if (role.toLowerCase() === 'sta_engineer' || role.toLowerCase() === 'pd_engineer' || role.toLowerCase() === 'sta_manager') {
    return true;
  }
  return false;
};


export {
  dateTodayFormatted
};
