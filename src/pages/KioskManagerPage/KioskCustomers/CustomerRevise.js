import React, { useState } from "react"
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Collapse,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  Media
} from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link } from "react-router-dom"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"


const CustomerRevise = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toggle = () => setIsOpen(!isOpen);
 
  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs  breadcrumbItem="회원관리" />

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
                          <h5 className="font-size-16 mb-1">회원 수정</h5>
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
                                    id="billing-name"
                                    placeholder="#ABCDEF"
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
                                    id="billing-email-address"
                                    placeholder="123****"
                                  />
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3 mb-4">
                                  <Label
                                    htmlFor="billing-phone"

                                    className="form-label"
                                  >
                                    브랜드
                              </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="billing-phone"
                                    placeholder="Happycall"
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
                  {/* <Col>
                    <Link to="/ecommerce-products" className="btn btn-link text-muted">
                      <i className="uil uil-arrow-left me-1"></i> Continue Shopping
                    </Link>
                  </Col> */}
                  <Col>
                    <div className="text-sm-end mt-2 mt-sm-0">
                    <Link to="#" className="btn btn-danger"  onClick={() => {
                        setwith_cancel(true)
                      }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                    <Link to="#" className="btn btn-success"  onClick={() => {
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
                    <br/>
                    <Link to="#" className="btn btn-danger"  onClick={() => {
                        setwith_save(false)
                      }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                    <Link to="#" className="btn btn-success"  onClick={() => {
                        setwith_save(false)
                      }}> <i className="uil uil-file-alt me-1"></i> 저장 </Link> 
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
                    <br/>
                    <Link to="#" className="btn btn-danger"  onClick={() => {
                        setwith_cancel(false)
                      }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                    <Link to="/customer-list" className="btn btn-success"  onClick={() => {
                        setwith_cancel(false)
                      }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>   
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
