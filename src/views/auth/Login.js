import React,{useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { Alert, Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from 'react-bootstrap';
import {APIs, routes} from '@floorplan/App'

import BgImage from "@floorplan/assets/img/illustrations/signin.svg";

function Login( props ){
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, showErrors] = React.useState('');
  const [loading, setLoading] = React.useState('');

  useEffect(() => {
    // if (APIs.isLogged()) {
      // navigate(routes.createnewproject.path,{ replace: true });
    // }
  },[]);

  const signIn = async () => {
    setLoading(true)
    showErrors({})
    // Login...
    console.log('bbb')
    let response = await APIs.login({
      email: email,
      password: password
    })
    // console.log(APIs.login)
    if (((response.data && response.data.errors == null) || Object.keys(response.data.errors).length == 0) && response.data.access_token) {
      // await APIs.syncAuthInfo()
      setLoading(false)
      // navigate(routes.createnewproject.path,{ replace: true });
    }else{
      showErrors(response.data.errors)
    }
    setLoading(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      signIn()
    }
  }

  return (
    <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
      <Container>
        <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
          <Col xs={12} className="d-flex align-items-center justify-content-center">
            <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <div className="text-center text-md-center mb-4 mt-md-0">
                <h3 className="mb-0">Sign in</h3>
              </div>
              <Form className="mt-4">
                <Form.Group id="email" className="mb-4">
                  <Form.Label>Your Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fa fa-envelope"></i>
                    </InputGroup.Text>
                    <Form.Control autoFocus required type="email" name="email" placeholder="example@company.com" onChange={e => setEmail(e.target.value)}/>
                  </InputGroup>
                </Form.Group>

                {
                  (errors.attempt || errors.email) &&
                  <Alert variant="danger">
                    {errors.attempt!=null ? errors.attempt[0] : ''}
                    {errors.email!=null ? errors.email[0] : ''}
                  </Alert>
                }
                <Form.Group id="password" className="mb-4">
                  <Form.Label>Your Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fa fa-unlock-alt"></i>
                    </InputGroup.Text>
                    <Form.Control required type="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}/>
                  </InputGroup>
                </Form.Group>
                {
                  errors.password &&
                  <Alert variant="danger">
                    {errors.password!=null ? errors.password[0] : ''}
                  </Alert>
                }
                <Button variant="primary" type="button" className={"w-100 " + ( loading ? 'disabled' : '')} onClick={()=>signIn()}>
                  {
                    loading
                    ?<span><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                      Loading...</span>
                    :<span>Login</span>
                  }
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Login
