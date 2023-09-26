import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "lib/authContext";
import { Base64IMG } from "components/Base64IMG";
import { CircularProgress } from "@mui/material";
import { FileType } from "components/Pane";
import { useMessages } from "api/useMessages";
// import CloseIcon from '@mui/icons-material/Close';
import { Close } from "@mui/icons-material"

export const ChatUpload = ({file_name, content_type, doc_id, id, temp, pagesLoaded, room_id}: any) => {

  const { session, room } = useAuthContext();

  // const { tempUpload, setTempUpload } = useChatContext();

  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [resID, setResID] = useState<number>();

  const { delFile } = useMessages();

  useEffect(()=>{
    if(temp && room && session){
      const bodyData = new FormData();
      bodyData.append('projectId', session.project_id?.toString() || '');
      bodyData.append('roomId', room.id?.toString() || '');
      bodyData.append('entityId', doc_id);
      bodyData.append(`upload`, temp);
      axios.request({
        url: `${process.env.REACT_APP_API_FILES}/chats`,
        method: 'POST',
        data: bodyData,
        onUploadProgress: progressEvent => {
          if(progressEvent.loaded && progressEvent.total) {
            setProgress(parseInt(((progressEvent.loaded/progressEvent.total)*100).toString()))
          }
          if(progressEvent.loaded === progressEvent.total) {
            setUploading(!uploading);
            // let newTemp = tempUpload[doc_id].filter(({name}:any)=>name !== file_name);
            // setTempUpload(
            //   Object.keys(newTemp).length ?
            //   {
            //     ...tempUpload,
            //     ...{[doc_id]: tempUpload[doc_id].filter(({name}:any)=>name !== file_name)}
            //   } : {
            //     ...tempUpload, ...{[doc_id]: null}
            //   }
            // )
          }
        }
      }).then((r:any)=>{
        setResID(r.data.result.id)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return session && (
    <div className={`ClientChat-Message_UploadItem`}>
      {content_type.includes('image') ? (
        <a href={`${process.env.REACT_APP_API_FILES}/chats/${id || resID}/${file_name}?session_hash=${session.session_hash}`} download>
          <picture>
            {(temp && uploading) && (
              <CircularProgress size={30} color="inherit" variant="determinate" value={progress} />
            )}
            {deleting && (
              <CircularProgress size={30} />
            )}
            {!temp && (
              <img src={`${process.env.REACT_APP_API_FILES}/chats/${id || resID}/${file_name}?session_hash=${session.session_hash}`} alt={file_name} />
            )}
            {temp && (
              <Base64IMG file={temp} />
            )}
          </picture>
          {(id || resID) && (
            <span className="ClientChat-Message_UploadItem-Remove" onClick={(e)=>{setDeleting(true); e.preventDefault(); delFile(id || resID, doc_id, file_name);}}>
              <Close fontSize="small" />
            </span>
          )}
        </a>
      ):(
        <a href={`${process.env.REACT_APP_API_FILES}/chats/${id || resID}/${file_name}?session_hash=${session.session_hash}`} download>
          {(temp && uploading) && (
            <CircularProgress size={30} color="inherit" variant="determinate" value={progress} />
          )}
          {deleting && (
            <CircularProgress size={30} />
          )}
          <div className="ClientChat-Pane_Upload-Info">
            <i>{FileType[content_type] || FileType['default']}</i>
            <span>{file_name}</span>
          </div>
          {(id || resID) && (
            <span className="ClientChat-Message_UploadItem-Remove" onClick={(e)=>{setDeleting(true); e.preventDefault(); delFile(id || resID, doc_id, file_name);}}>
              <Close fontSize="small" />
            </span>
          )}
        </a>
      )}
    </div>
  )
}