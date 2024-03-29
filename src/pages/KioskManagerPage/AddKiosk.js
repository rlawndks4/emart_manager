import React, { useState, useEffect } from "react"
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
import cancel from "./cancel.png"
import save from "./save.png"
import up from "./up.png"
import down from "./down.png"
const AddKiosk = () => {
  const history = useHistory()

  const [kioskNum, setKioskNum] = useState('');
  const [checkKn, setCheckKn] = useState('');
  const [uniNum, setUniNum] = useState('');
  const [checkUn, setCheckUn] = useState('');
  const [store, setStore] = useState('');
  const [checkStore, setCheckStore] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [middleClassColor, setMiddleClassColor] = useState('#ffffff')
  const [fontColor, setFontColor] = useState('#000000')
  
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [toggleIcon, setToggleIcon] = useState(`${up}`)
  const toggle = () => {
    setIsOpen(!isOpen)
    if (toggleIcon == `${up}`) {
      setToggleIcon(`${down}`)
    }
    else {
      setToggleIcon(`${up}`)
    }
  };

  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);
  const [with_good, setwith_good] = useState(false);
  const isAdmin = async () => {
    setLoading(true);
    const { data: response } = await axios.get('/api/auth')
    if (!response.third) {
      alert('회원만 접근 가능합니다.')
      history.push('/login')
    }
    else {
      if (!response.first) {
        alert('개발자만 접근 가능합니다.')
        history.push('/product-list')
      } else {
        setLoading(false)
      }

    }
  }
  useEffect(() => {
    isAdmin()
  }, [])
  //디비에 저장하게 하는 함수
  const onSubmit = async () => {
    if (!kioskNum.length ||
      !store.length ||
      !uniNum.length) {
      alert('필수 값을 입력하지 않았습니다.')
      setwith_save(false)
    } else {
      const {data:response} = await axios.post('/api/addkiosk', {
        kioskNum: kioskNum,
        store: store,
        uniNum: uniNum,
        middleClassColor:middleClassColor,
        backgroundColor:backgroundColor,
        fontColor:fontColor
      })
      if(response.result>0){
        setwith_save(false)
        setwith_good(true)
      }
      else{

      }
     


    }
  };



  //각정보의 string을 저장하게 하는 함수
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
  const onChangeMiddleClassColor = (e) =>{
    setMiddleClassColor(e.target.value)
  } 
  const onChangeBackgroundColor = (e) =>{
    setBackgroundColor(e.target.value)
  }
  const onChangeFontColor = (e) =>{
    setFontColor(e.target.value)
  }
  return (
    <React.Fragment>
      <div className="page-content" style={{ color: '#596275' }}>
        <Container fluid style={{ fontFamily: 'NanumGothic' }}>
          {/* Render Breadcrumb */}
          <Breadcrumbs breadcrumbItem="키오스크 관리" />

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
                          <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>키오스크 추가</h5>
                          <p className="text-muted text-truncate mb-0">아래의 모든 정보를 입력하세요.</p>
                        </div>
                        <img src={toggleIcon} />
                      </Media>

                    </div>
                  </Link>

                  <Collapse isOpen={isOpen}>
                    <div className="p-4 border-top">
                      <Form>

                        <Row>
                          <Col md="2">
                            <div className="mb-3">
                              <Label htmlFor="productname" style={{ fontWeight: '1000' }}>키오스크 NO.</Label>
                              <Input
                                type="text"
                                className="form-control"
                                value={kioskNum}
                                placeholder="#123456"
                                style={{ fontWeight: '500' }}
                                onChange={onChangeKn}
                              />
                            </div>
                          </Col>
                          <Col md="2">
                            <div className="mb-3">
                              <Label htmlFor="productname" style={{ fontWeight: '1000' }}>고유번호</Label>
                              <Input
                                type="text"
                                className="form-control"
                                value={uniNum}
                                placeholder="123456"
                                style={{ fontWeight: '500' }}
                                onChange={onChangeUn}
                              />
                            </div>
                          </Col>
                          <Col md="2">
                            <div className="mb-3">
                              <Label htmlFor="productname" style={{ fontWeight: '1000' }}>지점</Label>
                              <Input
                                type="text"
                                className="form-control"
                                value={store}
                                placeholder="XX점"
                                style={{ fontWeight: '500' }}
                                onChange={onChangeStore}
                              />
                            </div>
                          </Col>
                          <Col md="2">
                            <Label htmlFor="productname" style={{ fontWeight: '1000' }}>배경색</Label>
                            <Input
                              className="form-control form-control-color mw-100"
                              type="color"
                              defaultChecked={backgroundColor}
                              id="example-color-input"
                              onChange={onChangeBackgroundColor}
                            />
                          </Col>
                          <Col md="2">
                            <Label htmlFor="productname" style={{ fontWeight: '1000' }}>중분류색</Label>
                            <Input
                              className="form-control form-control-color mw-100"
                              type="color"
                              defaultValue={middleClassColor}
                              id="example-color-input"
                              onChange={onChangeMiddleClassColor}
                            />
                          </Col>
                          <Col md="2">
                            <Label htmlFor="productname" style={{ fontWeight: '1000' }}>글자색</Label>
                            <Input
                              className="form-control form-control-color mw-100"
                              type="color"
                              defaultValue={fontColor}
                              id="example-color-input"
                              onChange={onChangeFontColor}
                            />
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

                  showConfirm={false}
                  style={{
                    paddingBottom: '42px'
                  }}
                >
                  <div style={{ paddingBottom: '52px', paddingTop: '30px' }}>
                    <img src={save} />
                  </div>

                  <h3><strong>저장 하시겠습니까?</strong></h3>
                  <br />
                  <Link to="#" className="btn btn-danger" onClick={() => {
                    setwith_save(false)
                  }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                  <Link to="#" className="btn btn-success" onClick={onSubmit}>
                    <i className="uil uil-file-alt me-1"></i> 저장 </Link>
                </SweetAlert>
              ) : null}

              {with_cancel ? (
                <SweetAlert

                  showConfirm={false}
                  style={{
                    paddingBottom: '42px'
                  }}
                >
                  <div style={{ paddingBottom: '52px', paddingTop: '30px' }}>
                    <img src={cancel} />
                  </div>

                  <h3><strong>취소 하시겠습니까?</strong></h3>
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
                  success
                  showConfirm={false}
                  style={{
                    paddingBottom: '42px'
                  }}
                >
                  <br />

                  <Link to="/kiosk-list" className="btn btn-primary"> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
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
