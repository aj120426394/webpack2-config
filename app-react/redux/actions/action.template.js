import ActionTypes from '../ActionTypes';

/**
 * This file is creating the action. There would be two types of action:
 * 1. Normal Action
 * 2. Action with Middleware
 */

/**
 * This is a normal action. In the component, it will dispatch whatever the function return.
 * @param data
 */
export const normal_action = (data) => ({type: ActionTypes.dataname.action, data});

/**
 * This is a action with middleware. It helps to deal with the async action.
 * You can data into the async function and after it response, you then dispatch the result.
 * @param data
 */
export const action_with_middleware = (data) => (dispatch, getState) => {
    const state = getState();
    dispatch({type: ActionTypes.dataname.action, result});
};
