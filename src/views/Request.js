const axios = require('axios');
const CancelToken = axios.CancelToken;
class Request{
  constructor(props={}){
    this.cancel= ()=>{};
    this.url= (props.url!=null?props.url:'');
    this.method= (props.method!=null?props.method:'GET');
    this.headers= (props.headers!=null?props.headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'});
    this.body= (props.body!=null?props.body:'');
    this.timeout= (props.timeout!=null?props.timeout:120000);
    this.options=(props.options!=null?props.options:{});
    this.response= '';//Full thong tin response khi server tra ve.
  }
  setUrl(url){
    this.url= url;
    return this;
  }
  setMethod(method){
    this.method= method;
    return this;
  }
  setHeaders(headers){
    this.headers= headers;
    return this;
  }
  setBody(body){
    this.body= body;
    return this;
  }
  setTimeout(timeout){
    this.timeout= timeout;
    return this;
  }
  setOptions(options){
    this.options= options;
    return this;
  }
  // Láy response sau khi request.
  getResponse(){
    return this.response;
  }
  call(){
    return new Promise((resolve,reject)=>{
      axios({
        url: this.url,
        method: (this.method!=null?this.method:'GET'),
        headers: (this.headers!=null?this.headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}),
        data: this.body,
        timeout: (this.timeout!=null?this.timeout:0),
        cancelToken: new CancelToken(function(c) {
          // An executor function receives a cancel function as a parameter
          this.cancel = c;
        })
      }).then(function (response) {
        this.response = response;
        // console.log(response.data)
        let json= response.data;
        if(response.status >= 200 && response.status <= 299){
          resolve(json);
        }else{

          reject({});
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  }
}
export default Request;
