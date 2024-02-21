import React, { createContext, useState } from 'react'



export const openMenuContext = createContext(null);


const OpenMenuProvider = ({children}) => {

const[openMenu,setOpenMenu]  = useState(false);

  return (
    <openMenuContext.Provider value={{openMenu,setOpenMenu}}>
       {children}
    </openMenuContext.Provider>
  )
}


export default OpenMenuProvider