// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useUser } from '@clerk/remix';

// const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//   const { isSignedIn, user, isLoaded } = useUser();
//   const [userState, setUserState] = useState({ isSignedIn, user, isLoaded });

//   useEffect(() => {
//     setUserState({ isSignedIn, user, isLoaded });
//   }, [isSignedIn, user, isLoaded]);

//   return (
//     <UserContext.Provider value={userState}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserContext = () => {
//   return useContext(UserContext);
// };
