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
  Collapse
} from "reactstrap"
import Select from "react-select"
import Dropzone from "react-dropzone"
import SweetAlert from "react-bootstrap-sweetalert"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from 'axios'
import { useHistory , useLocation } from 'react-router';
const ProductRevise = () => {
  const history = useHistory();
  const [itemName, setItemName] = useState('')
  const [itemNum, setItemNum] = useState('')
  const [brandPk, setBrandPk] = useState(1)
  const [selectedMainFiles, setselectedMainFiles] = useState([])
  const [selectedDetailFiles, setselectedDetailFiles] = useState([])
  const [selectedQrFiles, setselectedQrFiles] = useState([])
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  const [isOpenAddproduct, setIsOpenAddproduct] = useState(false);
  const toggleAddproduct = () => setIsOpenAddproduct(!isOpenAddproduct);

  const [isOpenAddDetailproduct, setIsOpenAddDetailproduct] = useState(false);
  const toggleAddDetailproduct = () => setIsOpenAddDetailproduct(!isOpenAddDetailproduct);

  const [isOpenAddQRproduct, setIsOpenAddQRproduct] = useState(false);
  const toggleAddQRproduct = () => setIsOpenAddQRproduct(!isOpenAddQRproduct);

  const [isOpenMetadata, setIsOpenMetadata] = useState(false);

  const toggleMetadata = () => setIsOpenMetadata(!isOpenMetadata);

  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);

  
  const classList = ["일반 상품", "오늘의 상품"];
  const [selectedclass, setSelectedclass] = useState("일반 상품");

  const brandList = ["kissher", "silit", "happycall", "tefal", "emile henry"];
  const [selectedBrand, setSelectedBrand] = useState("kissher");
 
  const [userLevel, setUserLevel] = useState(0);
  const middleClassList = ["프라이팬", "냄비", "매직핸즈", "주방가전", "생활가전"];
  const [selectedmiddleClass, setSelectedmiddleClass] = useState("프라이팬");

  const handleSelectClass = (e) => {
    setSelectedclass(e.target.value);
  };
  const handleSelectBrand = (e) => {
    setSelectedBrand(e.target.value);
  };
  const handleSelectMiddleClass = (e) => {
    setSelectedmiddleClass(e.target.value);
  };
  useEffect(()=>{
    if(selectedBrand==='kissher') setBrandPk(1)
      else if(selectedBrand==='silit') setBrandPk(2)
      else if(selectedBrand==='happycall') setBrandPk(3)
      else if(selectedBrand==='tefal') setBrandPk(4)
      else{
        setBrandPk(5)
      }
   })
  console.log(itemName)
  console.log(itemNum)
  console.log(selectedmiddleClass)
  console.log(selectedclass)
  console.log(brandPk)
  console.log(selectedMainFiles)
  console.log(selectedDetailFiles)
  console.log(selectedQrFiles)
   const handleSubmit = async (e) => {
     e.preventDefault()
     if( itemName.length==0 ||
       itemNum==0 ||
       !selectedMainFiles ||
       !selectedDetailFiles||
       !selectedQrFiles){
         alert("필수 입력 사항을 입력하지 않으셨습니다.");
         setwith_save(false)
       }
       else{//brandPk, itemNum, itemName, classification, middleClass, status
         const formData = new FormData();
         formData.append('mainImage', selectedMainFiles)
          formData.append('detailImage', selectedDetailFiles)
          formData.append('qrImage',selectedQrFiles)
          formData.append('brandPk',brandPk)
          formData.append('itemNum',itemNum)
          formData.append('itemName',itemName)
          formData.append('classification', selectedclass)
          formData.append('middleClass',selectedmiddleClass)
          
         axios.post('/api/addproduct', formData)
         alert("상품이 추가되었습니다.")
         history.push('/product-list')
       }
   }

  function handleAcceptedMainFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })
    )

    setselectedMainFiles(files)
  }
  function handleAcceptedDetailFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })
    )

    setselectedDetailFiles(files)
  }
  function handleAcceptedQrFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })
    )

    setselectedQrFiles(files)
  }
  const onChangeItemName = (e) => {
    setItemName(e.target.value)
  }
  const onChangeItemNum = (e) => {
    setItemNum(e.target.value)
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
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItem="상품관리" />
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
                          <h5 className="font-size-16 mb-1">상품 수정</h5>
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
                          <Col md="4">
                            <div className="mb-3">
                              <Label htmlFor="productname">상품명</Label>
                              <Input
                                id="productname"
                                name="productname"
                                type="text"
                                className="form-control"
                                onChange={onChangeItemName}
                              />
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="mb-3">
                              <Label htmlFor="productname">상품번호</Label>
                              <Input
                                id="productname"
                                name="productname"
                                type="text"
                                className="form-control"
                                onChange={onChangeItemNum}
                              />
                            </div>
                          </Col>
                          <Col md="4">
                          <div className="mb-3">
                                  <Label>중분류</Label>
                                  <form >
                                    <select className="form-control" name="userlevel"
                                      onChange={handleSelectMiddleClass} value={selectedmiddleClass}>
                                      {middleClassList.map((item) => (
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
                          <Col md="4">
                          <div className="mb-3">
                                  <Label>상품분류</Label>
                                  <form >
                                    <select className="form-control" name="userlevel"
                                      onChange={handleSelectClass} value={selectedclass}>
                                      {classList.map((item) => (
                                        <option value={item} key={item}>
                                          {item}
                                        </option>
                                      ))}
                                    </select>
                                  </form>
                                </div>
                          </Col>
                          <Col md="4">
                          <div className="mb-3">
                                  <Label>브랜드</Label>
                                  <form >
                                    <select className="form-control" name="userlevel"
                                      onChange={handleSelectBrand} value={selectedBrand}>
                                      {brandList.map((item) => (
                                        <option value={item} key={item}>
                                          {item}
                                        </option>
                                      ))}
                                    </select>
                                  </form>
                                </div>
                          </Col>
                          
                        </Row>

                        


                      </Form>
                    </div>
                  </Collapse>
                </Card>

                <Card>
                  <Link to="#" className="text-dark collapsed" onClick={toggleAddproduct}>
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
                          <h5 className="font-size-16 mb-1">메인 사진</h5>
                          <p className="text-muted text-truncate mb-0">상품이미지를 등록해 주세요.
                            <br />상품사진은 430x315 사이즈로 PG,PNG 파일 이미지만 등록 가능합니다.</p>
                        </div>
                        <i className="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                      </Media>

                    </div>
                  </Link>
                  <Collapse isOpen={isOpenAddproduct}>
                    <div className="p-4 border-top">
                      <Form>
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedMainFiles(acceptedFiles)
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
                          {selectedMainFiles.map((f, i) => {
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
                  </Collapse>
                </Card>

                <Card>
                  <Link to="#" className="text-dark collapsed" onClick={toggleAddDetailproduct}>
                    <div className="p-4">

                      <Media className="d-flex align-items-center">
                        <div className="me-3">
                          <div className="avatar-xs">
                            <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                              03
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h5 className="font-size-16 mb-1">상세 사진</h5>
                          <p className="text-muted text-truncate mb-0">상세 사진을 등록해 주세요.
                            <br />상품사진은 430x315 사이즈로 PG,PNG 파일 이미지만 등록 가능합니다.</p>
                        </div>
                        <i className="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                      </Media>

                    </div>
                  </Link>
                  <Collapse isOpen={isOpenAddDetailproduct}>
                    <div className="p-4 border-top">
                      <Form>
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedDetailFiles(acceptedFiles)
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
                          {selectedDetailFiles.map((f, i) => {
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
                  </Collapse>
                </Card>
                <Card>
                  <Link to="#" className="text-dark collapsed" onClick={toggleAddQRproduct}>
                    <div className="p-4">

                      <Media className="d-flex align-items-center">
                        <div className="me-3">
                          <div className="avatar-xs">
                            <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                              04
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h5 className="font-size-16 mb-1">QR 코드 사진</h5>
                          <p className="text-muted text-truncate mb-0">QR 코드 사진을 등록해 주세요.
                            <br />상품사진은 430x315 사이즈로 PG,PNG 파일 이미지만 등록 가능합니다.</p>
                        </div>
                        <i className="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                      </Media>

                    </div>
                  </Link>
                  <Collapse isOpen={isOpenAddQRproduct}>
                    <div className="p-4 border-top">
                      <Form>
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedQrFiles(acceptedFiles)
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
                          {selectedQrFiles.map((f, i) => {
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
                  </Collapse>
                </Card>
              </div>



            </Col>
          </Row>
          <Row>
            {/* <Col>
                    <Link to="/ecommerce-products" className="btn btn-link text-muted">
                      <i className="uil uil-arrow-left me-1"></i> Continue Shopping
                    </Link>
                  </Col> */}
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
                  <Link to="#" className="btn btn-success" onClick={handleSubmit}> <i className="uil uil-file-alt me-1"></i> 저장 </Link>
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
                  <Link to="/product-list" className="btn btn-success" onClick={() => {
                    setwith_cancel(false)
                  }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                </SweetAlert>

              ) : null}

            </Col>

          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ProductRevise
