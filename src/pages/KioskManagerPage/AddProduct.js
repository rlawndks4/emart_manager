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

import Dropzone from "react-dropzone"
import SweetAlert from "react-bootstrap-sweetalert"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from 'axios'
import { useHistory } from 'react-router';
import cancel from "./cancel.png"
import save from "./save.png"
import up from "./up.png"
import down from "./down.png"
import select from "./select.png"
import styled from "styled-components"
const SelectStyle = styled.div`
select {
  width: 100%; 
  font-family: inherit;
  background: url(${select}) no-repeat 97.5% 50%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  }
  select::-ms-expand {
      display: none;
  }
`
const AddProduct = () => {

  const history = useHistory();
  const [itemName, setItemName] = useState('')
  const [itemNum, setItemNum] = useState('')
  const [selectedMainFiles, setselectedMainFiles] = useState([])
  const [selectedDetailFiles, setselectedDetailFiles] = useState([])
  const [selectedQrFiles, setselectedQrFiles] = useState([])
  const [isOpen, setIsOpen] = useState(true);

  const [mainFile, setMainFile] = useState({
    file: []
  });
  const [detailFile, setDetailFile] = useState({
    file: []
  });
  const [qrFile, setQrFile] = useState({
    file: []
  });

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

  const [toggleProductIcon, setToggleProductIcon] = useState(`${down}`)
  const [isOpenAddproduct, setIsOpenAddproduct] = useState(false);
  const toggleAddproduct = () => {
    setIsOpenAddproduct(!isOpenAddproduct)
    if(toggleProductIcon==`${up}`){
      setToggleProductIcon(`${down}`)
    }
    else{
      setToggleProductIcon(`${up}`)
    }

  };

  const [toggleDetailProductIcon, setToggleDetailProductIcon] = useState(`${down}`)
  const [isOpenAddDetailproduct, setIsOpenAddDetailproduct] = useState(false);
  const toggleAddDetailproduct = () => {
    setIsOpenAddDetailproduct(!isOpenAddDetailproduct)
    if(toggleDetailProductIcon==`${up}`){
      setToggleDetailProductIcon(`${down}`)
    }
    else{
      setToggleDetailProductIcon(`${up}`)
    }

  };
  
  const [toggleQrProductIcon, setToggleQrProductIcon] = useState(`${down}`)
  const [isOpenAddQRproduct, setIsOpenAddQRproduct] = useState(false);
  const toggleAddQRproduct = () => {
    setIsOpenAddQRproduct(!isOpenAddQRproduct)
    if(toggleQrProductIcon==`${up}`){
      setToggleQrProductIcon(`${down}`)
    }
    else{
      setToggleQrProductIcon(`${up}`)
    }

  };

 

  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);
  const [with_good, setwith_good] = useState(false);

  const statusList = ["판매중", "품절"];
  const [selectedStatus, setSelectedStatus] = useState("판매중");
  const [statusnum, setStatusNum] = useState(1)

  const classList = ["일반 상품", "오늘의 상품"];
  const [selectedclass, setSelectedclass] = useState("일반 상품");
  const [classification, setClassification] = useState(0);

  const [brandList,setBrandList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");


  const [middleClassList, setMiddleClassList] = useState([]);
  const [selectedmiddleClass, setSelectedmiddleClass] = useState('');
  const [price, setPrice] = useState(0)
  const isAdmin = async () => {

    const { data: response } = await axios.get('/api/auth')
    if (!response.third) {
      alert('회원만 접근 가능합니다.')
      history.push('/login')
    } else {

    }
  }

  useEffect(() => {
    isAdmin()
  }, [])
  //선택한 값 넣어주는 함수
  const handleSelectClass = (e) => {
    setSelectedclass(e.target.value);
  };
  
  useEffect(() => {
    async function fetchPosts() {
      
      const {data:response} = await axios.get('/api/mybrand')
      console.log(response)
      setBrandList(response.data.result)
      let middleClassList = []
        if(response.data.result[0].middle_class_1){
          middleClassList.push(response.data.result[0].middle_class_1)
        }
        if(response.data.result[0].middle_class_2){
          middleClassList.push(response.data.result[0].middle_class_2)
        }
        if(response.data.result[0].middle_class_3){
          middleClassList.push(response.data.result[0].middle_class_3)
        }
        if(response.data.result[0].middle_class_4){
          middleClassList.push(response.data.result[0].middle_class_4)
        }
        if(response.data.result[0].middle_class_5){
          middleClassList.push(response.data.result[0].middle_class_5)
        }
     
       setSelectedBrand(response.data.result[0].brand_name)
      setMiddleClassList(middleClassList)
      setSelectedmiddleClass(middleClassList[0])
    }
    fetchPosts()
  }, [])

  // function onChangeBrand(num) {
  //   async function fetchPosts() {
  //     const brandPk = num
  //     const {data:response} = await axios.get(`/api/allbrand/${brandPk}`)
  //     setMiddleClassList(response.data)
  //   }
  //   fetchPosts()
  // };
  const handleSelectMiddleClass = (e) => {
    setSelectedmiddleClass(e.target.value);
  };
  
  const handleSelectStatus = (e) => {
    setSelectedStatus(e.target.value);
  };
  //서버에 보낼대 int형으로 저장되므로 브랜드 이름과 번호가 매칭이 되게 구성
  useEffect(() => {
    if (selectedStatus === '판매중') setStatusNum(1)
    else {
      setStatusNum(0)
    }
  })

  //디비에 저장하게 하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemName.length ||
      !itemNum.length ||
      !mainFile ||
      !detailFile ||
      !qrFile) {
      alert("필수 입력 사항을 입력하지 않으셨습니다.");
      setwith_save(false)
    }
    else {//brandPk, itemNum, itemName, classification, middleClass, status
      let brand_pk = 0
      for(var i = 0;i<brandList.length;i++){
        if(brandList[i].brand_name==selectedBrand){
          brand_pk = brandList[i].pk
          break;
        }
      }
      const formData = new FormData();
      formData.append('mainImage', mainFile)
      formData.append('detailImage', detailFile)
      formData.append('qrImage', qrFile)

      formData.append('brandPk', brand_pk)
      formData.append('itemNum', itemNum)

      formData.append('itemName', itemName)
      formData.append('classification', classification)
      formData.append('middleClass', selectedmiddleClass)
      formData.append('status', statusnum)
      formData.append('price',price)
      const headers = {
        'Content-type': 'multipart/form-data; charset=UTF-8',
        'Accept': '*/*'
      }
      console.log(formData)

      const {data:response } = await axios.post('/api/addproduct', formData, { headers })

      setwith_save(false)
      setwith_good(true)
    }
  }
  //브랜드 선택
  const onChangeBrand = (e) =>{
    setSelectedBrand(e.target.value)
    for(var i=0;i<brandList.length;i++){
      if(e.target.value==brandList[i].brand_name){
        let middleClassList = []
        if(brandList[i].middle_class_1){
          middleClassList.push(brandList[i].middle_class_1)
        }
        if(brandList[i].middle_class_2){
          middleClassList.push(brandList[i].middle_class_2)
        }
        if(brandList[i].middle_class_3){
          middleClassList.push(brandList[i].middle_class_3)
        }
        if(brandList[i].middle_class_4){
          middleClassList.push(brandList[i].middle_class_4)
        }
        if(brandList[i].middle_class_5){
          middleClassList.push(brandList[i].middle_class_5)
        }
      
        setMiddleClassList(middleClassList)
        setSelectedmiddleClass(middleClassList[0])
      }
    }
  }
  //파일 저장 함수
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
  //상품의 종류도 int형으로 저장되므로 만든 함수
  useEffect(() => {
    if (selectedclass === "오늘의 상품") {
      setClassification(1);
    }
    else {
      setClassification(0)
    }
  })
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
  //파일을 하나식 담기위해 구성된 함수
  useEffect(() => {
    setMainFile(selectedMainFiles[0])
    setDetailFile(selectedDetailFiles[0])
    setQrFile(selectedQrFiles[0])
  })
  const onChangePrice = (e) =>{
    setPrice(e.target.value)
  }
  return (
    <React.Fragment>
      <div className="page-content" style={{color:'#596275'}}>
        <Container fluid style={{fontFamily:'NanumGothic',color:'#596275 important!'}}>
          <Breadcrumbs breadcrumbItem="상품추가" />
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
                          <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>상품 추가</h5>
                          <p className="text-muted text-truncate mb-0">아래의 모든 정보를 입력하세요.</p>
                        </div>
                        {/* <i className="mdi mdi-chevron-up accor-down-icon font-size-24"></i> */}
                        <img src={toggleIcon}/>
                      </Media>
                      
                    </div>
                  </Link>

                  <Collapse isOpen={isOpen}>
                    <div className="p-4 border-top">
                      <Form>
                        <Row>
                          <Col md="4">
                            <div className="mb-3">
                              <Label htmlFor="productname" style={{ fontWeight: '1000' }}>상품명</Label>
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
                              <Label htmlFor="productname" style={{ fontWeight: '1000' }}>상품번호</Label>
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
                              <Label style={{ fontWeight: '1000' }}>브랜드</Label>
                              <form >
                              <SelectStyle>
                                <select className="form-control" name="userlevel"
                                  onChange={onChangeBrand} value={selectedBrand}>
                                  {brandList && brandList.map((item) => (
                                    <option key={item.pk}>
                                      {item.brand_name}
                                    </option>
                                  ))}
                                </select>
                                </SelectStyle>
                              </form>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="4">
                            <div className="mb-3">
                              <Label style={{ fontWeight: '1000' }}>상품분류</Label>
                              <form >
                              <SelectStyle>
                                <select className="form-control" name="userlevel"
                                  onChange={handleSelectClass} value={selectedclass}>
                                  {classList.map((item) => (
                                    <option value={item} key={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                                </SelectStyle>
                              </form>
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="mb-3">
                              <Label style={{ fontWeight: '1000' }}>중분류</Label>
                              <form >
                                <SelectStyle>
                                <select className="form-control" name="userlevel"
                                  onChange={handleSelectMiddleClass} value={selectedmiddleClass}>
                                    {middleClassList && middleClassList.map(post=>(
                                      <option>
                                        {post}
                                      </option>
                                    ))}
                                  
                                  
                                </select>
                                </SelectStyle>
                              </form>
                            </div>
                          </Col>
                         
                          <Col md="4">
                            <div className="mb-3">
                              <Label style={{ fontWeight: '1000' }}>상태</Label>
                              <form >
                              <SelectStyle>
                                <select className="form-control" name="userlevel"
                                  onChange={handleSelectStatus} value={selectedStatus}>
                                  {statusList.map((item) => (
                                    <option value={item} key={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                                </SelectStyle>
                              </form>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                        <Col md="4">
                            <div className="mb-3">
                              <Label htmlFor="productname" style={{ fontWeight: '1000' }}>가격</Label>
                              <Input
                                id="productname"
                                name="productname"
                                type="text"
                                className="form-control"
                                value={price}
                                onChange={onChangePrice}
                                placeholder='숫자만 입력해 주세요'
                              />
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
                          <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>메인 이미지</h5>
                          <p className="text-muted text-truncate mb-0">메인 이미지를 등록해 주세요.
                            <br />이미지는 238x238 사이즈로 JPG, PNG 파일 이미지만 등록 가능합니다.</p>
                        </div>
                        <img src={toggleProductIcon}/>
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
                                  <h4>이미지를 업로드 해주세요.</h4>
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
                          <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>상세 이미지</h5>
                          <p className="text-muted text-truncate mb-0">상세 이미지를 등록해 주세요.
                            <br />이미지는 1000x1200 사이즈로 JPG, PNG 파일 이미지만 등록 가능합니다.</p>
                        </div>
                        <img src={toggleDetailProductIcon}/>
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
                                  <h4>이미지를 업로드 해주세요.</h4>
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
                          <h5 className="font-size-16 mb-1" style={{ fontFamily: 'NanumGothic', fontWeight: 'bold' }}>QR 코드 이미지</h5>
                          <p className="text-muted text-truncate mb-0">QR 코드 이미지를 등록해 주세요.
                            <br />이미지는 320x320 사이즈로 JPG,PNG 파일 이미지만 등록 가능합니다.</p>
                        </div>
                        <img src={toggleQrProductIcon}/>
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
                                  <h4>이미지를 업로드 해주세요.</h4>
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
                  <Link to="/product-list" className="btn btn-success" onClick={() => {
                    setwith_cancel(false)
                  }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                </SweetAlert>

              ) : null}
              {with_good ? (
                <SweetAlert
                  title="상품이 추가되었습니다."
                  success
                  showConfirm={false}
                  style={{
                    paddingBottom: '42px'
                  }}
                >
                  <br />

                  <Link to="/product-list" className="btn btn-primary"> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                </SweetAlert>
              ) : null}
            </Col>

          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AddProduct
