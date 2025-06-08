import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { webscraperAPI } from './webscraperAPI';
import {
    persistStore, persistReducer, FLUSH, REHYDRATE,
    PAUSE, PERSIST, PURGE, REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import submitSlice from './slice';


const persistConfig = {
    key: 'webscraper',
    version: 1,
    storage
    // whitelist: ['search']
}

const allCombinedReducers = combineReducers({
    webscraperAPI: webscraperAPI.reducer,
    submit: submitSlice,
})


const persistReducers = persistReducer(persistConfig, allCombinedReducers)


export const store = configureStore({
    reducer: persistReducers,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }}).concat(webscraperAPI.middleware),
});

export const persistor = persistStore(store);
