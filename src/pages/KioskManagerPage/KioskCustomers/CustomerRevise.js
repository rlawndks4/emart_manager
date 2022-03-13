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
import { Link } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from "axios"
import { useHistory, useLocation, useParams } from 'react-router'
import cancel from "../cancel.png"
import save from "../save.png"
import styled from "styled-components"
import up from "../up.png"
import down from "../down.png"
import $, { post } from 'jquery'

const CustomerRevise = () => {
  const history = useHistory()
  const location = useLocation();
  const params = useParams()
  const [revisePk, setRevisePk] = useState(0);
  const [reviseId, setReviseId] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [toggleIcon, setToggleIcon] = useState(`${up}`)
  const [isOpen2, setIsOpen2] = useState(true);
  const [toggleIcon2, setToggleIcon2] = useState(`${up}`)
  const [isOpen3, setIsOpen3] = useState(true);
  const [toggleIcon3, setToggleIcon3] = useState(`${up}`)
  const toggle = () => {
    setIsOpen(!isOpen)
    if (toggleIcon == `${up}`) {
      setToggleIcon(`${down}`)
    }
    else {
      setToggleIcon(`${up}`)
    }
  };
  const toggle2 = () => {
    setIsOpen2(!isOpen2)
    if (toggleIcon2 == `${up}`) {
      setToggleIcon2(`${down}`)
    }
    else {
      setToggleIcon2(`${up}`)
    }
  };
  useEffect(() => {
    if (typeof location.state != "undefined") {
      setRevisePk(params.pk)
      setReviseId(location.state.id);
    }
    else {
      history.push('/customer-list')
    }
  }, [])
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
  const [selectList, setSelectList] = useState(["일반유저", "관리자"]);
  const [selected, setSelected] = useState("일반유저");
  const [myPk, setMyPk] = useState(0)

  const [brandList, setBrandList] = useState([])

  const [kioskList, setKioskList] = useState([])
  const isAdmin = async () => {
    setLoading(true);
    const { data: response } = await axios.get('/api/auth')
    if (!response.third) {
      alert('회원만 접근 가능합니다.')
      history.push('/login')
    }
    else {

      if (!response.second) {
        alert('관리자만 접근 가능합니다.')
        history.push('/product-list')
      } else {
        if (response.first) {
          selectList.push('개발자');
        }

        const { data: response1 } = await axios.get(`/api/mytopdownbrand?topPk=${response.pk}&downPk=${params.pk}`)
        setBrandList(response1.data.result)
        for (var i = 0; i < response1.data.result.length; i++) {
          if (response1.data.result[i].check) {
            $(`input:checkbox[name=check-brand${i + 1}]`).prop("checked", true);
          }

        }

        const { data: response2 } = await axios.get(`/api/mytopdownkiosk?topPk=${response.pk}&downPk=${params.pk}`)
        setKioskList(response2.data.result)
        let kiosk_list = response2.data.result
        for (var i = 0; i < kiosk_list.length; i++) {
          if (kiosk_list[i].check) {
            $(`input:checkbox[name=check${i + 1}]`).prop("checked", true);
          }

        }

        setMyPk(response.pk)
        setLoading(false)
      }


    }

  }
  useEffect(() => {
    isAdmin()
  }, [])







  const onSubmit = async () => {
    if (!pw.length) {
      alert('필수 값을 입력하지 않았습니다.')
      setwith_save(false)
    }
    else {
      let selectBrandList = []
      let selectKioskList = []
      for (var i = 1; i <= kioskList.length; i++) {
        if ($(`input:checkbox[name=check${i}]`).is(":checked")) {
          selectKioskList.push([
            myPk, kioskList[i - 1].pk, kioskList[i - 1].kiosk_num
          ])
        }

      }
      for (var i = 1; i <= brandList.length; i++) {
        if ($(`input:checkbox[name=check-brand${i}]`).is(":checked")) {
          selectBrandList.push([
            myPk, brandList[i - 1].pk, brandList[i - 1].brand_name
          ])
        }

      }
      const { data: response } = await axios.put('/api/updateuser', {
        pk: revisePk,
        pw: pw,
        brandList: selectBrandList,
        kioskList: selectKioskList
      })
      console.log(response)
      if (response.result < 0) {
        alert(response.message)
      }
      else {
        setwith_save(false)
        alert("성공적으로 수정되었습니다.")
        window.location.href = `/customer-list`
      }
    }
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

  useEffect(() => {
    if (selected === '일반유저') setUserLevel(0)
    else if (selected === '관리자') setUserLevel(40)
    else {
      setUserLevel(50)
    }
  })


  const onChangeBrand = (e) => {
    let { name, value } = e.target;

    if (name == 'check-brand0' && $(`input:checkbox[name=check-brand0]`).is(":checked")) {
      for (var i = 1; i <= brandList.length; i++) {
        $(`input:checkbox[name=check-brand${i}]`).prop("checked", true);
      }
    }
    else if (name == 'check-brand0' && !$(`input:checkbox[name=check-brand0]`).is(":checked")) {
      for (var i = 1; i <= brandList.length; i++) {
        $(`input:checkbox[name=check-brand${i}]`).prop("checked", false);
      }
    }
    else {
      if ($(`input:checkbox[name=${name}]`).is(":checked")) {
        $(`input:checkbox[name=${name}]`).prop("checked", true);
      }
      else {
        $(`input:checkbox[name=${name}]`).prop("checked", false);
      }
    }

  }

  const onChangeId = (e) => {
    setId(e.target.value)
    setCheckId('')
  };
  const onChangePw = (e) => {
    setPw(e.target.value)
    setCheckPw('')
  };

  const onChange = (e) => {
    let { name, value } = e.target;

    if (name == 'check0' && $(`input:checkbox[name=check0]`).is(":checked")) {
      for (var i = 1; i <= kioskList.length; i++) {
        $(`input:checkbox[name=check${i}]`).prop("checked", true);
      }
    }
    else if (name == 'check0' && !$(`input:checkbox[name=check0]`).is(":checked")) {
      for (var i = 1; i <= kioskList.length; i++) {
        $(`input:checkbox[name=check${i}]`).prop("checked", false);
      }
    }
    else {
      if ($(`input:checkbox[name=${name}]`).is(":checked")) {
        $(`input:checkbox[name=${name}]`).prop("checked", true);
      }
      else {
        $(`input:checkbox[name=${name}]`).prop("checked", false);
      }
    }

  }


  return (
    <React.Fragment>
      <div className="page-content" style={{ color: '#596275' }}>
        <Container fluid style={{ fontFamily: 'NanumGothic' }}>
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
                            <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>회원 정보 수정</h5>
                            <p className="text-muted text-truncate mb-0">아래의 모든 정보를 입력하세요.</p>
                          </div>
                          <img src={toggleIcon} />
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
                                    style={{ fontWeight: '500' }}
                                    value={reviseId}
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
                                    style={{ fontWeight: '500' }}
                                    value={pw}
                                    required onChange={onChangePw}
                                  />
                                </div>
                              </Col>



                            </Row>

                          </div>
                        </Form>
                      </div>
                    </Collapse>
                  </Card>
                  {loading ? <div>loading...</div>
                    :
                    <>
                      <Card>
                        <Link onClick={toggle2} className="text-dark" to="#">
                          <div className="p-4">
                            <Media className="d-flex align-items-center">
                              <div className="me-3">
                                <div className="avatar-xs">
                                  <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                                    02
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>브랜드 선택</h5>
                                <p className="text-muted text-truncate mb-0">해당 회원에게 권한을 부여할 브랜드를 정해주세요.</p>
                              </div>
                              <img src={toggleIcon2} />
                            </Media>
                          </div>
                        </Link>
                        <Collapse isOpen={isOpen2}>
                          <div className="p-4 border-top" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ borderBottom: '1px solid #cccccc', width: '100%', display: 'flex', background: '#eef1fd' }}>
                              <div style={{ margin: '1rem' }}>
                                
                                 <input type={'checkbox'} name='check-brand0' onChange={onChangeBrand}  />
                               
                               
                              </div>
                              <div style={{ margin: '1rem auto' }}>
                                브랜드 이름
                              </div>

                            </div>
                            {brandList && brandList.map((post, index) => (
                              <div style={{ borderBottom: '1px solid #cccccc', width: '100%', display: 'flex' }}>
                                <div style={{ margin: '1rem' }}>
                                 
                                   <input type={'checkbox'} name={`check-brand${index + 1}`} onChange={onChangeBrand} />
                                 
                                 
                                </div>
                                <div style={{ margin: '1rem auto' }}>
                                  {post.brand_name}
                                </div>

                              </div>
                            ))}
                          </div>
                        </Collapse>
                      </Card>
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
                                <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>키오스크 선택</h5>
                                <p className="text-muted text-truncate mb-0">해당 회원에게 권한을 부여할 키오스크를 정해주세요.</p>
                              </div>
                              <img src={toggleIcon} />
                            </Media>
                          </div>
                        </Link>
                        <Collapse isOpen={isOpen}>
                          <div className="p-4 border-top" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ borderBottom: '1px solid #cccccc', width: '100%', display: 'flex', background: '#eef1fd' }}>
                              <div style={{ margin: '1rem' }}>
                                <input type={'checkbox'} name='check0' onChange={onChange} />
                              </div>
                              <div style={{ margin: '1rem auto' }}>
                                키오스크 번호
                              </div>
                              <div style={{ margin: '1rem auto' }}>
                                지점
                              </div>
                              <div style={{ margin: '1rem auto' }}>
                                고유번호
                              </div>
                            </div>
                            {kioskList.map((post, index) => (
                              <div style={{ borderBottom: '1px solid #cccccc', width: '100%', display: 'flex' }}>
                                <div style={{ margin: '1rem' }}>
                                  
                                  <input type={'checkbox'} name={`check${index + 1}`} onChange={onChange} />
                                 
                                  
                                </div>
                                <div style={{ margin: '1rem auto' }}>
                                  {post.kiosk_num}
                                </div>
                                <div style={{ margin: '1rem auto' }}>
                                  {post.store_name}
                                </div>
                                <div style={{ margin: '1rem auto' }}>
                                  {post.unique_code}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Collapse>
                      </Card>
                    </>
                  }

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
                        <Link to="#" className="btn btn-success" onClick={onSubmit}
                        >
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
                        <Link to="/customer-list" className="btn btn-success" onClick={() => {
                          setwith_cancel(false)
                        }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>

                    ) : null}

                    {with_good ? (
                      <SweetAlert
                        title="회원이 수정되었습니다."
                        success
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
