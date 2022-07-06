import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

const Users = ({ users, deleteUser })=> {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {
          users.map( user => {
            return (
              <li key={ user.id }>
                { user.name }
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

const mapStateToProps = (state)=> {
  return {
    users: state.users
    }
  }

const mapDispatchToProps = dispatch => {
  return {
    deleteUser: async (id)=> {
      const response = await axios.delete('/api/users/'+id);
      dispatch({ type: 'DELETE_USER', id });
    }
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
