function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function cleanPage(page) {
  page('*').removeAttr('style');
  page('script,style,img').remove();
  return page;
}

module.exports = {
  cleanPage,
  sleep,
};
