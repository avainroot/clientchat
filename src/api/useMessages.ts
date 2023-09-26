import axios from "axios";
import { useAuthContext } from "lib/authContext";
import { useChatContext } from "lib/chatContext";

export interface IMessage {
  create_date: string
  customer_id: boolean
  message: string
  user_fio: string
  user_id: number
  id: number
  files: any[] | null
}

const API = process.env.REACT_APP_API_ENDPOINT;

export const useMessages = () => {
  const { setMessages, setTotal, setPagesLoaded, setTempUpload, tempUpload } = useChatContext();
  const { session, room } = useAuthContext();

  const sendMessage = async (message: string, callback: any, upload?: any) => {
    if(session && room) {
      await axios({
        url: `${API}rooms/${room.id}/messages`,
        method: 'POST',
        data: {
          'message': message,
          'project_id': session.project_id?.toString()
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-session-hash': session.session_hash || ''
        }
      }).then((result)=>{
        if(upload){
          const {data} = result;
          setTempUpload(
            {...tempUpload, ...{[data.result[0].id]: upload}}
          )
          callback();
        }
        getMessages(1).then((r)=>{
          setPagesLoaded(1)
          setMessages(r)
        })
      })
    }
  }

  const delFile = async (id: number, doc_id: number, file_name: string) => {
    if(session){
      let result:any
      await axios({
        url: `${process.env.REACT_APP_API_FILES}/chats/${id}`,
        method: 'DELETE',
        headers: {
          "x-session-hash": session.session_hash
        }
      }).then(()=>{
        if(tempUpload[doc_id] !== null){
          let delUploadFile = tempUpload[doc_id].filter(({name}:any)=> name !== file_name );
          setTempUpload(
            {
              ...tempUpload,
              ...{[doc_id]: delUploadFile.length ? delUploadFile : null}
            }
          );
        }
        getMessages(1).then((r)=>{
          setPagesLoaded(1)
          setMessages(r)
        })
      })
      return result;
    }
  }

  const getMessages = async (page?: number, limit?: number) => {

    limit = limit || 100;
    page = page || 1;

    let query: string = `page=${page}&limit=${limit}`;

    if(session && room) {
      let result:any
      await axios({
        url: `${API}rooms/${room.id}/messages?${query}`,
        method: 'GET',
        headers: {
          "x-session-hash": session.session_hash
        }
      }).then((response)=>{
        result = response.data.result.sort((a: any, b: any) => a.id - b.id);
        setTotal(result.length? result[0].count : 0)
      })
      return result;
    }
  }

  return {
    delFile: delFile,
    getMessages: getMessages,
    sendMessage: sendMessage,
  }
}