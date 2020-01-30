import _ from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import { offline } from '@redux-offline/redux-offline';
import defaultQueue from '@redux-offline/redux-offline/lib/defaults/queue';
import defaultOfflineConfig from '@redux-offline/redux-offline/lib/defaults';
import axios from 'axios';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import combinedReducers from './combinedReducers';

import {
  GET_USERS_PENDING,
} from './user';


const offlineApiMiddleware = res => {
  const { data, status, error } = res;
  return data;
};

const request = async (url, method, body) => {
  // if (body) {
  //   console.log('REQUEST', JSON.parse(body));
  // }


  const response = await axios({
    method,
    url,
    headers: { "Content-type": "application/json; charset=UTF-8" },
    data: body,
  });

  console.log('RESPONSE', response);

  if (response.status >= 200 && response.status <= 299) {
    return offlineApiMiddleware(response);
  } else {
    return Promise.reject(response);
  }
};

const offlineConfig = {
  ...defaultOfflineConfig,

  effect: async ({ url, method, body = null, ...options }) => {
    
    const req = await request(url, method, body);
    console.log('effetct req', req);
    return req;
  },

  discard: (error, action, retries) => {
    const { response } = error;
    return (
      (response && response.status >= 400 && response.status < 500) ||
      retries > 3
    );
  },
  queue: {
    ...defaultQueue,

    enqueue(outbox, incomingAction, context) {
      const isOnline = context.offline.online;
      // console.log('enqueue', isOnline, incomingAction)
      // https://github.com/redux-offline/redux-offline/issues/238

      //Removes duplicated dispatched actions
      if (incomingAction.type === GET_USERS_PENDING) {
        return outbox
          .filter(outboxAction => outboxAction.type !== incomingAction.type)
          .concat(incomingAction);
      }
      /*
          if(!isOnline && incomingAction.type === DELETE_POP_PENDING) {
            const id = incomingAction.payload.id;
            // const dispatch = store.dispatch;
            deletePopOffline({ id })

            return outbox.filter( outboxAction => {
                return outboxAction.payload.id !== incomingAction.payload.id 
            })
            .filter(deleteAction => deleteAction.type === DELETE_POP_PENDING)
          }
          */

      return [...outbox, incomingAction];
    },
  },
  /*
    offlineStateLens: state => {
      const { offline, ...rest } = state
      const { outbox } = offline;
      return {
        get: offline,
        set: () => {
          
          if(!isOnline && incomingAction.type === DELETE_USER_PENDING) {
            const id = incomingAction.payload.id;
            // const dispatch = store.dispatch;
            deletePopOffline({id, dispatch})

            return outbox.filter( outboxAction => {
                return outboxAction.payload.id !== incomingAction.payload.id 
            })
            .filter(deleteAction => deleteAction.type === DELETE_USER_PENDING)
          }
          return state;
        }
      }

    }
    */
};

const middlewares = [thunk];

const compose = composeWithDevTools({ realtime: true });

const store = createStore(
  combinedReducers,
  compose(
    offline(offlineConfig),
    applyMiddleware(...middlewares)
  )
);

export default store;
