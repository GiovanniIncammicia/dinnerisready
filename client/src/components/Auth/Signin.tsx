import React from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { signInWithGoogle, auth } from '../../firebase';
import { AuthContainer, AuthInput, AuthMainButton, AuthOr, AuthGoogleButton, AuthBackground } from './styles';
import { Flex } from '../Lib';
import googleLogo from '../../media/google.png';


export default function Signin () {
  const { register, handleSubmit } = useForm();
  const onSubmit = ({ email, password }: { email: string, password: string }) => {
    auth.signInWithEmailAndPassword(email, password)
    .catch(error => console.log('Error Signing in with email and password'));
  }

  return (<>
    <AuthBackground />
    <AuthContainer>
      <Flex flexDirection="column">
        <span role="img" aria-label="Logo">🍙</span>
        <h1>DinnerIsReady</h1>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AuthInput name="email" ref={register({ required: true })} placeholder="Email" />
        <AuthInput name="password" ref={register({ required: true })} placeholder="Password" />
        <AuthMainButton type="submit">SIGN IN</AuthMainButton>
        <Link to="/password-reset">Forgot password?</Link>
        <AuthOr><legend>or</legend></AuthOr>
        <AuthGoogleButton onClick={() => signInWithGoogle()}>
          <img src={googleLogo} alt="Google Logo" />
          <span>Sign in with Google</span>
        </AuthGoogleButton>
      </form>
      <Link to="/signup">Not a member yet? Create a <strong>free</strong> account</Link>
    </AuthContainer>
  </>);
}