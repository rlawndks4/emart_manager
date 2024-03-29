import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Input,
  Collapse,
  Card,
  Form,
  Label,
  Media,
  Spinner
} from "reactstrap"
import Dropzone from "react-dropzone"
import { Link } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { useHistory, useLocation } from 'react-router-dom';
import axios from "axios"
import styled from "styled-components"
import cancel from "../cancel.png"
import save from "../save.png"
import up from "../up.png"
import down from "../down.png"
const LoadingBox = styled.div`
width: 100%;
align-items: center;
display: flex;
flex-direction: column;
`
const AdRevise = () => {
  const history = useHistory();
  const [revisePk, setRevisePk] = useState(0);
  const [reviseImg, setReviseImg] = useState({ file: [] })
  const [reviseName, setReviseName] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
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
  const [selectedFiles, setselectedFiles] = useState([])
  const [adFile, setAdFile] = useState(
    { file: [] }
  );



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

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })

    )
    setselectedFiles(files)
  }

  const location = useLocation();

  useEffect(() => {
    if (typeof location.state != "undefined") {
      setRevisePk(location.state.pk)
      setReviseImg(location.state.img)
      setReviseName(location.state.name)
    }
    else{
      history.push('/ad-list')
    }
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !reviseName.length) {
      alert("필수 입력 사항을 입력하지 않으셨습니다.");
      setwith_save(false)
    }
    else {
      const formData = new FormData();
      formData.append('adName', reviseName)
      formData.append('image', adFile)
      formData.append('pk', revisePk)
      axios.put('/api/updatead', formData)
      setwith_save(false)
      setwith_good(true)

    }
  }



  const onChangeAdName = (e) => {
    setReviseName(e.target.value)
  }

  useEffect(() => {
    setAdFile(selectedFiles[0]);
  })

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
        <>
          {
            loading &&
            <LoadingBox><Spinner className="m-1" color="primary" /></LoadingBox>
          }
          <Container fluid style={{fontFamily:'NanumGothic'}}>
            <Breadcrumbs breadcrumbItem="광고 관리" />

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
                              <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>광고 수정</h5>
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
                                      광고명
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      placeholder="#123456"
                                      style={{fontWeight:'500'}}
                                      value={reviseName}
                                      onChange={onChangeAdName}
                                    />
                                  </div>
                                </Col>

                                <div className="p-4 border-top">
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
                                                <i className="display-4 text-muted uil uil-cloud-upload"></i>
                                              </div>
                                              <h4>사진을 업로드 해주세요.</h4>
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
                          <Link to="#" className="btn btn-success" onClick={handleSubmit}> <i className="uil uil-file-alt me-1"></i> 저장 </Link>
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
                          <Link to="/ad-list" className="btn btn-success" onClick={() => {
                            setwith_cancel(false)
                          }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                        </SweetAlert>

                      ) : null}
                      {with_good ? (
                        <SweetAlert
                          title="광고가 수정되었습니다."
                          success
                          showConfirm={false}
                          style={{
                            paddingBottom: '42px'
                          }}
                        >
                          <br />

                          <Link to="/ad-list" className="btn btn-primary"> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                        </SweetAlert>
                      ) : null}
                    </Col>

                  </Row>
                </Col>

              </Row>
            </div>
          </Container>
        </>
      </div>
    </React.Fragment>
  )
}

export default AdRevise
