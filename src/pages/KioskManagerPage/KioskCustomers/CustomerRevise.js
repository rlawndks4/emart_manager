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
import { useHistory, useLocation } from 'react-router'
import cancel from "../cancel.png"
import save from "../save.png"
import styled from "styled-components"
const UseKioskContainer = styled.div`
display:flex;
padding-left: 0;
`
const UseKioskContent = styled.div`
text-decoration: none;
color: black;
padding-left: 10px;
background: none;
cursor:pointer;
`
const CustomerRevise = () => {
  const history = useHistory()
  const [revisePk, setRevisePk] = useState(0);
  const [reviseId, setReviseId] = useState('');
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
  const [selected, setSelected] = useState("일반유저");

  const [allKioskList, setAllKioskList] = useState([]);
  const [selectKioskNum, setSelectKioskNum] = useState('');
  const [kioskNumList, setkioskNumList] = useState([]);
  const [kioskPkList, setKioskPkList] = useState([]);

  const [emileHenry, setEmileHenry] = useState(false)
  const [tefal, setTefal] = useState(false)
  const [happyCall, setHappyCall] = useState(false)
  const [silit, setSilit] = useState(false)
  const [kissher, setKissher] = useState(false)
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



  const location = useLocation();

  useEffect(() => {
    if (typeof location.state != "undefined") {
      setRevisePk(location.state.pk)
      setReviseId(location.state.id);
    }
  }, [])
 
  const onSubmit = () => {
    if (!pw.length) {
      alert('필수 값을 입력하지 않았습니다.')
      setwith_save(false)
    }
    else {
      var brand_pk_list = []
      var brand_list = [kissher, silit, happyCall, tefal, emileHenry]
      for (var i = 0; i < brand_list.length; i++) {
        if (brand_list[i])
          brand_pk_list.push(i + 1)
      }

      var brandPk = JSON.stringify(brand_pk_list)
      var kioskLi = JSON.stringify(kioskPkList)
      console.log(brandPk)
      axios.put('/api/updateuser', {
        pk: revisePk,
        pw: pw,
        brandPk: brandPk,
        kioskPk: kioskLi
      }).then(() => {
        console.log("success")
        setwith_save(false)
        setwith_good(true)

      })
        .catch(err => console.log(err))
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
  function deleteKioskPk(pk) {
    console.log(pk)
    for (var i = 0; i < kioskNumList.length; i++) {
      console.log(kioskNumList[i])
      if (kioskNumList[i] == pk) {
        kioskNumList.splice(i, 1);
        kioskPkList.splice(i, 1);
        break;
      }
    }
  }
  useEffect(() => {
    if (selected === '일반유저') setUserLevel(0)
    else if (selected === '관리자') setUserLevel(40)
    else {
      setUserLevel(50)
    }
  })
  const handleSelectKiosk = (e) => {
    setSelectKioskNum(e.target.value)

    for (var i = 0; i < allKioskList.length; i++) {
      if (allKioskList[i].kiosk_num == e.target.value) {

        for (var j = 0; j < kioskNumList.length; j++) {
          if (kioskNumList[j] == e.target.value) {
            break;
          }
        }
        if (j == kioskNumList.length) {
          kioskNumList.push(e.target.value)
          kioskPkList.push(allKioskList[i].pk)
        }

      }
    }
  }
  useEffect(() => {
    async function fetchPosts() {
      const { data: response } = await axios.get('/api/kiosk');
      console.log(response.data)
      setAllKioskList(response.data)
      console.log(allKioskList)
    }
    fetchPosts()
  }, []);
  const onChangeId = (e) => {
    setId(e.target.value)
    setCheckId('')
  };
  const onChangePw = (e) => {
    setPw(e.target.value)
    setCheckPw('')
  };

  const handleEmileHenry = () => {
    if (!emileHenry) {
      setEmileHenry(true)
    }
    else {
      setEmileHenry(false)
    }
  }
  const handleTefal = () => {
    if (!tefal) {
      setTefal(true)
    }
    else {
      setTefal(false)
    }
  }
  const handleHappycall = () => {
    if (!happyCall) {
      setHappyCall(true)
    }
    else {
      setHappyCall(false)
    }
  }
  const handleSilit = () => {
    if (!silit) {
      setSilit(true)
    }
    else {
      setSilit(false)
    }
  }
  const handleKissher = () => {
    if (!kissher) {
      setKissher(true)
    }
    else {
      setKissher(false)
    }
  }


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
                            <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>회원 정보 수정</h5>
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
                                    value={pw}
                                    required onChange={onChangePw}
                                  />
                                </div>
                              </Col>
                              <Col lg={4}>
                                <div className="mb-3">
                                  <Label style={{fontWeight:'1000'}}>관리할 브랜드</Label>
                                  <form>
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name=" kissher"
                                      onClick={handleKissher}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="exampleRadios2"
                                    >
                                      kissher
                                    </label>
                                    <br />
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="silit"
                                      onClick={handleSilit}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="exampleRadios2"
                                    >
                                      silit
                                    </label>
                                    <br />
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="happycall"
                                      onClick={handleHappycall}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="exampleRadios2"
                                    >
                                      happycall
                                    </label>
                                    <br />
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="tefal"
                                      onClick={handleTefal}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="exampleRadios2"
                                    >
                                      tefal
                                    </label>
                                    <br />
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="emile henry"
                                      onClick={handleEmileHenry}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="exampleRadios2"
                                    >
                                      emile henry
                                    </label>

                                  </form>
                                </div>
                              </Col>

                              
                            </Row>
                              <Row>
                              <Col lg={4}>
                                <div className="mb-3">
                                  <Label style={{fontWeight:'1000'}}>이용할 키오스크(다중선택 가능)</Label>
                                  <form >
                                    <select className="form-control" name="userlevel"
                                      onChange={handleSelectKiosk}>
                                      {allKioskList.map(item => (
                                        <option key={item.pk}
                                        >
                                          {item.kiosk_num}
                                        </option>
                                      ))}
                                    </select>
                                  </form>
                                </div>
                              </Col>

                              <Col lg={4}>
                                <Label style={{fontWeight:'1000'}}>선택한 키오스크</Label>
                                <UseKioskContainer>{kioskNumList.map(pk => (
                                  <UseKioskContent onClick={() => { deleteKioskPk(pk) }}>{pk}</UseKioskContent>
                                ))}</UseKioskContainer>
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
