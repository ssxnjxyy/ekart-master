import Header from '../components/Header';


import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { AccountInfo } from '../components/AccountInfo';
import { AccountDetailsForm } from '../components/AccountDetailsForm';
import { AuthContext } from '@/context/AuthContext';
import { UpdatePassword } from '@/components/UpdatePassword';
import UserAddresses from '@/components/UserAddresses';


function Profile() {
  
  const { user, logout } = useContext(AuthContext);
  const [userDetails,setUserDetails]=useState();
  useEffect(()=>{
    setUserDetails(user)
    console.log(user)
  },[user])
  if(!userDetails){
    return null
  }
  return (
   <>
   {

      <div className="md:flex  w-full">

  
      <div className="p-5">
    
        <div className="flex flex-col">
        
        <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account Details</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo userDetails={userDetails}/>
          <div className='w-full'>

          <UpdatePassword/>
          </div>
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm userDetails={userDetails} setUserDetails={setUserDetails}/>
          <UserAddresses/>
        </Grid>
      </Grid>
    </Stack>
 
          </div>

      </div>

     

    </div>
    // <AuthModal enable={true}/>
    }
   </>
  )
}

export default Profile