/*eslint no-case-declarations: "error"*/
/*eslint-env es6*/
import {
    POSTS_PATH,
    uniqueid,
  } from '../utils';
  import _ from 'lodash';
  
  // ACTION TYPES
  export const POST_REGISTER_SAVED = 'POST_REGISTER_SAVED';
  export const POST_REGISTER_REQUEST = 'POST_REGISTER_REQUEST';
  export const POST_REGISTER_SYNCED = 'POST_REGISTER_SYNCED';
  export const POST_REGISTER_FAIL = 'POST_REGISTER_FAIL';
  export const POST_INSECURE_CLEAR_ALL = 'POST_CLEAR_ALL';
  
  export const UPDATE_POST_PENDING = 'UPDATE_POST_PENDING';
  export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
  export const UPDATE_POST_FAIL = 'UPDATE_POST_FAIL';
  
  export const GET_POSTS_PENDING = 'GET_POSTS_PENDING';
  export const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS';
  export const GET_POSTS_FAIL = 'GET_POSTS_FAIL';
  
  export const DELETE_POST_PENDING = 'DELETE_POST_PENDING';
  export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
  export const DELETE_POST_FAIL = 'DELETE_POST_FAIL';
  
  export const DELETE_POST_OFFLINE_PENDING = 'DELETE_POST_OFFLINE_PENDING';
  export const DELETE_POST_OFFLINE_SUCCESS = 'DELETE_POST_OFFLINE_SUCCESS';
  export const DELETE_POST_OFFLINE_FAIL = 'DELETE_POST_OFFLINE_FAIL';
  
  
  // REDUCER
  const initialState = {
    isLoading: false,
    error: null,
    posts: [],
  };
  
  const postReducer = (state = initialState, action) => {
    const {type, meta, payload} = action;
    //const { id } = payload || {};
  
    switch (action.type) {
      case POST_REGISTER_SAVED:
        let newPost = [{
          synced: false,
          id: payload.id,
          error: null,
          register: payload.data,
        }];
  
        let oldPostList = state.posts;
  
        return {
          ...state,
          posts: [...newPost, ...oldPostList],
        };
  
      case POST_REGISTER_SYNCED:
        return {
          ...state,
          posts: state.posts.map(post => {
            if (post.id === meta && meta.base.id) {
              const item = {
                ...post,
                ...(post.synced = true),
                ...(post.id = payload.solicitacaoId),
                ...(post.register.solicitacaoId = payload.solicitacaoId),
                ...(post.register.solidpk = payload.solidpk),
              };
              return item;
            }
            return post;
          }),
        };
  
      case POST_REGISTER_FAIL:
        let postId = meta && meta.base.id;
  
        return {
          ...state,
          posts: setError(state.posts, postId, false),
        };
  
      case POST_INSECURE_CLEAR_ALL:
        return {
          ...state,
          posts: [],
        };
  
      case GET_POSTS_PENDING:
        return {
          ...state,
          error: null,
          isLoading: true,
        };
  
      case GET_POSTS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          posts: modifyPosts(action.payload),
        };
  
      case GET_POSTS_FAIL:
        return {
          ...state,
          isLoading: false,
          error: payload.message,
        };
  
      case DELETE_POST_OFFLINE_PENDING:
      case DELETE_POST_PENDING:
        return {
          ...state,
          isLoading: true,
        }
  
      case DELETE_POST_OFFLINE_SUCCESS:
          return {
            ...state,
            isLoading: false,
            posts: state.posts.filter(post => post.id !== payload),
          }
  
      case DELETE_POST_SUCCESS: 
        const deletedPostId = meta && meta.id;
  
        return {
          ...state,
          isLoading: false,
          posts: state.posts.filter(post => post.id !== deletedPostId),
        }
  
      case DELETE_POST_OFFLINE_FAIL:
      case DELETE_POST_FAIL:
          return {
            ...state,
            isLoading: false,
            error: payload.message,
          }
  
      case UPDATE_POST_PENDING:
          return {
            ...state,
            posts: state.posts.map(post => {
              if(post.id === payload.solicitacaoId) {
                const item = {
                  id: payload.solicitacaoId,
                  synced: false,
                  error: null,
                  register: payload,
                }
                return item
              }
              return post;
            })
          }
      case UPDATE_POST_SUCCESS:
          return {
            ...state,
            posts: state.posts.map(post => {
              if (post.id === meta.solicitacaoId) {
                const item = {
                    id: meta.solicitacaoId,
                    synced: true,
                    error: null,
                    register: meta,
                };
                return item;
              }
              return post;
            }),
          };
      case UPDATE_POST_FAIL:
        return {
          ...state,
          posts: state.posts.map(post => {
            if(post.id === meta.solicitacaoId) {
              const item = {
                id: meta.solicitacaoId,
                synced: false,
                error: payload.message,
                register: meta,
              }
              return item
            }
            return post;
          })
        }
  
      default:
        return state;
    }
  };
  
  export default postReducer;
  
  const modifyPosts = remoteList => {
      const normalized = (remoteList || []).map((item, i) => {
          const modifiedPost = {
              synced: true,
              id: item.solicitacaoId,
              error: null,
              register: { ...item },
          };
  
          return modifiedPost;
      });
  
      return normalized
  }
  
  const setError = (state, id, status) => {
    return state.length > 0
      ? state &&
          state.map(post => {
            if (post.id === id) {
              post.synced = status;
              post.error = 'This post has some error';
              return post;
            }
            return post;
          })
      : [];
  };
  
  
  // THUNK ACTIONS
  
  export const updatePost = data => dispatch => {
    dispatch({
      type: UPDATE_POST_PENDING,
      payload: { ...data },
      meta: {
        retry: true,
        offline: {
          effect: {
            method: 'PUT',
            url: POSTS_PATH,
            body: JSON.stringify({...data}),
          },
          commit: {type: UPDATE_POST_SUCCESS, meta: { ...data }},
          rollback: {type: UPDATE_POST_FAIL, meta: { ...data } },
        },
      },
    });
  };
  
  export const registerPost = data => dispatch => {
    const id = uniqueid();
  
    dispatch({
      type: `POST_REGISTER_SAVED`,
      payload: {id, data: data},
      meta: {
        retry: true,
        offline: {
          effect: {
            method: 'POST',
            url: POSTS_PATH,
            body: JSON.stringify(data),
          },
          commit: {type: POST_REGISTER_SYNCED, meta: {base: {id}}},
          rollback: {type: POST_REGISTER_FAIL, meta: {base: {id}, backup: {data}}},
        },
      },
    });
  };
  
  export const getPosts = () => {
      return async (dispatch, getState) => {
          dispatch ({
              type: GET_POSTS_PENDING,
              meta: {
                  retry: true,
                  offline: {
                      effect: {
                          method: 'GET',
                          url: `${POSTS_PATH}?userId=1`,
                      },
                      commit: { type: GET_POSTS_SUCCESS },
                      rollback: { type: GET_POSTS_FAIL }
                  },
              },
          })
      }
  }
  
  export const deletePost = ({ 
      codigo, 
      solicitacaoId, 
      employee, 
  }) => (dispatch, getState) => {
  
    const isOnline = getState().offline.online;
  
    
    dispatch({
      type: DELETE_POST_PENDING,
      payload: { id: solicitacaoId },
      meta: {
        retry: true,
        offline: {
          effect: {
            method: 'DELETE',
            url: POSTS_PATH,
            body: JSON.stringify({ codigo, solicitacaoId, employee }),
          },
          commit: { type: DELETE_POST_SUCCESS, meta: { id: solicitacaoId } },
          rollback: { type: DELETE_POST_FAIL, meta: { id: solicitacaoId } },
  
        }
      }
    })
    // if(!isOnline) {
    //   deletePostOffline({ solicitacaoId, dispatch })
    // }
  }
  
  export const deletePostOffline = ({ id }) => {
    return dispatch => {
      dispatch(deletePostOfflineSuccess({ id }))
    }
  }
  
  
  //ACTION CREATORS
  export const getPostsPending = () => ({type: GET_POSTS_PENDING});
  export const clearAllPosts = () => ({type: POST_INSECURE_CLEAR_ALL});
  
  export const deletePostOfflinePending = () => ({ type: DELETE_POST_OFFLINE_PENDING });
  export const deletePostOfflineSuccess = ({ id }) => ({ type: DELETE_POST_OFFLINE_SUCCESS, payload: id });
  export const deletePostOfflineFail = error => ({ type: DELETE_POST_OFFLINE_FAIL, payload: error });
  