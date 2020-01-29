import React from 'react';

import styled from 'styled-components'

const TextInput = ({...props}) => {
  return(
      <StyledTextInput 
        {...props} 
      />
  );
}

const StyledTextInput = styled.TextInput`
  border: 1px solid gray;
  border-radius: 3px;
  color: #333;
  margin-bottom: 12px;
  padding: 8px;
`;


export default TextInput;