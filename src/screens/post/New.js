import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '../../hooks';
import { Title, Container } from '../../components';
import Form from './Form';

const NewPost = () => {
  const { values, errors, handleInputChange, handleSubmit } = useForm({
    id: '',
    name: '',
    address: '',
  });

  const handlePress = () => {
    console.log('values', values);
  };

  useEffect(async () => {
    //const res = await axios.get('https://jsonplaceholder.typicode.com/posts?userId=1');
    //console.log('resa', res);
  }, []);
  
  return (
    <>
      <Title>Register a post</Title>
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

export default NewPost;
