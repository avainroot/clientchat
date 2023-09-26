import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthContext } from 'lib/authContext';

export const Start = ({loading}:any) => {

  const { logIn } = useAuthContext();

  return(
    <div 
      className="ClientChat-Start"
      onClick={logIn}
    >
      {loading ? (
        <CircularProgress color="inherit" />
      ):(
        <ChatOutlinedIcon />
      )}
    </div>
  )
}