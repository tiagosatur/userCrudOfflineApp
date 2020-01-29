import { useState, useEffect } from 'react';
import _ from 'lodash';

const useForm = (initialValues, callback, validate) => {
    const [ values, setValues ] = useState(initialValues ? initialValues : {});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formWasTouched, setFormTouched] = useState(false);

    const handleInputChange = (fieldName, value, errorRef = null) => {
        setValues(prevValues => {
            if(errorRef) {
                return { 
                    ...prevValues,
                    [errorRef] : value,
                    [ fieldName ]: value 
                }
            }
            
            return {
                ...prevValues,
                [ fieldName ]: value
            }
        });

        setErrors(() => {
            let newErrors = _.omit(errors, fieldName);
            errorRef 
                ? newErrors = _.omit(errors, errorRef)
                : newErrors = _.omit(errors, fieldName)
            return newErrors
        });

        setIsSubmitting(false);
        setFormTouched(true)
    };

    useEffect(() => {
        if(Object.keys(errors).length === 0 && isSubmitting) {
            callback();
        }
        
    }, [errors]);

    const handleSubmit = () => {
        setErrors(validate(values));
        setIsSubmitting(true);
    }

    return {
        values,
        errors,
        setValues,
        setErrors,
        handleInputChange,
        handleSubmit,
        formWasTouched,
    }
}

export default useForm;