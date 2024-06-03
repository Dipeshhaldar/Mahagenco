import axios from "axios";

async function authenticate(email, password) {

  const url = 'https://mahagenco.onrender.com/api/v1/user/login'

  const response = await axios.post(url, {
    email: email,
    password: password,
  });

  //console.log(response.data);
  const token = response.data.token;

  return token;
}

export function login(email, password) {
  return authenticate(email, password);
}
