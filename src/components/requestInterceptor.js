import { useAuthModal } from "@/context/AuthModalContext"
export function requestInterceptor() {
  const { fetch: originalFetch } = window
  // const {openModal} = useAuthModal();

  window.fetch = async (...args) => {
    const [resource, config] = args
    // request interceptor starts
    // const defaultHeaders = {
    //   headers: {
    //     email,
    //     hasreportees: hasreportees ? '1' : '0', // headers only accepts string key-value pair
    //     accesstoken: accesstoken,
    //     'Content-Type': 'application/json',
    //   },
    // }

    const response = await originalFetch(resource, {
      // ...defaultHeaders,
      ...config,
    })
    if (response.status == 403) {
      console.log('redirecting from request interceptor')
      // window.location.replace('/login')
      // openModal()
      
    }
    return response
  }
}
