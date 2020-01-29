import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAction } from '../../hooks';
import { 
    Container, 
    List,
  } from '../../components'
import { NewPost } from '../../screens';

const Home = ({ children }) => {
    const {
        postReducer: {
            posts
        }
    } = useSelector(state => state);
    const { getPostsAction } = useAction();

    useEffect(() => {
        const posts = getPostsAction()
        console.log('posts', posts);
    }, [])

    return (
        <Container style={{ paddingTop: 10 }}>
            <NewPost />
        <List data={posts} />
               
      </Container>
    );
    
}

Home.navigationOptions = {
    headerShown: false,
};

export default Home;