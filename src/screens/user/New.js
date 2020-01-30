import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useForm, useAction } from '../../hooks';
import { Title, Container } from '../../components';
import Form from './Form';

const NewUser = () => {
  const { registerUserAction } = useAction();
  const { values, errors, handleInputChange, handleSubmit } = useForm({
    first_name: '',
    email: '',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg',
  });

  const handlePress = () => {
    const isFormEmpty = _.isEmpty(values.first_name) ||  _.isEmpty(values.email);
    
    if(!isFormEmpty) registerUserAction(values)
  };

  
  return (
    <>
      <Title>Register a user</Title>
      <Form
        data={{ values }}
        actions={{
          handleInputChange,
          handlePress,
        }}
      />
    </>
  );
};

export default NewUser;
