// components/AuthModal.js
import React, { useContext } from 'react';
import { 
  Modal, 
  Box, 
  Tab, 
  Tabs, 
  Typography,
  Button,
  useMediaQuery,
  useTheme 
} from '@mui/material';
import { Login, PersonAdd } from '@mui/icons-material';
import LoginForm from './Login';
import Signup from './Signup';
import { AuthContext } from '@/context/AuthContext';
import { useAuthModal } from '@/context/AuthModalContext';

const AuthModal = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const { user, logout } = useContext(AuthContext);
  const { isOpen, openModal, closeModal } = useAuthModal();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (user) {
    return (
      <span>
        {user?.email}user
        <Button variant="contained" onClick={logout} color="secondary" className='ml-2'>Logout</Button>
      </span>
    );
  }

  return (
    <> 
      <Button variant="outlined" onClick={openModal}>
        Login / Sign Up 
      </Button>

      <Modal 
        open={isOpen}
        key='authentication'
        onClose={closeModal} 
        aria-labelledby="auth-modal-title" 
        aria-describedby="auth-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isSmallScreen ? '90%' : 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography id="auth-modal-title" variant="h6" component="h2" align="center" gutterBottom>
            Welcome!
          </Typography>

          <Tabs value={activeTab} onChange={handleChangeTab} centered> 
            <Tab icon={<Login />} label="Login" />
            <Tab icon={<PersonAdd />} label="Sign Up" />
          </Tabs>

          {activeTab === 0 && <LoginForm />}
          {activeTab === 1 && <Signup />}
        </Box>
      </Modal>
    </>
  );
};

export default AuthModal;