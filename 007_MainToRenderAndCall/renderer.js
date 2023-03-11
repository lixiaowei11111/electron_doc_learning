const counter=document.getElementById('counter')

window.electronAPI.handleCounter((_event,value)=>{
  const oldValue=Number(counter.innerText)
  const newVal=oldValue+value
  counter.innerText=newVal
  _event.sender.send('counter-value',newVal)
})