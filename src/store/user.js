/*eslint no-case-declarations: "error"*/
/*eslint-env es6*/
import {
    USERS_PATH,
    uniqueId,
  } from '../utils';
  import _ from 'lodash';
  
  // ACTION TYPES
  export const USER_REGISTER_SAVED = 'USER_REGISTER_SAVED';
  export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';
  export const USER_REGISTER_SYNCED = 'USER_REGISTER_SYNCED';
  export const USER_REGISTER_FAIL = 'USER_REGISTER_FAIL';
  export const USER_INSECURE_CLEAR_ALL = 'USER_CLEAR_ALL';
  
  export const UPDATE_USER_PENDING = 'UPDATE_USER_PENDING';
  export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
  export const UPDATE_USER_FAIL = 'UPDATE_USER_FAIL';
  
  export const GET_USERS_PENDING = 'GET_USERS_PENDING';
  export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
  export const GET_USERS_FAIL = 'GET_USERS_FAIL';
  
  export const DELETE_USER_PENDING = 'DELETE_USER_PENDING';
  export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
  export const DELETE_USER_FAIL = 'DELETE_USER_FAIL';
  
  // REDUCER
  const initialState = {
    isLoading: false,
    error: null,
    users: [],
  };
  
  const userReducer = (state = initialState, action) => {
    const {type, meta, payload} = action;
    //const { id } = payload || {};
  
    switch (action.type) {
      case USER_REGISTER_SAVED:
        let newUser = [{
          synced: false,
          id: payload.id,
          error: null,
          register: payload.data,
        }];
  
        let oldUserList = state.users;
  
        return {
          ...state,
          users: [...newUser, ...oldUserList],
        };
  
      case USER_REGISTER_SYNCED:
        
        return {
          ...state,
          users: state.users.map(user => {
            if (user.id === action.meta.base.id) {
              const item = { 
                synced: true,
                id: action.payload.id,
                register: action.payload,
              };
              return item;
            }
            return user;
          }),
        };
  
      case USER_REGISTER_FAIL:
        let userId = meta && meta.base.id;
  
        return {
          ...state,
          users: setError(state.users, userId, false),
        };
  
      case USER_INSECURE_CLEAR_ALL:
        return {
          ...state,
          users: [],
        };
  
      case GET_USERS_PENDING:
        return {
          ...state,
          error: null,
          isLoading: true,
        };
  
      case GET_USERS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          users: modifyUsers(action.payload.data),
        };
  
      case GET_USERS_FAIL:
        return {
          ...state,
          isLoading: false,
          error: payload.message,
        };
  
      case DELETE_USER_PENDING:
        return {
          ...state,
          users: state.users.map(user => {
            
            if(user.id === action.payload.userId) {
              
              const item = {
                id: user.id,
                synced: true,
                error: null,
                isLoading: true,
                register: user.register,
              }
              
              return item
            }
            return user;
          })
        }
  
  
      case DELETE_USER_SUCCESS: 
        const deletedUserId = action.meta.userId;
        const userList = state.users.filter(user => user.id !== deletedUserId);
  
        return {
          ...state,
          isLoading: false,
          users: userList,
        }
  
      case DELETE_USER_FAIL:
          return {
            ...state,
            isLoading: false,
            error: action.payload.message,
            users: state.users.map(user => {
              if(user.id === action.meta.userId) {
                const item = {
                  id: action.payload.id,
                  synced: true,
                  error: null,
                  isLoading: false,
                  register: action.payload,
                }
                return item
              }
              return user;
            })
          }
  
      case UPDATE_USER_PENDING:
          return {
            ...state,
            users: state.users.map(user => {
              if(user.id === payload.id) {
                const item = {
                  id: payload.id,
                  synced: false,
                  error: null,
                  register: payload,
                }
                return item
              }
              return user;
            })
          }

      case UPDATE_USER_SUCCESS:
          return {
            ...state,
            users: state.users.map(user => {
              if (user.id === meta.id) {
                const item = {
                    id: meta.id,
                    synced: true,
                    error: null,
                    register: meta,
                };
                return item;
              }
              return user;
            }),
          };
      case UPDATE_USER_FAIL:
        return {
          ...state,
          users: state.users.map(user => {
            if(user.id === meta.id) {
              const item = {
                id: meta.id,
                synced: false,
                error: payload.message,
                register: meta,
              }
              return item
            }
            return user;
          })
        }
  
      default:
        return state;
    }
  };
  
  export default userReducer;
  
  const modifyUsers = remoteList => {
      const normalized = (remoteList || []).map((item, i) => {
          const modifiedUser = {
            id: item.id,
            synced: true,
            isLoading: false,
            error: null,
            register: { ...item },
          };
  
          return modifiedUser;
      });
  
      return normalized
  }
  
  const setError = (state, id, status) => {
    return state.length > 0
      ? state &&
          state.map(user => {
            if (user.id === id) {
              user.synced = status;
              user.error = 'This user has some error';
              return user;
            }
            return user;
          })
      : [];
  };
  
  
  // THUNK ACTIONS
  
  export const updateUser = data => dispatch => {
    dispatch({
      type: UPDATE_USER_PENDING,
      payload: { ...data },
      meta: {
        retry: true,
        offline: {
          effect: {
            method: 'PUT',
            url: USERS_PATH,
            body: JSON.stringify({...data}),
          },
          commit: {type: UPDATE_USER_SUCCESS, meta: { ...data }},
          rollback: {type: UPDATE_USER_FAIL, meta: { ...data } },
        },
      },
    });
  };
  
  export const registerUser = data => dispatch => {
    const id = uniqueId();
  
    dispatch({
      type: USER_REGISTER_SAVED,
      payload: {id, data: data},
      meta: {
        // retry: true,
        offline: {
          effect: {
            method: 'POST',
            url: USERS_PATH,
            body: JSON.stringify(data),
          },
          commit: {type: USER_REGISTER_SYNCED, meta: {base: {id}}},
          rollback: {type: USER_REGISTER_FAIL, meta: {base: {id}, backup: {data}}},
        },
      },
    });
  };
  
  export const getUsers = () => {
      
      return async (dispatch) => {
          dispatch ({
              type: GET_USERS_PENDING,
              meta: {
                  retry: true,
                  offline: {
                      effect: {
                          method: 'GET',
                          url: `${USERS_PATH}`,
                      },
                      commit: { type: GET_USERS_SUCCESS },
                      rollback: { type: GET_USERS_FAIL }
                  },
              },
          })
      }
  }
  
  export const deleteUser = ({ userId }) => (dispatch, getState) => {
    dispatch({
      type: DELETE_USER_PENDING,
      payload: { userId },
      meta: {
        retry: true,
        offline: {
          effect: {
            method: 'DELETE',
            url: `${USERS_PATH}/${userId}`,
          },
          commit: { type: DELETE_USER_SUCCESS, meta: { userId } },
          rollback: { type: DELETE_USER_FAIL, meta: { userId } },
  
        }
      }
    })
  }
  
  
  //ACTION CREATORS
  export const getUsersPending = () => ({type: GET_USERS_PENDING});
  export const clearAllUsers = () => ({type: USER_INSECURE_CLEAR_ALL});
  