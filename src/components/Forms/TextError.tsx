import { ErrorMessage } from 'formik'
import React from 'react'
import { FormikMessageErrorType } from 'types'

function TextError({ name}: FormikMessageErrorType) {
  return (
    <ErrorMessage name={name} >
        {msg => <div className='Formik__error--message'>{msg}</div>}
    </ErrorMessage>
  )
}

export default TextError