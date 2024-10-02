import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '@/context/CartContext';
import { BASE_URL } from '@/apis/baseurl';
import { Button, TextField, Rating, Card, CardContent, Typography, Box } from '@mui/material';
import { Add, Remove, ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useAuthModal } from '@/context/AuthModalContext';
import Image from 'next/image';
const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { cart, addToCart, incrementCartItem, decrementCartItem } = useContext(CartContext);
  const cartItem = cart?.find((item) => item.id === id);
  const [quantity,setQuantity] =useState( ); // Default to 0 if not in cart
 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);
  useEffect(() => {
    const cartItem = cart?.find((item) => item.id == id);
    console.log(cartItem)

    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [cart, id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        }
      });
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/product/reviews/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning':'true'
        }
      });
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleAddToCart = () => {
    // console.log('')
    if (!cart) {
      openModal();
      return;
    }
    else{
      addToCart(product, 1);
      // setQuantity(1);
    }
   
  };

  const {openModal} = useAuthModal()
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/product/review/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: id,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });
      if (response.status==200 ) {
        fetchReviews();
        setNewReview({ rating: 0, comment: '' });
      }
      else if(response.status==403){
        openModal()
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (loading) {
    return (
      <Box className="h-screen flex justify-center items-center">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="h-screen flex justify-center items-center">
        <Typography>Product not found</Typography>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 py-8">
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => router.push('/products')}
        className="mb-4"
      >
        Back to Products
      </Button>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Box className="flex justify-center items-center bg-gray-100 rounded-lg p-4">
          <Image
            src={product.signedImageUrl}
            alt={product.model}
            width={300}
            height={300}
            className="max-w-full h-auto object-contain"
          />
        </Box>

        <Box>
          <Typography variant="h4" className="font-bold mb-2">{product.brand}</Typography>
          <Typography variant="h5" className="mb-2">{product.model}</Typography>
          <Typography variant="h6" className="text-primary font-bold mb-4">₹ {product.price}</Typography>
          <Typography className="mb-4">{product.description}</Typography>

          {/* <Box className="flex items-center space-x-4 mb-4">
            {quantity > 0 ? (
              <>
                <Button
                  onClick={() => decrementCartItem(id)}
                  variant="outlined"
                  color="primary"
                >
                  <Remove />
                </Button>
                <Typography>{quantity}</Typography>
                <Button
                  onClick={() => incrementCartItem(id)}
                  variant="outlined"
                  color="primary"
                >
                  <Add />
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            )}
          </Box> */}
             <div className="flex justify-start  space-x-4 p-2 ">
          {quantity >0 ? <>
            <Button
              onClick={() => decrementCartItem(id)}
              
              color="error"
              variant="outlined"
            >
              <Remove/>
            </Button>
          

          <span className="text-lg font-semibold">{quantity}</span> {/* Display quantity */}

          <Button
            onClick={() => incrementCartItem(id)}
            variant="outlined"
            color="primary" >
            <Add/>
          </Button>
          </>:
        <Button
        variant="contained"
        color="primary"
        startIcon={<ShoppingCart />}
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
        }
        </div>
        </Box>
      </Box>

      <Box className="mt-12">
        <Typography variant="h5" className="mb-4">Customer Reviews</Typography>
        {reviews.map((review, index) => (
          <Card key={index} className="mb-4">
            <CardContent>
              <Rating value={review.rating} readOnly />
              <Typography variant="body1">{review.comment}</Typography>
              <Typography variant="caption" color="text.secondary">
                on {new Date(review.created_at).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}

        <Box className="mt-8">
          <Typography variant="h6" className="mb-2">Write a Review</Typography>
          <form onSubmit={handleSubmitReview}>
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview({ ...newReview, rating: newValue });
              }}
              className="mb-2"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Your review"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="mb-2"
            />
            <Button type="submit" variant="contained" color="primary">
              Submit Review
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetails;