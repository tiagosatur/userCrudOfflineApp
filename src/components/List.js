import React from 'react';
import styled from 'styled-components'
import { uniqueId } from '../utils'
import { Container } from '../components'


const List = ({ data }) => {
  return (
    <Container>
      <ListTitle>User list</ListTitle>
      <ListContainer>
        {data && data.map(user => (
          <Item key={uniqueId()}>
            <Avatar 
              source={{
                uri: user.register.avatar,
              }}
            />
            <Info>
              <Name>{user.register.id} {user.register.first_name}</Name>
              <Text>{user.register.email}</Text>
            </Info>
            <DeleteButton>
              <Text> Delete</Text>
            </DeleteButton>
          </Item>
        ))}
      </ListContainer>
    </Container>
  )
}

const ListContainer = styled.View``;


const Item = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 0;
`;

const ListTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Name = styled.Text`
  font-size: 18px;
  font-weight: 600;
`;

const Text = styled.Text`
  color: #666;
  font-size: 12px;
  font-weight: 200;
`;

const Avatar = styled.Image`
  border-radius: 3px;
  height: 50px;
  width: 50px;
`;

const Info = styled.View`
  flex-grow: 1;
  padding-left: 12px;
`;

const DeleteButton = styled.TouchableHighlight`
  color: red;
`;
export default List;