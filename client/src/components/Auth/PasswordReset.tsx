import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase';
import { AuthContainer, AuthInput, AuthMainButton, AuthBackground } from './styles';
import { Flex } from '../Lib';
import { Link } from 'react-router-dom';

export default function PasswordReset () {
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit } = useForm();
  const onSubmit = async ({ email }: { email: string }) => {
    try {
      console.log(email)
      await auth.sendPasswordResetEmail(email);
      setEmailSent(true);
    }
    catch(error){
      console.log('Error Signing up with email and password');
    }
  };

  return (<>
    <AuthBackground />
    <AuthContainer>
      { !emailSent
        ? (<>
          <Flex flexDirection="column">
            <span role="img" aria-label="Logo">🍙</span>
            <h1>DinnerIsReady</h1>
          </Flex>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AuthInput name="email" ref={register({ required: true })} placeholder="Email" />
            <AuthMainButton type="submit">Reset password</AuthMainButton>
          </form>
        </>)
        : <span>done</span>
      }
      <Link to="/signin">Go back to the sign in page</Link>
    </AuthContainer>
  </>);
}