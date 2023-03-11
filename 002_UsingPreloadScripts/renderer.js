const information = document.getElementById("info");
information.innerText = `本应用正在使用的chrome版本${versions.chrome()},node版本为${versions.node()},electron的版本为${versions.electron()}`;
console.log(versions,'versions');

const ipcConnect=async()=>{
  const res=await window.versions.ping()
  console.log(res);// 'pong
}
ipcConnect();