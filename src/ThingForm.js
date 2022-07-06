import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

const ThingForm = ({ createThing })=> {
  return (
    <div>
      <button onClick={ createThing }>Create</button>
    </div>
  );
};

const mapDispatchToProps = (dispatch)=> {
  return {
    createThing: async()=> {
      const response = await axios.post('/api/things', { name: Math.random()});
      const thing = response.data;
      dispatch({ type: 'CREATE_THING', thing });
    }
  };
}

export default connect(null, mapDispatchToProps)(ThingForm);


// const func = connect(null, mapDispatchToProps)
// func(ThingForm);