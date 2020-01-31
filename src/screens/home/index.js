import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome';

import { useAction } from '../../hooks';
import { 
    Container, 
    List,
  } from '../../components'
import { NewUser } from '../../screens';

const Home = () => {
    const {
        userReducer: {
            users
        }, 
        offline: {
            online: isAppOnline
        }
    } = useSelector(state => state);
    const { getUsersAction, deleteUserAction } = useAction();

    useEffect(() => {
        const users = getUsersAction()
    }, [])

    const handleDelete = (userId) => {
        deleteUserAction({ userId })
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <Container>
                <StatusContainer>
                    <Icon 
                        name="circle" 
                        size={15} 
                        color={isAppOnline ? "#82c91e" : "#f44336" } 
                    />
                    <StatusText>
                        {
                            isAppOnline
                            ? 'Online'
                            : 'Offline'
                        } 
                    </StatusText>
                </StatusContainer>
 
                
                <NewUser />

                <List 
                    data={users} 
                    actions={{ handleDelete }} 
                />
            </Container>
        </ScrollView>
    );
    
}

const ScrollView = styled.ScrollView``;
const StatusContainer = styled.View`
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    margin: 8px 8px 22px 0;
`;

const StatusTextContainer = styled.View``;

const StatusText = styled.Text`
    margin-left: 12px;
`;


export default Home;