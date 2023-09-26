import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./authContext";

interface ISocketContext {
  socket: any
}

const SocketContext = React.createContext<ISocketContext>({
  socket: null
})

export const SocketContextProvider = ({children}:any) => {
  const wsURL = process.env.REACT_APP_WS;
  const [socket, setSocket] = useState<any>(null);
  const { session } = useAuthContext();

  useEffect(()=>{
    if(wsURL && session) {
      const ws = io(wsURL,{
        auth: {
          sess: session.session_hash
        }
      });

      setSocket(ws);

      return () => {
        ws.off('connect')
        ws.off('message')
      }

    }
  },[session, wsURL])

  return(
    <SocketContext.Provider
      value={{
        socket: socket
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)