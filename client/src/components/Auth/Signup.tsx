import React from 'react';
import { useForm } from "react-hook-form";
import { auth, generateUserDocument } from '../../firebase';
import { AuthContainer, AuthInput, AuthMainButton, AuthBackground } from './styles';
import { Flex } from '../Lib';
import { Link } from 'react-router-dom';

export default function Signup () {
  const { register, handleSubmit } = useForm();
  const onSubmit = async ({ displayName, email, password }: { [key: string]: string }) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      generateUserDocument(user, { displayName });
    }
    catch(error){
      console.log('Error Signing up with email and password');
    }
  };

  return (<>
    <AuthBackground />
    <AuthContainer>
      <Flex flexDirection="column">
        <span role="img" aria-label="Logo">🍙</span>
        <h1>DinnerIsReady</h1>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AuthInput name="displayName" ref={register({ required: true })} placeholder="Full Name" />
        <AuthInput name="email" ref={register({ required: true })} placeholder="Email" />
        <AuthInput name="password" ref={register({ required: true })} placeholder="Password" />
        <AuthMainButton type="submit">Sign up</AuthMainButton>
      </form>
      <Link to="/signin">Go back to the sign in page</Link>
    </AuthContainer>
  </>);
}