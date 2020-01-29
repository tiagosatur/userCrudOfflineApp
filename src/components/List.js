import React from 'react';
import styled from 'styled-components'
import { Container, Title } from '../components';

const List = ({ data }) => {
  console.log('data', data)
  return (
    <Container>
      <Title>Post list</Title>
      {data && data.map(post => (
        <Item key={post.register.id}>
          <Text>{post.register.name}</Text>
          <Text>{post.register.body}</Text>
        </Item>
      ))}
      
    </Container>
  )
}

const Item = styled.View`
  padding: 12px;
`;

const Text = styled.Text`
`;

export default List;