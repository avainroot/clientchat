import { IMessage } from "api/useMessages"
import { ChatUpload } from "components/ChatUpload";
import { format } from "date-fns"
import { useChatContext } from "lib/chatContext";
import { ChatMessageStatus } from "./ChatMessageStatus";

export const ChatMessage = ({user_fio, customer_id, message, create_date, files, id}: IMessage) => {
  const { tempUpload } = useChatContext();
  return(
    <div className={`ClientChat-Message${customer_id ? ' FromUser':''}`}>
      <div className="ClientChat-Message_Info">
        <div className="ClientChat-Message_User">
          {!customer_id && (
            <>
              {user_fio && (
                <>
                  <span>
                    {user_fio[0]}
                    {/* <img src="" alt=""/> */}
                  </span>
                  <div>{user_fio}</div>
                </>
              )}
            </>
          )}
        </div>
        <div className="ClientChat-Message_Date">
          {format(new Date(create_date), 'dd.MM.yyyy HH:mm')}
        </div>
      </div>
      {(files || tempUpload[id]) && (
        <div className="ClientChat-Message_UploadList">
          {files && 
            files.map((fileProps: any)=>{
              return <ChatUpload key={`${fileProps.id}_${fileProps.file_name}`} {...fileProps} />
            })
          }
          {(tempUpload[id] && !files) && tempUpload[id].map((file:any)=>{
            return <ChatUpload
              key={file.name}
              file_name={file.name}
              content_type={file.type}
              doc_id={id}
              temp={file} 
            />
          })}
        </div>
      )}
      {message && (
        <div className="ClientChat-Message_Text" dangerouslySetInnerHTML={{__html: message}}></div>
      )}
      <ChatMessageStatus 
        delivered={true}
        read={true}
      />
    </div>
  )
}