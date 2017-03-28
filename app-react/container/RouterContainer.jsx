import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { persistStore } from 'redux-persist';
import { syncHistoryWithStore } from 'react-router-redux';
import store from '../redux/store/config';
import TEMPLATE from './app';

/**
 * Create the router-history with redux state, this help to store the history to the state.
 */
const history = syncHistoryWithStore(browserHistory, store);


export default class RouterContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rehydrated: false};
  }

  componentWillMount() {
    /**
     * This help to get the state of the app when last time it has been launced from the local storage.
     *
     * - whitelist: The list of the dataname from the redux state which will be store in the local storage.
     * - blacklist: The list of the dataname from the redux state which will not be store in the local storage.
     * - Callback(): The callback after the store has been rehydrated. With this configuration, it will re-render
     *   the full application after the rehytration finished.
     */
    persistStore(store, {
      whitelist: ['currentUser', 'markingAssessment', 'markingStudentList', 'editingAssessment', 'editingCourse'],
      blacklist: ['routing']
    }, () => {
      console.log('rehydration complete');
      this.setState({ rehydrated: true });
    });
  }

  render() {
    if (!this.state.rehydrated) {
      return (
        <div>Loading...</div>
      );
    } else {
      return (
        <Provider store={store}>
          <Router history={history}>
            <Route path="/" component={TEMPLATE} />
          </Router>
        </Provider>
      );
    }
  }
}
