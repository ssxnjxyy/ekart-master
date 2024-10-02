
import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import toast, { Toaster } from 'react-hot-toast'
import { BASE_URL } from '@/apis/baseurl';
import { Alert, AlertTitle } from '@mui/material';

export function UpdatePassword() {
  const [password, setPassword]=React.useState(
    {
      currentPassword:"",
      newPassword:""
  }
  )
  const [status,setStatus]=React.useState(null)
  const  handleChange=(e)=>{
    setPassword({...password,[e.target.name]:e.target.value})
  }
  const updatePass=()=>{
    console.log('updating ')
    const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "BetterErrors-2.10.1-CSRF-Token=07e2ffee-35d0-4d21-8d1b-cbfec0f83cef; __profilin=p%3Dt");

const raw = JSON.stringify({
  "currentPassword": password.currentPassword,
  "newPassword": password.newPassword
});

const requestOptions = {
  method: "POST",
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning':'true'
  },
  body: raw,
  redirect: "follow"
};

fetch( `${BASE_URL}/api/user/change_password`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    setStatus(result)

    if(result.is_error){
      toast.error(result.message);
    }
    else{
      toast.success(result.message);
      console.log('password updated succesfully')
      setPassword(
        {currentPassword:"",newPassword:""}
      )
      console.log(result)
    }
    })
  .catch((error) => console.error(error));

  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card className='rounded-2xl border shadow mt-3'>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Current password</InputLabel>
              <OutlinedInput label="Current password" name="currentPassword" type="password" onChange={handleChange}  value={password?.currentPassword}/>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>New Password</InputLabel>
              <OutlinedInput label="New Password" name="newPassword" type="password" onChange={handleChange} value={password?.newPassword}/>
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
        {status ? <Alert severity="success">
  <AlertTitle>{!status.is_error ?'Success':'Error'}</AlertTitle>
  {status?.message}
</Alert>
:null
}
          <Button variant="contained" onClick={updatePass}>Update</Button>
        </CardActions>
      </Card>
    </form>
  );
}
