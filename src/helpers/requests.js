import axios from 'axios'



const base_url =            'http://localhost:3000' //  'https://dev.digitrax.live' //   'https://dev.digitrax.live' //     'http://172.20.101.164:3000' //
const returnLimit =      1000; //   -1 //
const axiosBase =  axios.create({
  baseURL: base_url,
  timeout: 12000
})

const axiosBaseWithKey = function(key){
  if(key){
    return axios.create({
      baseURL: base_url,
      timeout: 12000,
      headers: {'x-access-token': key},
    })
  }
  return axios.create({
    baseURL: base_url,
    timeout: 12000
  })
}

export {axiosBase, axiosBaseWithKey, base_url, returnLimit}
