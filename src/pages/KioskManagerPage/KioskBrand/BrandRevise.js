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
import Dropzone from "react-dropzone"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from "axios";
import cancel from "../cancel.png"
import save from "../save.png"
import up from "../up.png"
import down from "../down.png"
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
      if (!response.second) {
        alert('관리자만 접근 가능합니다.')
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
  const [with_good, setwith_good] = useState(false)
  const [brandName, setBrandName] = useState('')
  const [revisePk, setRevisePk] = useState(0)
  const [class1, setClass1] = useState('')
  const [class2, setClass2] = useState('')
  const [class3, setClass3] = useState('')
  const [class4, setClass4] = useState('')
  const [class5, setClass5] = useState("");
  const [class6, setClass6] = useState("");
  const [class7, setClass7] = useState("");
  const [class8, setClass8] = useState("");
  const [class9, setClass9] = useState("");
  const [class10, setClass10] = useState("");
  const [status, setStatus] = useState('')
  const statusList = ['사용중', '사용안함'];
  const [statusNum, setStatusNum] = useState(0)
  const location = useLocation();
  const [brandFile, setBrandFile] = useState({
    file: []
  })
  const [selectedFiles, setselectedFiles] = useState([])
  useEffect(() => {
    if (typeof location.state != "undefined") {
      setRevisePk(location.state.pk)
      setBrandName(location.state.name)
      setClass1(location.state.class1)
      setClass2(location.state.class2)
      setClass3(location.state.class3)
      setClass4(location.state.class4)
      setClass5(location.state.class5)
      setClass6(location.state.class6)
      setClass7(location.state.class7)
      setClass8(location.state.class8)
      setClass9(location.state.class9)
      setClass10(location.state.class10)
      setStatus(location.state.status)
    }
    else{
      history.push('/brand-list')
    }
  }, [])
  const onSubmit =async () => {
    if (!brandName.length ) {
      alert('필수 값을 입력하지 않았습니다.')
      setwith_save(false)
    }
    else {
      let formData = new FormData();
      formData.append('pk',revisePk)
      formData.append('image', brandFile)
      formData.append('brandName', brandName)
      formData.append('class1', class1)
      formData.append('class2', class2)
      formData.append('class3', class3)
      formData.append('class4', class4)
      formData.append('class5', class5)
      formData.append('class6', class6)
      formData.append('class7', class7)
      formData.append('class8', class8)
      formData.append('class9', class9)
      formData.append('class10', class10)
      formData.append('status',statusNum)
      const config = {
        header: {
          'Content-type': 'multipart/form-data; charset=UTF-8',
          'Accept': '*/*'
        }
      }
      const {data:response} = await  axios.put('/api/updatebrand', formData, config )
      if(response.result<0){
        alert(response.message)
        setwith_save(false)
      } else {
        alert('성공적으로 수정되었습니다.')
        setwith_save(false)
        history.push('/brand-list')
      }
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
  const onChangeClass5 = (e) => {
    setClass5(e.target.value)
  }
  const onChangeClass6 = (e) => {
    setClass6(e.target.value)
  }
  const onChangeClass7 = (e) => {
    setClass7(e.target.value)
  }
  const onChangeClass8 = (e) => {
    setClass8(e.target.value)
  }
  const onChangeClass9 = (e) => {
    setClass9(e.target.value)
  }
  const onChangeClass10 = (e) => {
    setClass10(e.target.value)
  }
  const handleSelectStatus = (e) => {
    setStatus(e.target.value);
  };
  useEffect(() => {
    setBrandFile(selectedFiles[0]);
  }, [selectedFiles])
  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })

    )
    setselectedFiles(files)
  }
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }
  return (
    <React.Fragment>
      <div className="page-content" style={{color:'#596275'}}>
        <Container fluid style={{fontFamily:'NanumGothic'}}>
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
                                    style={{ fontWeight: '1000' }}>
                                    브랜드
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="billing-name"
                                    placeholder="#ABCDEF"
                                    style={{fontWeight:'500'}}
                                    value={brandName}

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
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    중분류5
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class4"
                                    style={{fontWeight:'500'}}
                                    value={class5}
                                    required onChange={onChangeClass5}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-email-address"

                                    className="form-label"
                                  >
                                    중분류6
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class1"
                                    style={{fontWeight:'500'}}
                                    value={class6}
                                    required onChange={onChangeClass6}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    중분류7
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class2"
                                    style={{fontWeight:'500'}}
                                    value={class7}
                                    required onChange={onChangeClass7}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    중분류8
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class3"
                                    style={{fontWeight:'500'}}
                                    value={class8}
                                    required onChange={onChangeClass8}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    중분류9
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class4"
                                    style={{fontWeight:'500'}}
                                    value={class9}
                                    required onChange={onChangeClass9}
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    중분류10
                                  </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input Class4"
                                    style={{fontWeight:'500'}}
                                    value={class10}
                                    required onChange={onChangeClass10}
                                  />
                                </div>
                              </Col>
                              <div className="p-4 border-top">
                                <Label
                                  htmlFor="billing-phone"

                                  className="form-label"
                                >
                                  브랜드 이미지
                                </Label>
                                <Form>
                                  <Dropzone
                                    onDrop={acceptedFiles => {
                                      handleAcceptedFiles(acceptedFiles)
                                    }}
                                  >
                                    {({ getRootProps, getInputProps }) => (
                                      <div className="dropzone">
                                        <div
                                          className="dz-message needsclick"
                                          {...getRootProps()}
                                        >
                                          <input {...getInputProps()} />
                                          <div className="dz-message needsclick">
                                            <div className="mb-3">
                                              <i className="display-4 text-muted uil uil-cloud-upload" ></i>
                                            </div>
                                            <h4>파일을 업로드 해주세요.<br />(jpg, png, jpeg, gif, mp4, avi)<br/>세로 150px(고정), 가로 880px 이하</h4>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Dropzone>
                                  <div className="dropzone-previews mt-3" id="file-previews">
                                    {selectedFiles.map((f, i) => {
                                      return (
                                        <Card
                                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                          key={i + "-file"}
                                        >
                                          <div className="p-2">
                                            <Row className="align-items-center">
                                              <Col className="col-auto">
                                                <img
                                                  data-dz-thumbnail=""
                                                  height="80"
                                                  className="avatar-sm rounded bg-light"
                                                  alt={f.name}
                                                  src={f.preview}
                                                />
                                              </Col>
                                              <Col>
                                                <Link
                                                  to="#"
                                                  className="text-muted font-weight-bold"
                                                >
                                                  {f.name}
                                                </Link>
                                                <p className="mb-0">
                                                  <strong>{f.formattedSize}</strong>
                                                </p>
                                              </Col>
                                            </Row>
                                          </div>
                                        </Card>
                                      )
                                    })}
                                  </div>
                                </Form>
                              </div>
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
