import DoneIcon from '@mui/icons-material/Done'
import DoneAllIcon from '@mui/icons-material/DoneAll'

interface IStatus {
  delivered: boolean
  read: boolean
}

export const ChatMessageStatus = ({delivered, read}:IStatus) => {
  return(
    <div className={`ClientChat-Message_Status`}>
      {delivered && !read && (
        <DoneIcon />
      )}
      {delivered && read && (
        <DoneAllIcon />
      )}
    </div>
  )
}