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

function PreviewFromProfile( props ){
  const { code } = useParams();
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState([]);

  const getOrderPreview = async() => {
    setLoading(true)
    const response = await APIs.getOrderPLoorplanPreview(code)
    // console.log(response)
    setLoading(false)
    if (Array.isArray(response.data)) {
      setData(response.data)
    }
  }

  React.useEffect(() => {
    getOrderPreview()
  },[])

  if (loading) {
    return(
      <Components.LoadingIndicator/>
    )
  }

  return (
    <>
      <ProjectEditor
        data={data}
        editable={false}
      />
    </>
  )
}

export default PreviewFromProfile
