import Checkout from '@/components/Checkout'
import { CartContext } from '@/context/CartContext'
import { ArrowBack, BackHand } from '@mui/icons-material'
import { Button } from '@mui/material'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
// import { useShoppingCart } from 'use-shopping-cart'
function CartPage() {
    const [status, setStatus] = useState('idle')
    const {cart:cartDetails}  =useContext(CartContext)
    // const { redirectToCheckout, cartCount,cartDetails } = useShoppingCart()   
    // console.log(cartDetails)
    const handlePay = async() => {
      // 
    }
    console.log(cartDetails)
  return (
//     <div className='md:m-24'>
//    <div>
//       <h2 className='text-4xl font-semibold p-5'>Shopping Cart</h2>
//       <div>
// {Object.keys(cartDetails)?.map((each)=>{
//   return <div key={each}>
//         <span>{cartDetails[each].brand}</span>
//     </div>
// })}
//       </div>
//    </div>
//         {/* {status} */}
//         <Button onClick={handlePay}>Pay</Button>
//     </div>
<div>
  <Link className='rounded-lg shadow hover:shadow-md m-2 p-2  ' href={'/products'} >
  <ArrowBack/>
  Go to Products
  </Link>
  {/* <CheckoutPage/> */}
<Checkout/>
</div>
  )
}

export default CartPage