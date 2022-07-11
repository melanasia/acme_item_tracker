import { createStore, applyMiddleware } from 'redux';
import axios from 'axios';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const initialState = {
  view: window.location.hash.slice(1),
  users: [],
  things: []
};

const updateThing = (thing)=> {
  return async(dispatch)=> {
    thing = (await axios.put(`/api/things/${thing.id}`, thing)).data;
    dispatch({ type: 'UPDATE_THING', thing });
  };
};

const upvoteThing = (id)=> {
  return async(dispatch)=> {
    const response = await axios.post('/api/things/vote', {id, increase_rank: true});
    dispatch({ type: 'UPVOTE_THING', thing: response.data });
  };
};

const deleteThing = (thing)=> {
  return async(dispatch)=> {
    await axios.delete(`/api/things/${thing.id}`);
    dispatch({ type: 'DELETE_THING', thing });
  };
};

const reducer = (state = initialState, action)=> { 
  if(action.type === 'SET_THINGS'){
    return {...state, things: action.things };
  }
  if(action.type === 'SET_USERS'){
    return {...state, users: action.users }; 
  }
  if(action.type === 'SET_VIEW'){
    console.log(action.view)
    return {...state, view: action.view }; 
  }
  if(action.type === 'CREATE_THING'){
    return {...state, things: [...state.things, action.thing ]}; 
  }
  if (action.type === 'DELETE_THING') {
    return {...state, things: state.things.filter(t => t.id !== action.id)};
  }
  if (action.type === 'DELETE_USER') {
    return {...state, users: state.users.filter(u => u.id !== action.id)};
  }
  // if (action.type === 'UPVOTE_USER') {
  //   const [user] = state.users.find(u => u.id === action.id);
  // }
  if (action.type === 'UPVOTE_THING') {
    const things = state.things.map(t => {
      if (t.id === action.thing.id){
        return {
          ...t,
          ranking: action.thing.ranking
        }
      }
      return t;
    });
    return {...state, things};
  }
  return state;
};

const store = createStore(reducer, applyMiddleware(logger, thunk));

export { deleteThing, updateThing, upvoteThing };
export default store;

