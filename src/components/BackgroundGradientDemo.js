"use client";
import React, { useContext } from "react";
// import { BackgroundGradient } from "../ui/background-gradient";
// import { IconAppWindow } from "@tabler/icons-react";
import Image from "next/image";
import { CartContext } from "@/context/CartContext";
import { BsEyeFill, BsPlus, BsSubtract } from "react-icons/bs";
import Link from "next/link";
import { Button } from "@mui/material";
import { Add, Remove, RemoveCircle, RemoveCircleSharp, RemoveFromQueue, RemoveModerator } from "@mui/icons-material";
import Loader from "./Loader";

export function BackgroundGradientDemo({product}) {
  const { cart, addToCart, incrementCartItem, decrementCartItem } = useContext(CartContext);
  const { id, signedImageUrl, brand, model, price,attachmentLink,description,totalPrice } = product;
  console.log(product)
  // Find the item in the cart to get its quantity 
  const cartItem = cart?.find((item) => item.id === id);
  const quantity = cartItem ? cartItem?.quantity : 0; // Default to 0 if not in cart
  const handleAddToCart = () => {
    addToCart(product, 1); // assuming default quantity is 1
  };

  return (
      <div className="rounded-xl shadow border max-w-sm p-4 sm:p-10 ">
        <div  className="flex h-[200px] w-full overflow-hidden">
        <Image
            src={signedImageUrl}

          alt=""
          height="62"
          width="400"
          className="object-contain"
        />
        </div>
       <div className="flex justify-between items-baseline">

        <p className="flex flex-col text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
       
       <span>{ model}
        </span> 
        <span className="text-sm text-gray-600">
        {brand}
          </span>  
        </p>
        <span className="">
        ₹{totalPrice}
          </span>
       </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
       {description}
           </div>
           
          
        <div className="flex justify-center  space-x-4 p-2 ">
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
          </>:null}
        </div>
        <Actions product={product} quantity={quantity}/>
      </div>
  );
}
function Actions({ product,quantity }) {
  const { addToCart, incrementCartItem, decrementCartItem } = useContext(CartContext);
  const { id } = product;

  const handleAddToCart = () => {
    addToCart(product, 1); // assuming default quantity is 1
  };

  return (
    <div className="flex justify-between items-center">
        
      {quantity==0 ?<>    <Link
        href={`/products/${id}`}
        className="text-primary bg-white flex justify-center items-center text-xs"
      >
        More Details
      </Link>
   
          <Button variant="outlined" onClick={handleAddToCart}>

          Add to Cart
          </Button>
       </> :
       <div className="flex justify-center w-full">
       <Link
     href={`/products/${id}`}
     className="text-primary  text-xs"
   >
     More Details
   </Link>
       </div>  
      }
     </div>
   
   
  );
}
