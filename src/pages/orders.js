import { BASE_URL } from '@/apis/baseurl'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function Orders() {
  const [orders,setOrders]=useState([])
  useEffect(() => {
    getOrders()
  },[])
  const getOrders=()=>{
    console.log('updating ')
    const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
myHeaders.append("Content-Type", "application/json");


const requestOptions = {
  method: "GET",
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning':'true'
  },
  redirect: "follow"
};

fetch( `${BASE_URL}/api/orders`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log(result)


    if(!result.is_error){
      setOrders(result?.orders?.filter(order=>order.status=='completed'))
    }
 
    })
  .catch((error) => console.error(error));

  }
  return (
    <div>
           <AllOrders orders={orders}/>
    </div>
  )
}

export default Orders

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box, 
  Chip,
  Avatar
} from '@mui/material';

const AllOrders = ({ orders }) => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total Price</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Order Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.uuid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.uuid}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* <Avatar src={order.signedUrl} alt={order.title} sx={{ marginRight: 2 }} /> */}
                    <Box>
                      <Typography variant="subtitle2">{order.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{`${order.brand} ${order.model}`}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">{order.quantity}</TableCell>
                <TableCell align="right">${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={order.status} 
                    color={order.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

;