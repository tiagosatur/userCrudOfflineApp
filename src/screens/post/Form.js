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
          value={values.name} 
          onChangeText={text => handleInputChange('name', text)} 
          placeholder="Tittle"
      />
      <TextInput 
          value={values.address} 
          onChangeText={text => handleInputChange('address', text)} 
          placeholder="Text"
          multiline={true}
          numberOfLines={5}

      />
      <Button onPress={handlePress} label='Register' />
    </Container>
  )
}

export default Form;

