var Events= {};
function addEventListener(...args){
  if(args.key!=null&&typeof args.key === 'string'&&args.onSuccess!=null){
    onTrigger(args.key,args.onSuccess);
  }
}
// Callback trigger connection.
function onTrigger(key='',func=()=>{}){
  key= key.toLowerCase();
  if(Events[key]==null){
    Events[key]={};
  }
  Events[key].onSuccess= func;
}
// Trigger Event.
function trigger(key='',data={}){
  if(Events[key]==null){Events[key]={}};
  if('onSuccess' in Events[key]){
    let response = {
      key: key,
      data: data
    }
    if(typeof Events[key].onSuccess==='function'){
      Events[key].onSuccess(response);
    }
  }
}
export default {
  addEventListener,
  onTrigger,
  trigger
};
