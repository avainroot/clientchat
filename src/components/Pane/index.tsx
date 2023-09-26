import { useMessages } from "api/useMessages"
import { Button } from "components/Button"
import { useChatContext } from "lib/chatContext"
import { useState } from "react"
import ReactQuill from "react-quill"
import AttachmentIcon from '@mui/icons-material/Attachment'
import "react-quill/dist/quill.snow.css"
import { ReactComponent as ZipFormatIcon } from 'assets/icons/zip-format.svg'
import { ReactComponent as TxtFormatIcon } from 'assets/icons/txt-format.svg'
import { ReactComponent as SliderFormatIcon } from 'assets/icons/slider-format.svg'
import Tooltip from "@mui/material/Tooltip"
import { Base64IMG } from "components/Base64IMG"
import { Close } from "@mui/icons-material"
import { useSocketContext } from "lib/socketContext"

export const FileType: any = {
  'application/x-zip-compressed': <ZipFormatIcon />,
  'text/plain': <TxtFormatIcon />,
  'image/svg+xml': <SliderFormatIcon />,
  'image/jpeg': <SliderFormatIcon />,
  'image/png': <SliderFormatIcon />,
  'image/gif': <SliderFormatIcon />,
  'default': <SliderFormatIcon />
}

export const Pane = () => {
  const [value, setValue] = useState('');
  const [upload, setUpload] = useState<any>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const [typingTO, setTypingTO] = useState<number | undefined>();
  const { sendMessage } = useMessages();
  const { setCurrentScroll } = useChatContext();
  const { socket } = useSocketContext();
  const modules = {
    toolbar: false
    // toolbar: [
    //   ['bold', 'italic', 'blockquote'],
    //   ['image'],
    //   ['clean']
    // ],
  }

  const formats = [ ''
    // 'bold', 'italic', 'blockquote',
    // 'link', 'image'
  ]

  const attachmentHandler = (event: any) => {

    let filesArr = [];
    for (const key in event.target.files) {
      if (Object.prototype.hasOwnProperty.call(event.target.files, key)) {
        filesArr.push(event.target.files[key])
      }
    }
    setUpload([...upload, ...filesArr])
    event.target.value = '';
  }

  const sendCallback = () => {
    setUpload([]);
  }

  const typingHandler = (value: any) => {
    setValue(value)
    const typingSwitch = () => {
      const tt = setTimeout(()=> {
        console.log(`User ending typing!`)
        socket.emit('typing', {
          room: 1,
          typing: false
        })
        setTyping(false);
      }, 5000)
      setTypingTO(parseInt(tt.toString()))
    }
    if(!typing) {
      console.log(`User typing begins!`)
      typingSwitch()
      setTyping(true)
      socket.emit('typing', {
        room: 1,
        typing: true
      })
    } else {
      clearTimeout(typingTO)
      typingSwitch()
    }
  }

  return(
    <div className='ClientChat-Pane'>
      <div className='ClientChat-Pane_Upload'>
        <label htmlFor="clientChat-attachment">
          <AttachmentIcon />
        </label>
        <div className="ClientChat-Pane_Upload-List">
          {upload.map((item: any, i: number)=> 
            <Tooltip
              key={i} 
              title={item.name}
              placement='top'
            >
              <div>
                {!item.type.includes('image') ?  (<div className="ClientChat-Pane_Upload-Info">{FileType[item.type] || FileType['default']}<div>{item.name}</div></div>): 
                  <Base64IMG file={item} />
                }
                <div 
                  className="remove"
                  onClick={()=>{
                    setUpload(upload.filter((item: any, key: any)=> key !== i))
                  }}
                ><Close /></div>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <div className='ClientChat-Pane_Input'>
        <ReactQuill 
          className='ClientChat-Textarea' theme="snow" 
          placeholder={'Введите сообщение'}
          value={value} 
          modules={modules}
          formats={formats}
          onChange={typingHandler} 
          preserveWhitespace={true}
        />
        {((value !== '<p><br></p>' && value.length>0) || upload.length) ? <Button onClick={()=>{
          setCurrentScroll(0);
          sendMessage((value === '<p><br></p>' ? '': value), sendCallback, upload.length && upload);
          setValue('');
        }} /> : ''}
        <input
          id='clientChat-attachment'
          type='file'
          onChange={attachmentHandler}
          multiple={true}
        />
      </div>
    </div>
  )
}