import React,{useState,useEffect} from 'react'
import { useParams } from "react-router-dom";

import {
  Row,Col,Modal,Form,Button
} from 'react-bootstrap'

import {
  Components, APIs,Helper,Notify,routes,
  Navigation
} from '@floorplan/App'

import ProjectEditor from '@floorplan/views/ProjectEditor'

function PreviewTool( props ){
  const [data, setData] = React.useState([])
  const [editable,setEditable] = React.useState(true)
  const projectEditorRef = React.useRef()
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
        // alert(JSON.stringify(ev.data.floorplans))
        // console.log({floorplans: projectEditorRef.current.getData()})
        projectEditorRef.current.setData(ev.data.floorplans)
        return 
      }
      if (ev.data.type == 'getData') {
        // console.log({floorplans: projectEditorRef.current.getData()})
        postMessageToParent({floorplans: projectEditorRef.current.getData()})
        return 
      }
      if (ev.data.type == 'setEditable') {
        projectEditorRef.current.setEditable(ev.data.value || false)
        return 
      }
      if (ev.data.type == 'onPhanCung') {
        projectEditorRef.current.onPhanCung(ev.data.direction)
        // setEditable(ev.data.value || false)
        return 
      }
      // console.log(ev.data)
      // if (document.parent) {
      //   document.parent.postMessage({type: 'response'},"*")
      // }
      // if (ev.data.type !== 'button-click') return
      // if (!ev.data.message) return
      // alert(JSON.stringify(ev.data))
    }
    window.addEventListener('message', handler)
    // Post message test
    postMessageToParent({type: 'load_success'})
    return () => window.removeEventListener('message', handler)
  },[])

  return (
    <>
      <ProjectEditor
        ref={projectEditorRef}
        data={data}
        onAction={(action,data = {}) => {
          postMessageToParent({
            type: 'action',
            value: action,
            floorplans: projectEditorRef.current.getData(),
            data: data
          })
        }}
        onChangeComplete={() => {
          postMessageToParent({floorplans: projectEditorRef.current.getData()})
        }}
      />
    </>
  )
}

export default PreviewTool
