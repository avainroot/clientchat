const pid = new URLSearchParams(new URL(document.currentScript.src).searchParams).get('projectId');

if(pid) {
  localStorage.setItem('pid', pid);
  fetch('http://localhost:3000/index.html')
  .then((data)=>{
    const chatContainer = document.createElement('div');
    chatContainer.id = 'clientChat';
    document.body.appendChild(chatContainer);
  
    data.text()
    .then((text)=>{
      const js = document.createElement('script');
      const css = document.createElement('link');
      js.src= text.match(/src="([^"]+)"/)[1];
      css.rel = 'stylesheet';
      css.href = text.match(/href="([^"]+)"/)[1];
      document.head.appendChild(css);
      document.head.appendChild(js);
    })
  })
} else console.log('Incorrect project ID!')
