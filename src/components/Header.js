// components/Header.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, CssBaseline, Popover, Box, IconButton, Divider, MenuList, MenuItem, Badge } from '@mui/material';
import { AdminPanelSettings, Logout, PersonOutlineRounded, Settings, ShoppingCartOutlined } from '@mui/icons-material'; 
import Link from 'next/link'; 
import { AuthContext } from '../context/AuthContext'; 
import AuthModal from './AuthModal'; // Import your AuthModal
import { CartContext } from '@/context/CartContext';
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const {cart} =useContext(CartContext);
  const anchorEl =useRef();
  const [token ,setToken]=useState();
  useEffect(()=>{
    if(!token){
        setToken(localStorage.getItem('token'));
    } 
    // console.log(cart)
  },[])
  const [open,setOpen]=useState(false)
  const handleOpen=()=>{
    setOpen(true)
  }
  const onClose=()=>{
    setOpen(false)
  }
  
  return (
    
   
        <AppBar position="fixed">
            
          <Toolbar style={{ padding: '10px', backgroundColor: 'white', width: '100%',borderBottom:'solid 1px gray' }}>
          <Typography variant="h6" sx={{ textDecoration: 'none', color: 'inherit' }}>
          <Link href="/" className="flex items-center justify-center gap-3" prefetch={false}>
          <DumbbellIcon className="h-6 w-6 text-primary" />
          <span className="text-primary font-bold">Fit & Healthy</span>
        </Link>
           </Typography>
            <div className=" flex items-center ml-auto">
           
              {user ?
          <>
           <Link href="/cart"  className='p-5'> {/* Replace with your actual cart route */}
               
               <Badge badgeContent={cart?.length} color="primary">
               <ShoppingCartOutlined /> 
              </Badge>
              
           
          </Link>
                <div className="flex items-center gap-3 ">
                  <span className='border py-2 px-4  rounded-full font-bold text-xl cursor-pointer' onClick={handleOpen} ref={anchorEl}>{user?.first_name.substring(0,1).toUpperCase()}</span>
                  <Popover
      anchorEl={anchorEl.current}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{user?.first_name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      {/* {userRole!='Admin'&& */}
        <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        
        <Link href={'/profile'} onClick={onClose}  className="flex items-center p-2 gap-3">
          <PersonOutlineRounded/>
          <span>Profile</span>
        </Link>
        <Link href={'/orders'} onClick={onClose}  className="flex items-center p-2 gap-3">
          <ShoppingCartOutlined/>
          <span>Orders</span>
        </Link>
        {
             user?.id==5&&
             <Link href={'/admin'} onClick={onClose}  className="flex items-center p-2 gap-3">
          <AdminPanelSettings/>
          <span>Admin</span>
        </Link>
        }
        <MenuItem onClick={logout}>
           <Logout/>
        <span>Logout
          </span>  
        </MenuItem>
      </MenuList>
      {/* } */}
    </Popover>
                </div>
                
          </>
                // </div>
                : 
                <AuthModal/>
              }
            </div>


          </Toolbar>
        </AppBar>
  
  );
};
function DumbbellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="m21.5 21.5-1.4-1.4" />
      <path d="M3.9 3.9 2.5 2.5" />
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    </svg>
  )
}

export default Header;