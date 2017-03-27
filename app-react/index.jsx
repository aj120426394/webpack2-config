import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'

// import injectTapEventPlugin from 'react-tap-event-plugin';
import RouterContainer from './container/RouterContainer';
// import './scss/vendors/_index.scss';
// import './scss/vendors/_interactiveSVG.scss';
// import './vendors/materialize/js/bin/materialize';

/**
 * Import .httaccess if you are using Apache as the hosting server.
 */
import '../.htaccess';
// import 'index.html';


// Import each of the images in the images folder.
const requireAll = (r) => {
  r.keys().forEach(r);
};
requireAll(
  require.context(
    './assets/images',
    true,
    /.(jpg|JPG|png)/
  )
);
/**
 * Warning from React Router, caused by react-hot-loader.
 * The warning can be safely ignored, so filter it from the console.
 * Otherwise you'll see it every time something changes.
 * See https://github.com/gaearon/react-hot-loader/issues/298
 */
if (module.hot) {
  const orgError = console.error; // eslint-disable-line no-console
  console.error = (message) => { // eslint-disable-line no-console
    if (message && /^<Router (routes|history);$/.test(message)) {
      // Log the error as normally
      orgError.apply(console, [message]);
    }
  };
}


ReactDOM.render(
  <AppContainer>
    <RouterContainer />
  </AppContainer>
  , document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./container/RouterContainer', () => {
    ReactDOM.render(
      <AppContainer>
        <RouterContainer />
      </AppContainer>
      , document.getElementById('root')
    );
  });
}

