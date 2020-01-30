import React from 'react';
import { 
  Button,
  Container,
  TextInput,
} from '../../components'

const Form = ({
  data: {
    values,
  },
  actions: {
    handleInputChange,
    handlePress
  }
}) => {
  return (
    <Container>
      <TextInput 
          value={values.first_name} 
          onChangeText={text => handleInputChange('first_name', text)} 
          placeholder="Name"
      />
      <TextInput 
          value={values.email} 
          onChangeText={text => handleInputChange('email', text)} 
          placeholder="E-mail"
      />
      <Button onPress={handlePress} label='Register' />
    </Container>
  )
}

export default Form;

