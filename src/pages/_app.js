import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from '../styles/theme';
import Header from "@/components/Header";
import { stripeKey } from "@/apis/baseurl";
import { CartProvider } from "@/context/CartContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import Script from "next/script";
export default function App({ Component, pageProps }) {
  return <AuthProvider> {/* Wrap with AuthProvider */}
    <AuthModalProvider>
  <ThemeProvider theme={theme}>
  <Script
                id='razorpay-checkout-js'
                src='https://checkout.razorpay.com/v1/checkout.js'
              />
    <CssBaseline /> 
   <CartProvider >

         <Header />
         <div className="mt-20 md:mt-24">
            <Component {...pageProps} />
        </div>

   </CartProvider>
      

  </ThemeProvider>
    </AuthModalProvider>
</AuthProvider>;
}
