import React from 'react';
import ThingForm from './ThingForm';
import { connect } from 'react-redux';
import axios from 'axios';
import {upvoteThing} from './store'

const Things = ({ things, deleteThing, upvote })=> {
  return (
    <div>
      <h1>Things</h1>
      <ul>
        {
          things.map( thing => {
            return (
              <li key={ thing.id }>
                {thing.name} {thing.ranking}
                <button onClick={() => deleteThing(thing.id)}>Delete</button>
                <button onClick={() => upvote(thing.id)}>Upvote</button>
                <button onClick={() => deleteThing(thing.id)}>Downvote</button>
              </li>
            );
          })
        }
      </ul>
      <ThingForm />
    </div>
  );
};

const mapStateToProps = (state)=> {
    return {
      things: state.things
    }
  }
const mapDispatchToProps = dispatch => {
  return {
    deleteThing: async (id)=> {
      const response = await axios.delete('/api/things/'+id);
      dispatch({ type: 'DELETE_THING', id });
    },
    upvote: id => {
      dispatch(upvoteThing(id))
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Things);
