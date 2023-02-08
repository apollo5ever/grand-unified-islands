import React, {createContext, useState} from 'react';

// const LoginContext = React.createContext([{}, () => {}]);
export const LoginContext = createContext({});

export const LoginProvider = ({children}) => {
  const [state, setState] = useState({});
  const value = {
    state, setState
  }

  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  );
}
