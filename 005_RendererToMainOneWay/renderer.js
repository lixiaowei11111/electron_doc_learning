const setBtn = document.getElementById("btn");
const titleInput = document.getElementById("title");
setBtn.addEventListener("click", () => {
  window.electronAPI.setTitle(titleInput.value);
});
