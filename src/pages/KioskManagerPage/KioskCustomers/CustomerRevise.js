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
import up from "../up.png"
import down from "../down.png"
const UseBrandContainer = styled.div`
display:flex;
padding-left: 0;
`
const UseBrandContent = styled.div`
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
  const [toggleIcon, setToggleIcon] = useState(`${up}`)
  const toggle = () => {
    setIsOpen(!isOpen)
    if(toggleIcon==`${up}`){
      setToggleIcon(`${down}`)
    }
    else{
      setToggleIcon(`${up}`)
    }
  };
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


  const [allBrandList, setAllBrandList] = useState([]);
  const [brandNameList, setBrandNameList] = useState([]);

  const [selectBrandName, setSelectBrandName] = useState('');
  const [brandPkList, setBrandPkList] = useState([]);

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
      var brandPk = JSON.stringify(brandPkList)
  
      axios.put('/api/updateuser', {
        pk: revisePk,
        pw: pw,
        brandPk: brandPk
      }).then(() => {
       
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

  useEffect(() => {
    if (selected === '일반유저') setUserLevel(0)
    else if (selected === '관리자') setUserLevel(40)
    else {
      setUserLevel(50)
    }
  })

  useEffect(() => {
    async function fetchPosts() {
      const { data: response } = await axios.get('/api/brand');
      setAllBrandList(response.data)
    }
    fetchPosts()
  }, []);

  const handleSelectBrand = (e) => {
    setSelectBrandName(e.target.value)
    
    for (var i = 0; i < allBrandList.length; i++) {
      if (allBrandList[i].brand_name == e.target.value) {

        for (var j = 0; j < brandNameList.length; j++) {
          if (brandNameList[j] == e.target.value) {
            break;
          }
        }
        if (j == brandNameList.length) {
          brandNameList.push(e.target.value)
          brandPkList.push(allBrandList[i].pk)
        }

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




  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid style={{fontFamily:'NanumGothic'}}>
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
                          <img src={toggleIcon}/>
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
                                    style={{fontWeight:'500'}}
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
                                    style={{fontWeight:'500'}}
                                    value={pw}
                                    required onChange={onChangePw}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3">
                                  <Label>브랜드</Label>
                                  <form >
                                    <select className="form-control" name="userlevel"
                                      onChange={handleSelectBrand} >
                                      <option>===== 선택 =====</option>
                                      {allBrandList.map(item => (
                                        <option key={item.pk}
                                        >
                                          {item.brand_name}
                                        </option>
                                      ))}
                                    </select>
                                  </form>
                                </div>
                              </Col>
                              <Col>
                                <Label>선택한 브랜드</Label>
                                <UseBrandContainer>{brandNameList.map(item => (
                                  <UseBrandContent>{item}</UseBrandContent>
                                ))}</UseBrandContainer>
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
