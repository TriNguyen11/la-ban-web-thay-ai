import React,{useState,useEffect} from 'react'
import { useParams } from "react-router-dom";

import Preview3D from './Preview3DReactNative';

function Preview3DToolReactNative( props ){
  const projectEditorRef = React.useRef()
  const [data, setData] = React.useState([])
  const [editable,setEditable] = React.useState(true)
  const postMessageToParent = (json) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(json))
    }else if(document.parent){
      document.parent.postMessage(JSON.stringify(json))
    }
  }
  React.useEffect(() => {
    
    // ---------
    const handler = (ev) => {
      postMessageToParent({type: 'handleSuccess'})
      if (typeof ev.data !== 'object') return
      if (!ev.data.type) return
      if (ev.data.type == 'setData' && Array.isArray(ev.data.floorplans)) {
        setData(ev.data.floorplans)
        return 
      }
    }
    window.addEventListener('message', handler)
    // Post message test
    postMessageToParent({type: 'load_success'})
    return () => window.removeEventListener('message', handler)
  },[])

  return (
    <>
      <Preview3D
        data={data}
      />
    </>
  )
}

export default Preview3DToolReactNative
