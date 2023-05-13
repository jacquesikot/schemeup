import { configureStore } from '@reduxjs/toolkit';
import appTabsReducer from './slice/apptabs';

const store = configureStore({
  reducer: {
    appTabs: appTabsReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
