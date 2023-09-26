import { createRoot } from 'react-dom/client';
import App from 'App';
import { AuthContextProvider } from 'lib/authContext';
import { ChatContextProvider } from 'lib/chatContext';
import { SocketContextProvider } from 'lib/socketContext';

const dev = process.env.NODE_ENV !== 'production';

if(dev) {
  localStorage.setItem('pid', '1');
  const chatContainer = document.createElement('div');
  chatContainer.id = 'clientChat';
  document.body.appendChild(chatContainer);
}

const root = createRoot(document.getElementById('clientChat') as HTMLElement);

root.render(
  <AuthContextProvider>
    <SocketContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </SocketContextProvider>
  </AuthContextProvider>
);
