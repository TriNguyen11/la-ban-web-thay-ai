import React,{useState,useEffect} from 'react'
import { useParams } from "react-router-dom";
import {
  Row,Col
} from 'react-bootstrap'

import {Components, APIs,Helper,Notify} from '@floorplan/App'

import ProjectEditor from '@floorplan/views/ProjectEditor'

// const initialRectangles = [
//   {
//       "name": "L-shape room",
//       "code": "l_shape_room",
//       "image": "/structure/l_shape_room.png",
//       "polygons": [
//           [
//               364.99999999999994,
//               155
//           ],
//           [
//               364.99999999999994,
//               455
//           ],
//           [
//               669.9999999999998,
//               455
//           ],
//           [
//               669.9999999999998,
//               305.00000000000006
//           ],
//           [
//               515,
//               305.00000000000006
//           ],
//           [
//               515,
//               155
//           ]
//       ],
//       "rotateEnabled": false,
//       "id": "id7a4efeda-85ef-4d3e-a200-3296ba092e88",
//       "x": 364.99999999999994,
//       "y": 155,
//       "width": 100,
//       "height": 100,
//       "rotation": 0
//   },
//   {
//       "parent": "id7a4efeda-85ef-4d3e-a200-3296ba092e88",
//       "name": "Wall",
//       "id": "wall-5b55c5e3-1c7f-47b9-8671-db2e1d1a77d8",
//       "code": "wall",
//       "x": 364.99999999999994,
//       "y": 155,
//       "endX": 364.99999999999994,
//       "endY": 455,
//       "width": 300,
//       "height": 10
//   },
//   {
//       "parent": "id7a4efeda-85ef-4d3e-a200-3296ba092e88",
//       "name": "Wall",
//       "id": "wall-978a788b-38ae-4a75-9f7c-fad9d21d74b2",
//       "code": "wall",
//       "x": 364.99999999999994,
//       "y": 455,
//       "endX": 669.9999999999998,
//       "endY": 455,
//       "width": 305,
//       "height": 10
//   },
//   {
//       "parent": "id7a4efeda-85ef-4d3e-a200-3296ba092e88",
//       "name": "Wall",
//       "id": "wall-bcafa904-0f54-4ea5-b431-2d83f8ca3270",
//       "code": "wall",
//       "x": 669.9999999999998,
//       "y": 455,
//       "endX": 669.9999999999998,
//       "endY": 305.00000000000006,
//       "width": 150,
//       "height": 10
//   },
//   {
//       "parent": "id7a4efeda-85ef-4d3e-a200-3296ba092e88",
//       "name": "Wall",
//       "id": "wall-dcaa4013-2a42-4a20-82ae-716fc601469b",
//       "code": "wall",
//       "x": 669.9999999999998,
//       "y": 305.00000000000006,
//       "endX": 515,
//       "endY": 305.00000000000006,
//       "width": 155,
//       "height": 10
//   },
//   {
//       "parent": "id7a4efeda-85ef-4d3e-a200-3296ba092e88",
//       "name": "Wall",
//       "id": "wall-2511d63e-ccaf-4b65-aeb4-7535d5dcb4ab",
//       "code": "wall",
//       "x": 515,
//       "y": 305.00000000000006,
//       "endX": 515,
//       "endY": 155,
//       "width": 150,
//       "height": 10
//   },
//   {
//       "parent": "id7a4efeda-85ef-4d3e-a200-3296ba092e88",
//       "name": "Wall",
//       "id": "wall-4fa887b6-75f7-4a68-a219-a944e402fcf8",
//       "code": "wall",
//       "x": 515,
//       "y": 155,
//       "endX": 364.99999999999994,
//       "endY": 155,
//       "width": 150,
//       "height": 10
//   }
// ]

function FloorPlanInfo( props ){
  const { id } = useParams();
  const projectEditorRef = React.useRef(null);
  const [loading, setLoading] = React.useState('getFloorPlanInfo');
  const [data, setData] = React.useState([]);
  const getFloorPlanInfo = async() => {
    setLoading('getFloorPlanInfo')
    const response = await APIs.getFloorPlanInfo(id)
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setData(response.data.data)
    }
    setLoading(false)
  }
  const editFloorPlan = async(res) => {
    // console.log(image.toString())
    setLoading('editFloorPlan')
    const image = await projectEditorRef.current.exportImage()
    const response = await APIs.editFloorPlan(id,{
        data: res,
        image: image
    })
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setData(response.data.data)
        Notify.notify({type: 'success', message: 'Success!'})
        window.postMessage("edit-floorplan-success");
    }
    setLoading(false)
  }
  React.useEffect(() => {
    getFloorPlanInfo()
  },[])

  if (loading == 'getFloorPlanInfo') {
    return (
        <div className="h-100 d-flex justify-content-center align-items-center mt-5">
            <Components.LoadingIndicator/>
        </div>
    )
  }

  return (
    <>
      <ProjectEditor
        ref={projectEditorRef}
        data={data}
        save={(res) => {
            editFloorPlan(res)
            // console.log(res)
        }}
      />
    </>
  )
}

export default FloorPlanInfo
