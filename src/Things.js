import React from 'react';
import ThingForm from './ThingForm';
import { connect } from 'react-redux';
import axios from 'axios';

const Things = ({ things, deleteThing })=> {
  return (
    <div>
      <h1>Things</h1>
      <ul>
        {
          things.map( thing => {
            return (
              <li key={ thing.id }>
                { thing.name } {thing.ranking}
                <button onClick={() => deleteThing(thing.id)}>Delete</button>
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
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Things);
