import React, { Dispatch, SetStateAction, useState } from "react"
import { useContext } from "react"


export interface IChatContext {
  total: number
  setTotal: Dispatch<SetStateAction<number>>
  pagesLoaded: number
  setPagesLoaded: Dispatch<SetStateAction<number>>
  messages: any[]
  setMessages: Dispatch<SetStateAction<any[]>>
  currentScroll: number | undefined
  setCurrentScroll: Dispatch<SetStateAction<number | undefined>>
  tempUpload: any
  setTempUpload: Dispatch<SetStateAction<any>>
}

const ChatContext = React.createContext<IChatContext>({
  total: 0,
  setTotal: () => {},
  pagesLoaded: 1,
  setPagesLoaded: () => {},
  messages: [],
  setMessages: () => {},
  currentScroll: undefined,
  setCurrentScroll: () => {},
  tempUpload: {},
  setTempUpload: () => {}
})

export const ChatContextProvider = ({children}:any) => {
  const [pagesLoaded, setPagesLoaded] = useState<number>(1)
  const [total, setTotal] = useState<number>(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentScroll, setCurrentScroll] = useState<number | undefined>();
  const [tempUpload, setTempUpload] = useState<any>({});

  return(
    <ChatContext.Provider value={{
      pagesLoaded: pagesLoaded,
      setPagesLoaded: setPagesLoaded,
      total: total,
      setTotal: setTotal,
      messages: messages,
      setMessages: setMessages,
      currentScroll: currentScroll,
      setCurrentScroll: setCurrentScroll,
      tempUpload: tempUpload,
      setTempUpload: setTempUpload
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)