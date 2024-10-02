import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';



export function AccountInfo({userDetails:user}) {

  return (
    <Card className='rounded-3xl border'>
      <CardContent>
        <Stack spacing={4} sx={{ alignItems: 'center' }} className='p-5'>
          <div>
           <span className='bg-primary border py-4 px-5  mt-4 rounded-full font-bold text-2xl'>{user?.first_name?.substring(0,1).toUpperCase()}</span>
           </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.first_name} {user?.last_name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.email}
            </Typography>
            {/* <Typography color="text.secondary" variant="body2">
              {user?.location}
            </Typography> */}
          </Stack>
        </Stack>
      </CardContent>
  
    </Card>
  );
}
