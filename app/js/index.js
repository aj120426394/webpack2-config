

require("../scss/app.scss");
if (process.env.NODE_ENV !== 'production') {
require ('../index.html');
}
// Import each of the images in the images folder.
const requireAll = (r) => {
  r.keys().forEach(r)
};
requireAll(
  require.context(
    "../assets/images",
    true,
    /.(jpg|JPG|png)/
  )
);

/**
 * Your javascript code here.
 */
