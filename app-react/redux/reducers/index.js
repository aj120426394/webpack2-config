import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
// import { createCourse, editingCourse, createCouseStep } from './course';
// import { editAssessment, markingAssessment, markingStudentList } from './assessment';
import ActionTypes from '../ActionTypes';


/**
 * This is the root reducer. It connect the sub-reducer to the related state data
 * and combine them together.
 *
 * Example:
 * state object name: sub reducer
 *
 * function subReducer(state = {This is the initial state}, action) {
 *   switch (action.type) {
 *     case ActionTypes.dataname.actionType: {
 *       return (what ever you want to return for this data when this action be triggered.)
 *     }
 *     default:
 *       return state;
 *   }
 * }
 *
 * Plugin:
 * 1. react-router-redux: This plugin help to store the router in to the state.

 *
 */




export default combineReducers({
  routing: routerReducer
});


