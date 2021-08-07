import PropTypes from 'prop-types'
import React, { useEffect, useContext } from "react"

import { Row, Col, Alert, Container ,CardBody,Card} from "reactstrap"

// Redux
import { connect } from "react-redux"
import { withRouter, Link ,useHistory} from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// actions
import { loginUser, apiError, socialLogin } from "../../store/actions"

// import images
import EmartLogo from "../../assets/images/emart_logo.png"
import axios from 'axios'
import { LoginContext } from '../../App'
const Login = (props) => {
  const history = useHistory()
  const { ID, setID, PW, setPW} = useContext(LoginContext)
   // handleValidSubmit
   

const onLogin = async (e) => {
    e.preventDefault()
    const { data: response } = await axios.post('/api/login', {
         id: ID, 
         pw: PW
        })
        if(response.result==200){
          alert(response.message)
          history.push('/product-list')
        }else{
          alert(response.message)
        }
        
        
  };
  const handleIDChange = e => {
    setID(e.target.value)
  }

  const handlePWChange = e => {
    setPW(e.target.value)
  }
  useEffect(() => {
    document.body.className = "authentication-bg";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });
 
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/login" className="text-dark">
          <i className="mdi mdi-home-variant h2"></i>
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          
          <Row className="align-items-center justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>

                <CardBody className="p-4">
                 
                  <div className="p-2 mt-4">
                    <AvForm
                      className="form-horizontal"
                      onSubmit={onLogin}
                    >
                      {props.error && typeof props.error === "string" ? (
                        <Alert color="danger">{props.error}</Alert>
                      ) : null}
                      <div className="text-center">
                        <Link to="/login" className="mb-5 d-block auth-logo">
                          <img src={EmartLogo} alt="" height="24" className="emart_logo" />
                  
                        </Link>
                      </div>
                      <div className="mb-3">
                        <AvField
                          name="email"
                          label="ID"
                          className="form-control"
                          placeholder="Enter email"
                          type="text"
                          required onChange={handleIDChange}
                        />
                      </div>
                      <div className="mb-3">
                        <AvField
                          name="password"
                          label="PW"
                          value="123456"
                          type="password"
                          required onChange={handlePWChange}
                          placeholder="Enter Password"
                        />
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          자동 로그인
                        </label>
                      </div>

                      <div className="mt-3 text-end">
                        <button
                          className="btn btn-primary w-sm waves-effect waves-light"
                          type="submit"
                        >
                          로그인
                        </button>
                      </div>

                     

                    </AvForm>

                  </div>
                </CardBody>
              </Card>
              {/* <div className="mt-5 text-center">
                <p>© {new Date().getFullYear()} Minible. Crafted with <i
                  className="mdi mdi-heart text-danger"></i> by Themesbrand
                        </p>
              </div> */}
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  const { error } = state.Login
  return { error }
}

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError, socialLogin })(Login)
)

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  socialLogin: PropTypes.func
}