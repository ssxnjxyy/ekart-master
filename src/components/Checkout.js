import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Button, Card, CardContent, CardHeader, MenuItem, Select, Typography } from '@mui/material'
import { CartContext } from '@/context/CartContext'
import { BASE_URL } from '@/apis/baseurl'
import { useRouter } from 'next/router'
import { Add } from '@mui/icons-material'

export default function Checkout() {
  const [selectedAddress, setSelectedAddress] = useState("")
  const {cart:cartDetails}  =useContext(CartContext)
  const {fetchCartItems}=useContext(CartContext)
  const totalCost = cartDetails?.reduce((sum, product) => sum + product.cost, 0)
  const [addresses,setAddresses]=useState([]);
  const router=useRouter()
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
  const handleCheckout = () => {
    if (!selectedAddress) {
      alert("Please select an address before proceeding to checkout.")
      return
    }
    // Here you would typically integrate with a payment gateway
    console.log("Proceeding to payment with address:", selectedAddress)
    handlePaymentMethodOnline(selectedAddress)
  }
  useEffect(()=>{
fetchAddresses();
  },[])
  const getOrderID=async(id)=>{
    const data=await fetch(`${BASE_URL}/api/order/create`, 
      {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`,
         'Content-Type': 'application/json',
           'ngrok-skip-browser-warning':'true'
       },
       body: JSON.stringify({
         address_id: id
       })
      }
       )
       return data.json()
  }
  const handlePaymentMethodOnline = async (id) => {
  

    try {
      const data = await getOrderID(id)
        if(data.is_error) return
      console.log(data)
      let options = {
        key: `rzp_test_vwSsDM8RW2LfWo` ,//nz
        // key:'rzp_test_oZaGqw0zjBTF3h',
        amount: data.razorpay.amount, //{data.amount}
        currency: 'USD',
        name: 'Fit and Healthy',


        image:
          'https://img.freepik.com/premium-vector/charity-abstract-logo-healthy-lifestyle_660762-34.jpg?size=626&ext=jpg',
        description: 'Test Transaction',
        order_id: data.razorpay.id, //{ data.orderId}
        'theme.color': '#FF6C22',
        handler: async (response) => {
          console.log(response);
          const order_details = {
            order_id: response.razorpay_order_id,
            transaction_id: response.razorpay_payment_id,
            status:"completed",
            // ,
            // transactionType: response.razorpay_signature,
          }
          // handle payment success
          // write a mutate and invalidate the getPharmacyDetails
          const p = await fetch(`${BASE_URL}/api/order/update-status`, 
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning':'true'
              },
              body: JSON.stringify(order_details)
             }
          )
          console.log(p)
          if(p.ok){
            fetchCartItems()
          }
          //nagivate to orders page
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()

      paymentObject.on('payment.failed', function (response) {
        console.log(response.error.code)
        console.log(response.error.description)
        console.log(response.error.source)
      })

      paymentObject.on('payment.success', function (response) {
        //queryClient.invalidateQueries(['pharmacyModuleInfoByDate'])
        console.log('on success ', response)
        router.push('orders')
      })
    } catch (error) {
      console.log('Error fetching Order ID:', error)
    }
    // setIsLoading(false)
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              {/* <CardTitle>Your Cart</CardTitle> */}
              <span>Your Cart</span>
            </CardHeader>
            <CardContent>
              {cartDetails?.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 mb-4">
                  <Image
                    src={product.signedUrl}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.brand} {product.model}</p>
                    <p className="text-sm text-gray-700">Quantity: {product.quantity}</p>
                    <p className="text-xs text-gray-800">Item price: {product.totalPrice}</p>
             
                  </div>
                  <div className="text-right">
                    
                  
                    <p className="font-semibold">${(product.cost ).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              {/* <CardTitle>Order Summary</CardTitle> */}
              <span>Order Summary</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(totalCost)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                {/* <Separator /> */}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  {/* <span>${(totalCost / 100).toFixed(2)}</span> */}
                </div>
              </div>
            </CardContent>
            <span className="flex flex-col space-y-4 p-5">
<div >         <Typography px={1}>Select Delivery Address</Typography>
              <Button className='text-xs ' onClick={()=>{
                router.push('/profile')
              }}><Add fontSize='sm'/> Add new Address</Button>
           
  </div>        <Select onChange={(e)=>setSelectedAddress(e.target.value)} value={selectedAddress}>
              {addresses?.map((address) => (  <MenuItem key={address.id} value={address.id}>
                {`${address.addressString},${address.state}-${address.pincode} ${address.country}`}
                </MenuItem>))}
                {/* <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select shipping address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.address}>
                      {address.address}
                    </SelectItem>
                  ))}
                </SelectContent> */}
              </Select>
              <Button className="w-full" onClick={handleCheckout}>Proceed to Payment</Button>
            </span>
          </Card>
        </div>
      </div>
    </div>
  )
}