import { ChatWindow } from 'components/ChatWindow';
import { Pane } from 'components/Pane';
import 'styles/common.scss'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Start } from 'components/Start';
import { useAuthContext } from 'lib/authContext';

function App() {

  const { show, logOut, loading } = useAuthContext();

  return (
    <>
      {show ? (
        <div className="ClientChat">
          <div className="ClientChat-Head">
            <div></div>
            <div 
              className='ClientChat-Close'
              onClick={logOut}
            >
              <CloseRoundedIcon />
            </div>
          </div>
          <ChatWindow />
          <Pane />
        </div>
      ):(
        <Start loading={loading} />
      )}
    </>
  );
}

export default App;
