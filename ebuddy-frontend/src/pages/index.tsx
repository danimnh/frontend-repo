import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useRouter } from 'next/router';
import {
  Button,
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  setError,
  setLoading,
  clearError,
  setUser,
  setSuccess,
} from '@/store/userState';
import { fetchUserData, updateUserData } from '@/apis/userApi';
import firebase_app from '@/config/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';

const Home = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);
  const success = useSelector((state: RootState) => state.user.success);
  const dispatch = useDispatch();
  const router = useRouter();

  // State for input fields
  const [displayName, setDisplayName] = useState<string | null>(
    user?.displayName || ''
  );
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>('');

  const [inputLabels, setInputLabels] = useState<
    { title: string; type: string }[]
  >([]);

  const auth = getAuth(firebase_app);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const userData = await fetchUserData(user?.accessToken, user?.uid);
        const mappedInputs = Object.keys(userData).map((key) => {
          let type = 'string';
          if (key === 'birthdate') {
            type = 'date';
          } else if (key === 'gender') {
            type = 'boolean';
          }
          return { title: key, type };
        });

        setInputLabels(mappedInputs);

        if (userData.birthdate) {
          setBirthdate(new Date(userData.birthdate));
        } else {
          setBirthdate(null);
        }

        setGender(userData.gender || '');
        dispatch(clearError());
      } catch (error: any) {
        console.error('Update failed:', error.message);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (user) {
      fetchData(); // Fetch data only if user is authenticated
    } else {
      router.push('/login'); // else, push back to login
    }
  }, [user, dispatch, router]);

  const handleButtonClick = async () => {
    try {
      dispatch(setLoading(true)); // Set loading state

      const payload = { displayName, birthdate, gender };

      await updateUserData(user?.accessToken, user?.uid, payload);

      console.log('User data updated successfully');
      dispatch(clearError());
      dispatch(setSuccess(true));
    } catch (error: any) {
      console.error('Update failed:', error.message);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));

      await signOut(auth);
      localStorage.removeItem('@token');
      dispatch(setUser(null));
      router.push('/login');
    } catch (error: any) {
      console.error('Logout failed:', error.message);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (success) {
      timeout = setTimeout(() => {
        dispatch(setSuccess(false));
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [success, dispatch]);

  const renderInput = (title: string, type: string) => {
    switch (type) {
      case 'string':
        return (
          <TextField
            key={title}
            label={title}
            value={displayName || ''}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ marginTop: 2 }}
          />
        );
      case 'date':
        return (
          <TextField
            label="Birthdate"
            type="date"
            value={birthdate ? birthdate.toISOString().split('T')[0] : ''}
            onChange={(e) => setBirthdate(new Date(e.target.value))}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
      case 'boolean':
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value as string)}
              fullWidth
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h4">Home</Typography>

      {/* loading indicator */}
      {loading && <Typography variant="body1">Loading...</Typography>}

      {/* success indicator */}
      {success && (
        <Typography variant="body1" color="success">
          User data updated successfully!
        </Typography>
      )}

      {/* error indicator */}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      {/* render labels & input from API */}
      {inputLabels.map((input) => renderInput(input.title, input.type))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        disabled={!user || loading}
        sx={{ marginTop: 2 }}
      >
        Update User Data
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ marginTop: 2, marginLeft: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Home;
