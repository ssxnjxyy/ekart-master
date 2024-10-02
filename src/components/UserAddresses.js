import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CardHeader
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { BASE_URL } from '@/apis/baseurl';

 // Replace with your actual base URL

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState()
  const [newAddress, setNewAddress] = useState({
    country: '',
    state: '',
    pincode: '',
    addressString: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/address/list`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/address/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        },
        body: JSON.stringify(newAddress)
      });
      if (response.ok) {
        fetchAddresses();
        setOpenDialog(false);
        setNewAddress({ country: '', state: '', pincode: '', addressString: '' });
      } else {
        console.error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };
  const handleEditAddress = async (address) => {
    // Implement address editing logic here
    setNewAddress(address);
    setOpenDialog(true)
    setIsEdit(true);
  };
  const handleEditSave=async()=>{
  
    try {
        const response = await fetch(`${BASE_URL}/api/address/update/${newAddress.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAddress)
        });
        if (response.ok) {
          fetchAddresses();
          setOpenDialog(false);
        //   setEditingAddress(null);
          setNewAddress({ country: '', state: '', pincode: '', addressString: '' });
             } else {
               }
      } catch (error) {
        console.error('Error updating address:', error);
        // showSnackbar('Error updating address', 'error');
      }
  }
  const handleDeleteAddress = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/address/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.is_error) {
        fetchAddresses();
        // showSnackbar('Address deleted successfully', 'success');
      } else {
        // showSnackbar('Failed to delete address', 'error');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    //   showSnackbar('Error deleting address', 'error');
    }
  };

  return (
    <Card className='rounded-2xl border shadow mt-3'>
       <div className='flex justify-between p-2 items-center'>
       <CardHeader  title="My Addresses" />

      <Button 
        startIcon={<AddIcon />} 
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
        >
        Add New Address
      </Button>
          </div>
      <CardContent>
        {addresses.map((address, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1">{address.addressString}</Typography>
              <Typography variant="body2">{address.state}, {address.country}</Typography>
              <Typography variant="body2">Pincode: {address.pincode}</Typography>
              <Box sx={{ mt: 1 }}>
                <Button startIcon={<EditIcon />} size="small" onClick={()=>handleEditAddress(address)}>Edit</Button>
                <Button startIcon={<DeleteIcon />} size="small" color="error" onClick={()=>handleDeleteAddress(address.id)}>Delete</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
     </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="country"
            label="Country"
            type="text"
            fullWidth
            variant="outlined"
            value={newAddress.country}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            variant="outlined"
            value={newAddress.state}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="pincode"
            label="Pincode"
            type="text"
            fullWidth
            variant="outlined"
            value={newAddress.pincode}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="addressString"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newAddress.addressString}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
         {isEdit?<Button onClick={handleEditSave}>Save Changes</Button>: <Button onClick={handleAddAddress}>Add</Button>}
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserAddresses;