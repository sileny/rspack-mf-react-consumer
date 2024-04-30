import("./bootstrap");

fetch("http://localhost:3000/api/hello", {
  headers: {
    'content-type': 'json',
  },
  mode: 'cors',
}).then(res => {
  console.log(res);
  return res.json()
}).then(res=> {
  console.log(res);
})
