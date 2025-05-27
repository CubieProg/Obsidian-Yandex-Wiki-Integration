const btn = document.getElementById('btn');
const messageElem = document.getElementById('message');

btn.addEventListener('click', async () => {
  // reset the message
  messageElem.innerHTML = '';
  try {
    // call the API
    const response = await fetch('http://localhost:3000/');
    const data = await response.json();

    // update the message
    messageElem.innerHTML = data.message;
  } catch (err) {
    messageElem.innerHTML = err.message;
  }
});
