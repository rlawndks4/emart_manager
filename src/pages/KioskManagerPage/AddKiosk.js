import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  Col,
  Container,
  Form,
  Media,
  Input,
  Label,
  Row,
  Collapse,
} from "reactstrap"
import axios from 'axios'
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import SweetAlert from "react-bootstrap-sweetalert"
import { useHistory } from 'react-router'
import { Button } from "bootstrap"
import styled from "styled-components"
const LoadingBox = styled.div`
width: 100%;
align-items: center;
display: flex;
flex-direction: column;
`
const AddKiosk = () => {
  const history = useHistory()
  
  const [kioskNum, setKioskNum] = useState('');
  const [checkKn, setCheckKn] = useState('');
  const [uniNum, setUniNum] = useState('');
  const [checkUn, setCheckUn] = useState('');
  const [store, setStore] = useState('');
  const [checkStore, setCheckStore] = useState('');
  const [addKiosk, setAddKiosk] = useState(false);

  const selectList = ["일반유저", "관리자", "개발자"];
  const [selected, setSelected] = useState("일반유저");
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);
  const [with_good, setwith_good] = useState(false);
console.log(kioskNum)
console.log(uniNum)
console.log(store)
  const onSubmit = () => {
    
    // if (addKiosk) {   
        axios.post('/api/addkiosk', {
           kioskNum: kioskNum, 
           store: store, 
           uniNum: uniNum 
          }).then(()=>{
            console.log("success")
            setwith_save(false)
             setwith_good(true)
            history.push('/kiosk-list')
          })
        .catch(err => console.log(err))
        alert('키오스크가 추가되었습니다')
        
        
    // } else {
    //     alert('필수정보가 입력되지 않았습니다.')
    //     setwith_save(false)
    // }
};
const handleSelect = (e) => {
  setSelected(e.target.value);
};
const handleCheckKn = async () => {
  if (kioskNum.length === 0) {
      setCheckKn('')
  } else {
      const { data: overlap } = await axios(`/kiosk`) //true면 중복
      if (overlap) {
        setCheckKn('이미 사용중인 번호입니다')
      } else {
        setCheckKn('사용가능한 번호입니다')
      }
  }
}

  const onChangeKn = (e) => {
    setKioskNum(e.target.value)
    setCheckKn('')
  };
  const onChangeUn = (e) => {
    setUniNum(e.target.value)
    setCheckUn('')
  }
  const onChangeStore = (e) => {
    setStore(e.target.value)
    setCheckStore('')
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs breadcrumbItem="키오스크 추가" />

          <Row>
            <Col lg="12">
              <div id="addproduct-accordion" className="custom-accordion">
                <Card>
                  <Link to="#" onClick={toggle} className="text-dark">
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
                          <h5 className="font-size-16 mb-1">키오스크 추가</h5>
                          <p className="text-muted text-truncate mb-0">아래의 모든 정보를 입력하세요.</p>
                        </div>
                        <i className="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                      </Media>

                    </div>
                  </Link>

                  <Collapse isOpen={isOpen}>
                    <div className="p-4 border-top">
                      <Form>

                        <Row>
                          <Col md="2">
                            <div className="mb-3">
                              <Label htmlFor="productname">키오스크 No.</Label>
                              <Input
                                type="text"
                                className="form-control"
                                value={kioskNum}
                                placeholder="#123456"
                                onChange={onChangeKn}
                              />
                            </div>
                          </Col>
                          <Col md="2">
                            <div className="mb-3">
                              <Label htmlFor="productname">고유번호</Label>
                              <Input 
                                type="text"
                                className="form-control"
                                value={uniNum}
                                placeholder="123456"
                                onChange={onChangeUn}
                              />
                            </div>
                          </Col>
                          <Col md="2">
                            <div className="mb-3">
                              <Label htmlFor="productname">지점</Label>
                              <Input
                                type="text"
                                className="form-control"
                                value={store}
                                placeholder="XX점"
                                onChange={onChangeStore}
                              />
                            </div>
                          </Col>
                          <Col md="2">
                                <div className="mb-3">
                                  <Label>추가를 원하는 유저</Label>
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
                        <Row>
                          <Col  md="2">
                          <Link to="#" className="btn btn-primary"
                          onClick={handleCheckKn}>존재 여부</Link>
                          </Col>
                          <Col  md="2">
                          </Col>
                          <Col md="2">
                          
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  </Collapse>
                </Card>
              </div>
            </Col>
          </Row>
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
                  <Link to="/kiosk-list" className="btn btn-success" onClick={onSubmit}> 
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
                  <Link to="/kiosk-list" className="btn btn-success" onClick={() => {
                    setwith_cancel(false)
                  }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                </SweetAlert>

              ) : null}
              {with_good ? (
                      <SweetAlert
                        title="키오스크가 추가되었습니다."
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
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AddKiosk
