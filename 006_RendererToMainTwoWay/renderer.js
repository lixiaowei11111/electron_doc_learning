const setBtn = document.getElementById("btn");
const titleInput = document.getElementById("filePaths");
setBtn.addEventListener("click", async () => {
  const filePaths = await window.electronAPI.openFile();
  console.log(filePaths, "filePaths");
});
