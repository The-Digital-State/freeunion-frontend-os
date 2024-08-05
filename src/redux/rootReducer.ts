// @ts-ignore
import { combineReducers } from '@reduxjs/toolkit';
import { reducer as chatReducer } from '../shared/slices/chat';
import { reducer as tasksReducer } from '../shared/slices/tasks';
import { reducer as commentsReduces } from '../shared/slices/comments';

const rootReducer = combineReducers({
  chat: chatReducer,
  tasks: tasksReducer,
  comments: commentsReduces,
});

export default rootReducer;
