import { useContext, useState } from 'react';

import LoadingOverlay from '../components/ui/LoadingOverlay';
import { createUser } from '../util/auth';
import { AuthContext } from '../store/auth-context';
import { Alert } from 'react-native';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({email, password}) {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Authentication failed',
        'Could not create user, pleasr check your input and try again later.'
      )
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Creating User....' />
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;