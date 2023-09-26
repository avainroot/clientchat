/* eslint-disable react-hooks/exhaustive-deps */
import { CircularProgress } from "@mui/material";
import { useMessages } from "api/useMessages";
import { ChatMessage } from "components/ChatMessage"
import { useAuthContext } from "lib/authContext";
import { useChatContext } from "lib/chatContext";
import { useSocketContext } from "lib/socketContext";
import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react"
import 'simplebar-react/dist/simplebar.min.css'

export const ChatWindow = () => {

  const { messages, total, setMessages, currentScroll, setCurrentScroll, pagesLoaded, setPagesLoaded } = useChatContext();

  const { room } = useAuthContext();

  const { socket } = useSocketContext();

  const { getMessages } = useMessages();
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  
  const ref = React.createRef<HTMLElement>();

  useEffect(()=>{
    if(ref.current && currentScroll === 0) {
      ref.current.scrollTop = ref.current.scrollHeight;
      return
    }
    if(ref.current && currentScroll) { 
      ref.current.scrollTop = ref.current.scrollHeight - currentScroll
    }
    if(ref.current && pagesLoaded === 1) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  },[messages])

  useEffect(()=>{
    getMessages().then((r)=>{
      setMessages(r)
    })
  },[])

  useEffect(()=>{
    if(room && socket) {
      socket.on('fileUploaded', (data: any)=>{
        console.log('Test Uploaded');
        
        // if(room.id === data.room_id) {
          getMessages().then((r)=>{
            setMessages(r)
          })
        // }
      })

      socket.on('send-message', (data: any)=>{
        if(room.id === data.room_id) {
          getMessages().then((r)=>{
            setMessages(r)
          })
        }
      })
  
      return () => {
        socket.off('fileUploaded')
        socket.off('send-message')
      }
    }
  },[socket, room])

  useEffect(()=>{
    if(ref.current) {
      ref.current.addEventListener('scroll', (e:any)=>{
        if(ref.current && e.target.scrollTop === 0 && !loadingMessage && ref.current.scrollHeight > ref.current.clientHeight && total > messages.length) {
          setPagesLoaded(pagesLoaded + 1);
        }
      });
    }
  })

  useEffect(()=>{
    if(ref.current && ref.current.scrollHeight > ref.current.clientHeight && !loadingMessage && pagesLoaded > 1) {
      setCurrentScroll(ref.current?.scrollHeight);
      setLoadingMessage(true);
      getMessages(pagesLoaded).then((r)=>{
        setTimeout(()=>{
          setLoadingMessage(false);
          setMessages([...r, ...messages])
        },2000)
      })
    }
  },[pagesLoaded])

  return(
    <div className="ClientChat-ChatWindow">
      <SimpleBar
        style={{ maxHeight: '334px' }}
        autoHide={false}
        scrollbarMinSize={18}
        scrollbarMaxSize={18}
        defaultValue={0}
        clickOnTrack={false}
        scrollableNodeProps={{ ref: ref }}
      >
        <div className="ClientChat-ChatWindow_Wrap">
          {total > messages.length && (
            <div className="ClientChat-ChatWindow_Preloader">
              {loadingMessage && <CircularProgress size={30} />}
            </div>
          )}
          {messages && (
            messages.map(({
              id,
              message,
              customer_id,
              create_date,
              files
            })=> {
              return(
                <ChatMessage 
                  key={id}
                  id={id}
                  create_date={create_date}
                  message={message}
                  user_id={0}
                  user_fio={''}
                  files={files}
                  customer_id={customer_id}
                />
              )
            })
          )}
        </div>
      </SimpleBar>
      <div className="ClientChat-ChatWindow_Info">
        Печатает...
      </div>
    </div>
  )
}