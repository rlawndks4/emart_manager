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
import { useHistory, useLocation } from 'react-router';

import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from "axios";
import cancel from "../cancel.png"
import save from "../save.png"

const BrandRevise = () => {
  const [loading, setLoading] = useState(false);

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
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);
  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);
  const [with_good, setwith_good] = useState(false)
  const [brandName, setBrandName] = useState('')
  const [revisePk, setRevisePk] = useState(0)
  const [class1, setClass1] = useState('')
  const [class2, setClass2] = useState('')
  const [class3, setClass3] = useState('')
  const [class4, setClass4] = useState('')
  const [status, setStatus] = useState('')
  const statusList = ['사용중', '사용안함'];
  const [statusNum, setStatusNum] = useState(0)
  const location = useLocation();

  useEffect(() => {
    if (typeof location.state != "undefined") {
      setRevisePk(location.state.pk)
      setBrandName(location.state.name)
      setClass1(location.state.class1)
      setClass2(location.state.class2)
      setClass3(location.state.class3)
      setClass4(location.state.class4)
      setStatus(location.state.status)
    }
  }, [])
  const onSubmit = () => {
    if (!brandName.length ||
      !class1.length ||
      !class2.length ||
      !class3.length ||
      !class4.length) {
      alert('필수 값을 입력하지 않았습니다.')
      setwith_save(false)
    }
    else {
      axios.put('/api/updatebrand', {
        pk: revisePk,
        name: brandName,
        class1: class1,
        class2: class2,
        class3: class3,
        class4: class4,
        status: statusNum
      }).then(() => {
        setwith_save(false)
        setwith_good(true)

      })
        .catch(err => console.log(err))
    }


  };
  useEffect(() => {
    if (status == '사용중') {
      setStatusNum(1)
    }
    else {
      setStatusNum(0)
    }
  })
  console.log(statusNum)
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
  const handleSelectStatus = (e) => {
    setStatus(e.target.value);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs breadcrumbItem="브랜드관리" />

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
                            <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>브랜드 수정</h5>
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
                                    style={{ fontWeight: '1000' }}>
                                    브랜드
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="billing-name"
                                    placeholder="#ABCDEF"
                                    value={brandName}

                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-email-address"

                                    className="form-label"
                                    style={{ fontWeight: '1000' }}>
                                    중분류1
                                  </Label>
                                  <Input
                                    type="email"
                                    className="form-control"
                                    id="billing-email-address"
                                    placeholder="123****"
                                    value={class1}
                                    onChange={onChangeClass1}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                    style={{ fontWeight: '1000' }}>
                                    중분류2
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="billing-phone"
                                    placeholder="Happycall"
                                    value={class2}
                                    onChange={onChangeClass2}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                    style={{ fontWeight: '1000' }}>
                                    중분류3
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="billing-phone"
                                    placeholder="Happycall"
                                    value={class3}
                                    onChange={onChangeClass3}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                    style={{ fontWeight: '1000' }}>
                                    중분류4
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="billing-phone"
                                    placeholder="Happycall"
                                    value={class4}
                                    onChange={onChangeClass4}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"
                                    className="form-label"
                                    style={{ fontWeight: '1000' }}>
                                    상태
                                  </Label>
                                  <form >
                                    <select className="form-control" name="userlevel"
                                      onChange={handleSelectStatus} value={status}>
                                      {statusList.map((item) => (
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
                              {" "}
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
                        <Link to="/brand-list" className="btn btn-success" onClick={() => {
                          setwith_cancel(false)
                        }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>

                    ) : null}
                    {with_good ? (
                      <SweetAlert
                        title="브랜드가 수정되었습니다."
                        success
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

export default BrandRevise
