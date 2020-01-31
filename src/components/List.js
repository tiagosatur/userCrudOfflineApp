import React from 'react';
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome';
import { uniqueId } from '../utils'
import { Container } from '../components'


const List = ({ 
  data,
  actions: {
    handleDelete
  }
}) => {
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
            <DeleteButton 
              underlayColor="#ffffff00"
            >
              {
                user.synced
                ? <Icon name="cloud" size={25} color="#ccc" />
                : <Icon name="cloud-upload" size={25} color="#ccc" />
              }
            </DeleteButton>

            <DeleteButton 
              onPress={() => handleDelete(user.register.id)}
              underlayColor="#ffffff00"
            >
              {
                user.isLoading
                ? <ActivityIndicator size="small" color="#333" />
                : <Icon name="trash" size={25} color="#ccc" />
              }
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
const SyncedButton = styled.TouchableHighlight`
  border-radius: 3px;
  padding: 8px 18px;
`;

const DeleteButton = styled.TouchableHighlight`
  border-radius: 3px;
  padding: 8px 18px;
`;

const ActivityIndicator = styled.ActivityIndicator``;

export default List;