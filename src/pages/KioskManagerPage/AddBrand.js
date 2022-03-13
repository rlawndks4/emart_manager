import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Input,
  Collapse,
  Card,
  Form,
  Label,
  Media
} from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from 'axios'
import { useHistory } from 'react-router';
import cancel from "./cancel.png"
import save from "./save.png"
import up from "./up.png"
import down from "./down.png"
const AddBrand = () => {
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);
  const [with_good, setwith_good] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [class1, setClass1] = useState("");
  const [class2, setClass2] = useState("");
  const [class3, setClass3] = useState("");
  const [class4, setClass4] = useState("");
  const [checkAddBrand, setCheckAddBrand] = useState(false);

  const isAdmin = async () => {

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

      }
    }
  }
  useEffect(() => {
    isAdmin()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (checkAddBrand) {
      const {data:response} = await axios.post('/api/addbrand', {
        brandName:brandName,
        class1:class1,
        class2:class2,
        class3:class3,
        class4:class4
      })
      if(response.result>0){
        setwith_save(false)
      setwith_good(true)
      }
      else{
        alert(response.message)
      }

      

    } else {
      alert('필수정보가 입력되지 않았습니다.')
      setwith_save(false)
    }
  };

  useEffect(() => {
    if (
      brandName.length === 0 ||
      class1.length === 0 ||
      class2.length === 0 ||
      class3.length === 0 ||
      class4.length === 0
    ) {
      setCheckAddBrand(false)
    } else {
      setCheckAddBrand(true)
    }
  })
  const onChangeBrand = (e) => {
    setBrandName(e.target.value)
  }
  const onChangeClass1 = (e) => {
    setClass1(e.target.value)
  }
  const onChangeClass2 = (e) => {
    setClass2(e.target.value)
  }
  const onChangeClass3 = (e) => {
    setClass3(e.target.value)
  }
  const onChangeClass4 = (e) => {
    setClass4(e.target.value)
  }

  return (
    <React.Fragment>
      <div className="page-content" style={{color:'#596275'}}>
        <Container fluid style={{fontFamily:'NanumGothic'}}>
          {/* Render Breadcrumb */}
          <Breadcrumbs breadcrumbItem="브랜드 관리" />

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
                            <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>브랜드 추가</h5>
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
                                    브랜드
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Brand"
                                    style={{fontWeight:'500'}}
                                    value={brandName}
                                    required onChange={onChangeBrand}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-email-address"

                                    className="form-label"
                                  >
                                    중분류1
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class1"
                                    style={{fontWeight:'500'}}
                                    value={class1}
                                    required onChange={onChangeClass1}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    중분류2
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class2"
                                    style={{fontWeight:'500'}}
                                    value={class2}
                                    required onChange={onChangeClass2}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    중분류3
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class3"
                                    style={{fontWeight:'500'}}
                                    value={class3}
                                    required onChange={onChangeClass3}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    중분류4
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class4"
                                    style={{fontWeight:'500'}}
                                    value={class4}
                                    required onChange={onChangeClass4}
                                  />
                                </div>
                              </Col>
                            </Row>
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
                        <Link to="#" className="btn btn-success" onClick={onSubmit}> <i className="uil uil-file-alt me-1"></i> 저장 </Link>
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
                        <Link to="/brand-list" className="btn btn-success" onClick={() => {
                          setwith_cancel(false)
                        }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>

                    ) : null}


                    {with_good ? (
                      <SweetAlert
                        title="브랜드가 추가되었습니다."
                        warning
                        showConfirm={false}
                        style={{
                          paddingBottom: '42px'
                        }}
                      >
                        <br />

                        <Link to="/brand-list" className="btn btn-primary"> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
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

export default AddBrand
