import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Alert } from '@mui/material';
import Image from 'next/image';
import { Edit, EditAttributesOutlined, EditOutlined, UploadFile } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { BASE_URL } from '@/apis/baseurl';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    dailog:''
  });
  const [error,setError]=useState(null);
  const [file,setFile]=useState(null);
  useEffect(() => {
    fetchProducts();
  }, []);
  const imgInput=useRef(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        }
      });
      console.log(response.data.products)
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateProduct = async () => {
    console.log(file)
    try {
      const formData = new FormData();
      formData.append('brand', selectedProduct?.brand );
      formData.append('model', selectedProduct?.model );
      formData.append('price', selectedProduct?.price );
      formData.append('totalPrice', selectedProduct?.totalPrice);
      formData.append('file', file);
      formData.append('title', selectedProduct?.title );
      formData.append('description', selectedProduct?.description );
      formData.append('features', selectedProduct?.features );
  
      await axios.post(`${BASE_URL}/api/product/create`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'ngrok-skip-browser-warning':'true'
        }
      });
      fetchProducts();
      setOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('brand', selectedProduct.brand);
      formData.append('model', selectedProduct.model);
      formData.append('price', selectedProduct.price);
      formData.append('totalPrice', selectedProduct.totalPrice);
      formData.append('file', file);
      formData.append('title', selectedProduct.title);
      formData.append('description', selectedProduct.description);
      formData.append('features', selectedProduct.features);

      await axios.post(`${BASE_URL}/api/product/update/${selectedProduct.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,

    'ngrok-skip-browser-warning':'true'
        }
      });
      fetchProducts();
      setOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };


  const handleClickOpen = (product) => {
    if(!product){
      //set dailog as create
      setSelectedProduct((prevProduct) => ({
        'dailog': 'create'
      }));
    }
    else{
      setSelectedProduct((prevProduct) => ({
        ...product,
        'dailog': 'update'
      }));
     

    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setError(null)
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'price', headerName: 'Price', width: 110 },
    { field: 'totalPrice', headerName: 'Total Price', width: 110 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button variant="outlined" color="primary" onClick={() => handleClickOpen(params.row)}>
            <EditOutlined color=''/>
          </Button>
        </Box>
      )
    }
  ];
  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'file') {
      console.log(files[0],value)
      const Imagefile = files[0];
      
      if (Imagefile.type === 'image/png' || Imagefile.type === 'image/jpeg') {

          const reader = new FileReader()
          reader.onloadend = () => {
            setSelectedProduct((prevProduct) => ({
              ...prevProduct,
              [name]: reader.result
            }));
          }
          setFile(files[0])
          reader.readAsDataURL(Imagefile)
        
      } else {
        alert('Only PNG or JPEG files are allowed.');
      }
    } else {
      setSelectedProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value
      }));
    }
  };
  const handleDelete=() => {
    
const requestOptions = {
  method: "DELETE",
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning':'true'
  }
};

fetch(`${BASE_URL}/api/product/delete/${selectedProduct?.id}`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log(result)
    if(!result.is_error){
      setProducts(products.filter((product) => product.id!== selectedProduct.id));
      handleClose()
      toast.success(result.message)
    }
    else{
      setError(result.message)
    }

})
  .catch((error) => console.error(error));
  }
  const handlePhotoUpload = () => {
    console.log('Photo Upload')
    imgInput.current.click()
  }
  return (
    <div style={{ height: '85vh' }} className='flex flex-col gap-5 md:w-[70%] w-full'>
     <div className='flex p-5'>
     <Button variant="outlined" color="primary" onClick={() => handleClickOpen(null)}>
        Create Product
      </Button>
        </div>
        <div className='flex justify-center px-10'>
       
      <DataGrid rows={products} columns={columns} pageSize={5} className='shadow' rowSelection={false}/>
        </div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{selectedProduct?.dailog=='create' ? 'Create Product' : 'Update Product Details'}</DialogTitle>
        <DialogContent className='flex  gap-3 items-center'>
            <div className='flex flex-col items-center gap-3'>
            <Button className='flex gap-3' onClick={handlePhotoUpload}><span>Upload Image</span><UploadFile 
             
            /></Button>
     
            <Image src={selectedProduct?.signedImageUrl||selectedProduct?.file} alt='IMAGE' className='p-3 pt-0' width={200} height={200} priority/>
            <input

        name="file"
        type="file"
        className='hidden'
        ref={imgInput}
        // inputProps={{ accept: 'image/png, image/jpeg' }}
        onChange={handleInputChange}
      />
      <TextField label="Title" name="title" value={selectedProduct?.title} onChange={handleInputChange} />
         
      </div>
      <div className='grid grid-cols-2 gap-3 justify-center p-4'>
      <TextField label="Brand" name="brand" value={selectedProduct?.brand} onChange={handleInputChange} />
          <TextField label="Model" name="model" value={selectedProduct?.model} onChange={handleInputChange} />
          <TextField label="Price" name="price" value={selectedProduct?.price} onChange={handleInputChange} />
          <TextField label="Total Price" name="totalPrice" value={selectedProduct?.totalPrice} onChange={handleInputChange} />
          <TextField label="Description" name="description" value={selectedProduct?.description} onChange={handleInputChange} multiline rows={4} className='col-span-2' />
          <TextField label="Features" name="features" value={selectedProduct?.features} onChange={handleInputChange} multiline rows={4} className='col-span-2' />
         <div className='col-span-2'>{error && <Alert severity='error'>{error}</Alert>}</div> 
     
      </div>
          </DialogContent>
        <DialogActions>
         {selectedProduct?.dailog=='update' &&<Button onClick={handleDelete} color='error'>Delete</Button>}
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={selectedProduct?.id ? handleUpdateProduct : handleCreateProduct}>
            {selectedProduct?.id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPanel;