import React from 'react';
import styled from 'styled-components'

const Touchable = styled.TouchableOpacity`
  background-color: #333;
  border: 1px solid gray;
  border-radius: 3px;
  color: white;
  margin-bottom: 12px;
  padding: 8px;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
`;

const Button = ({ label }) => {
  return (
    <Touchable>
      <Text>{ label }</Text>
    </Touchable>
  )
}

export default Button;