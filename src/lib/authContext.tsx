import axios from "axios"
import React, { useEffect, useState } from "react"
import { useContext } from "react"


type Session = {
  id?: number
  project_id?: number
  session_hash?: string
}

type Room = {
  id?: number
}

export interface IAuthContext {
  session: Session | null
  room: Room | null
  show: boolean
  logIn: () => void
  logOut: () => void
  loading: boolean
}

const AuthContext = React.createContext<IAuthContext>({
  session: {},
  room: {},
  show: false,
  logIn: () => {},
  logOut: () => {},
  loading: false
})

export const AuthContextProvider = ({children}:any) => {

  const [session, setSession] = useState<Session|null>(null);
  const [room, setRoom] = useState<Session|null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [project, setProject] = useState<string | null>();

  useEffect(()=>{
    setProject(localStorage.getItem('pid'))
  },[])

  const auth = async () => {
    if(!loading && !ready) {
      setLoading(!loading);
      await axios({
        url: `${process.env.REACT_APP_API_ENDPOINT}session`,
        method: 'POST',
        data: {
          project_id: project
        }
      }).then(async ({data}: any)=>{
        let dataSession = data.result[0];

        if(!dataSession.project_id){
          setTimeout(()=>{
            setLoading(false);
          }, 1500)
          return false
        }

        await axios({
          url: `${process.env.REACT_APP_API_ENDPOINT}rooms`,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-session-hash': dataSession.session_hash
          },
          data: {
            project_id: project
          }
        }).then(({data}: any)=>{
          setTimeout(()=>{
            setReady(true);
            setLoading(false);
            setSession(dataSession);
            setRoom(data.result[0]);
            setShow(!show);
          }, 2000)
        })
      })
    }
    if(ready) setShow(!show);
  }

  const unauth = () => {
    setShow(false);
    setLoading(false);
    // setSession(null);
  }

  return(
    <AuthContext.Provider value={{
      session: session, 
      show: show,
      room: room,
      logIn: auth, 
      logOut: unauth,
      loading: loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)