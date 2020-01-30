import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'
import { useAction } from '../../hooks';
import { 
    Container, 
    List,
  } from '../../components'
import { NewUser } from '../../screens';

const Home = ({ children }) => {
    const {
        userReducer: {
            users
        }
    } = useSelector(state => state);
    const { getUsersAction } = useAction();

    useEffect(() => {
        const users = getUsersAction()
    }, [])

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <Container>
            <NewUser />
            <List data={users} />
            </Container>
        </ScrollView>
    );
    
}

const ScrollView = styled.ScrollView``;



export default Home;