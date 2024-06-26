'use client';
import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setError, setLoading, setUser } from '@/store/userState';
import firebase_app from '@/config/firebaseConfig';
import Router from 'next/router';
import { updateUserData } from '@/apis/userApi';

const auth = getAuth(firebase_app);

const Login = () => {
  const dispatch = useDispatch();

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      if (token) {
        localStorage.setItem('@token', token);

        // Set user's display name if available
        const displayName = result.user.displayName || 'Anonymous';
        dispatch(
          setUser({
            uid: result.user.uid,
            displayName: displayName,
            email: result.user.email,
            accessToken: token,
          })
        );

        const payload = { displayName };

        await updateUserData(token, result.user.uid, payload);

        Router.push('/');
      }
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 1,
        boxShadow: 3,
        maxWidth: 400,
        margin: 'auto',
        marginTop: 8,
      }}
    >
      <Typography variant="h4">Login</Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={googleLogin}
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Login with Google
      </Button>
    </Box>
  );
};

export default Login;
