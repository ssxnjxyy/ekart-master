import AdminPanel from '@/components/AdminPanel'
import { AuthContext } from '@/context/AuthContext'
import React, { useContext, useState } from 'react'

function Admin() {
    const [isAdmin,setIsAdmin]=useState(false)
    const user =useContext(AuthContext)
    console.log(user.user)

  return (
    <div>
        {
            user.user?.id==5?
            <>
            <AdminPanel/>
            </>
            :
            <>
            <div>
                Unauthorised
            </div>
            </>
        }
    </div>
  )
}

export default Admin