import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Collapse,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  Media
} from "reactstrap"
import { Link } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from "axios"
import { useHistory } from 'react-router'
import styled from "styled-components"
const LoadingBox = styled.div`
width: 100%;
align-items: center;
display: flex;
flex-direction: column;
`
const CustomerRevise = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);
  const [with_good, setwith_good] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [checkId, setCheckId] = useState('');
  const [checkPw, setCheckPw] = useState(false);
  const [checkAddUser, setCheckAddUser] = useState(false);
  const [userLevel, setUserLevel] = useState(0);
  const selectList = ["일반유저", "관리자", "개발자"];
  const [selected, setSelected] = useState("일반유저");
  const isAdmin = async () => {
    setLoading(true);
    const { data: response } = await axios.get('/api/auth')
    if(!response.third){
      alert('회원만 접근 가능합니다.')
      history.push('/login')
    }
    else{
      
        if(!response.first){
          alert('개발자만 접근 가능합니다.')
          history.push('/product-list')
        }else{
          setLoading(false)
        }
      
    } 
  }
  useEffect(() => {
    isAdmin()
  }, [])
  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  const history = useHistory()


  const onSubmit = () => {
    
    // if (checkAddUser) {
      //회원가입
      axios.post('/api/adduser', {
         id: id, 
         pw: pw,
        userLevel: userLevel 
        }).then(()=>{
          console.log("success")
          setwith_save(false)
           setwith_good(true)
          history.push('/customer-list')
        })
        .catch(err => console.log(err))
      
    // } else {
    //   if(checkId===''){
    //     alert('ID 중복확인을 해주세요.')
    //   }
    //   else{
    //     alert('필수정보가 입력되지 않았습니다.')
    //   }
    //   setwith_save(false)
    // }
  };

  useEffect(() => {
    if (
      id.length === 0 ||
      pw.length === 0 ||
      checkId !== '사용 가능한 ID입니다.'
    ) {
      setCheckAddUser(false)
      
    } else {
      setCheckAddUser(true)
    }
  })

 useEffect(()=>{
  if(selected==='일반유저') setUserLevel(0)
    else if(selected==='관리자') setUserLevel(40)
    else{
      setUserLevel(50)
    }
 })
    
  
  const onChangeId = (e) => {
    setId(e.target.value)
    setCheckId('')
  };
  const onChangePw = (e) => {
    setPw(e.target.value)
    setCheckPw('')
  };

  const handleCheckId = async () => {
    
    if (id.length === 0) {
      setCheckId('')
    } else {
      const response = await axios.get(`/api/userid/${id}`)
      console.log(response.data)
      // .then(res => console.log(res))
      //       .catch(err => console.log(err)) //true면 중복
      
    }
  }
  
  console.log(id);
  console.log(pw);
  console.log(selected);
  console.log(checkAddUser);
  console.log(checkId);
  console.log(userLevel);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs breadcrumbItem="회원 관리" />

          <div className="checkout-tabs">
            <Row>
              <Col xl="12">
                <div className="custom-accordion">
                  <Card>
                    <Link onClick={toggle} className="text-dark" to="#">
                      <div className="p-4">
                        <Media className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="avatar-xs">
                              <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                                01
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h5 className="font-size-16 mb-1">회원 수정</h5>
                            <p className="text-muted text-truncate mb-0">아래의 모든 정보를 입력하세요.</p>
                          </div>
                          <i className="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                        </Media>
                      </div>
                    </Link>
                    <Collapse isOpen={isOpen}>
                      <div className="p-4 border-top">
                        <Form>
                          <div>
                            <Row>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-name"

                                    className="form-label"
                                  >
                                    ID
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="#ABCDEF"
                                    value={id}
                                    required onChange={onChangeId}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-email-address"
                                    className="form-label"
                                  >
                                    PW
                                  </Label>
                                  <Input
                                    type="email"
                                    className="form-control"
                                    placeholder="123****"
                                    value={pw}
                                    required onChange={onChangePw}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3">
                                  <Label>접근도</Label>
                                  <form >
                                    <select className="form-control" name="userlevel"
                                      onChange={handleSelect} value={selected}>
                                      {selectList.map((item) => (
                                        <option value={item} key={item}>
                                          {item}
                                        </option>
                                      ))}
                                    </select>
                                  </form>
                                </div>
                              </Col>
                            </Row>
                            <Col lg={1}>
                              <Link to="#" className="btn btn-primary" onClick={handleCheckId}>중복확인</Link>
                            </Col>
                          </div>
                        </Form>
                      </div>
                    </Collapse>
                  </Card>
                </div>
                <Row>
                  <Col>
                    <div className="text-sm-end mt-2 mt-sm-0">
                      <Link to="#" className="btn btn-danger" onClick={() => {
                        setwith_cancel(true)
                      }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                      <Link to="#" className="btn btn-success" onClick={() => {
                        setwith_save(true)
                      }}> <i className="uil uil-file-alt me-1"></i> 저장 </Link>
                    </div>

                    {with_save ? (
                      <SweetAlert
                        title="저장 하시겠습니까?"
                        warning
                        showConfirm={false}
                        style={{
                          paddingBottom: '42px'
                        }}
                      >
                        <br />
                        <Link to="#" className="btn btn-danger" onClick={() => {
                          setwith_save(false)
                        }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                        <Link to="#" className="btn btn-success" onClick={onSubmit}
                        >
                        <i className="uil uil-file-alt me-1"></i> 저장 </Link>
                      </SweetAlert>
                    ) : null}

                    {with_cancel ? (
                      <SweetAlert
                        title="취소 하시겠습니까?"
                        warning
                        showConfirm={false}
                        style={{
                          paddingBottom: '42px'
                        }}
                      >
                        <br />
                        <Link to="#" className="btn btn-danger" onClick={() => {
                          setwith_cancel(false)
                        }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                        <Link to="/customer-list" className="btn btn-success" onClick={() => {
                          setwith_cancel(false)
                        }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>

                    ) : null}

                    {with_good ? (
                      <SweetAlert
                        title="회원이 추가되었습니다."
                        warning
                        showConfirm={false}
                        style={{
                          paddingBottom: '42px'
                        }}
                      >
                        <br />

                        <Link to="/customer-list" className="btn btn-primary"> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>
                    ) : null}

                  </Col>

                </Row>
              </Col>

            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CustomerRevise
