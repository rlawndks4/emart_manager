import React, { useState, useEffect } from "react"
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
import {useHistory, useLocation} from 'react-router';
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import styled from "styled-components"
//Import Images
import img1 from "../../../assets/images/product/img-1.png"
import img6 from "../../../assets/images/product/img-6.png"
import axios from "axios";
const LoadingBox = styled.div`
width: 100%;
align-items: center;
display: flex;
flex-direction: column;
`

const orderSummary = [
  {
    id: 1,
    img: img1,
    productTitle: "Nike N012 Running Shoes",
    price: 260,
    qty: 2,
  },
  { id: 2, img: img6, productTitle: "Adidas Running Shoes", price: 260, qty: 1 },
]

const BrandRevise = () => {
  const [loading, setLoading] = useState(false);
  const isAdmin = async () => {
    setLoading(true);
    const { data: response } = await axios.get('/api/auth')
    if(!response.third){
      alert('회원만 접근 가능합니다.')
      history.push('/login')
    }
    else{
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

  const toggle = () => setIsOpen(!isOpen);

  const [isOpenShippinginfo, setIsOpenShippinginfo] = useState(false);

  const toggleShippinginfo = () => setIsOpenShippinginfo(!isOpenShippinginfo);

  const [isOpenPaymentinfo, setIsOpenPaymentinfo] = useState(false);

  const togglePaymentinfo = () => setIsOpenPaymentinfo(!isOpenPaymentinfo);


  const [with_save, setwith_save] = useState(false);
  const [with_cancel, setwith_cancel] = useState(false);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs  breadcrumbItem="브랜드관리" />

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
                          <h5 className="font-size-16 mb-1">브랜드 수정</h5>
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
                                    중분류1
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
                                    중분류2
                              </Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="billing-phone"
                                    placeholder="Happycall"
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
                                    id="billing-phone"
                                    placeholder="Happycall"
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
                                    id="billing-phone"
                                    placeholder="Happycall"
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
                                    id="billing-phone"
                                    placeholder="Happycall"
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              {" "}
                            </Row>
                            {/* <div className="mb-4">
                              <Label
                                htmlFor="billing-address"
                                className="form-label"
                              >
                                Address
                              </Label>
                              <textarea
                                className="form-control"
                                id="billing-address"
                                rows="3"
                                placeholder="Enter full address"
                              />
                            </div> */}
                            <Row>
                              {/* <Col lg={4}>
                                <FormGroup className="mb-4 mb-lg-0">
                                  <Label className="form-label">
                                    Country
                                  </Label>
                                  <select
                                    className="form-control form-select select2"
                                    title="Country"
                                  >
                                    <option value="0">Select Country</option>
                                    <option value="AF">Afghanistan</option>
                                    <option value="AL">Albania</option>
                                    <option value="DZ">Algeria</option>
                                    <option value="AS">American Samoa</option>
                                    <option value="AD">Andorra</option>
                                    <option value="AO">Angola</option>
                                    <option value="AI">Anguilla</option>
                                    <option value="AQ">Antarctica</option>
                                    <option value="AR">Argentina</option>
                                    <option value="AM">Armenia</option>
                                    <option value="AW">Aruba</option>
                                    <option value="AU">Australia</option>
                                    <option value="AT">Austria</option>
                                    <option value="AZ">Azerbaijan</option>
                                    <option value="BS">Bahamas</option>
                                    <option value="BH">Bahrain</option>
                                    <option value="BD">Bangladesh</option>
                                    <option value="BB">Barbados</option>
                                    <option value="BY">Belarus</option>
                                    <option value="BE">Belgium</option>
                                    <option value="BZ">Belize</option>
                                    <option value="BJ">Benin</option>
                                    <option value="BM">Bermuda</option>
                                    <option value="BT">Bhutan</option>
                                    <option value="BO">Bolivia</option>
                                    <option value="BW">Botswana</option>
                                    <option value="BV">Bouvet Island</option>
                                    <option value="BR">Brazil</option>
                                    <option value="BN">Brunei Darussalam</option>
                                    <option value="BG">Bulgaria</option>
                                    <option value="BF">Burkina Faso</option>
                                    <option value="BI">Burundi</option>
                                    <option value="KH">Cambodia</option>
                                    <option value="CM">Cameroon</option>
                                    <option value="CA">Canada</option>
                                    <option value="CV">Cape Verde</option>
                                    <option value="KY">Cayman Islands</option>
                                    <option value="CF">
                                      Central African Republic
                                  </option>
                                    <option value="TD">Chad</option>
                                    <option value="CL">Chile</option>
                                    <option value="CN">China</option>
                                    <option value="CX">Christmas Island</option>
                                    <option value="CC">
                                      Cocos (Keeling) Islands
                                  </option>
                                    <option value="CO">Colombia</option>
                                    <option value="KM">Comoros</option>
                                    <option value="CG">Congo</option>
                                    <option value="CK">Cook Islands</option>
                                    <option value="CR">Costa Rica</option>
                                    <option value="CI">Cote d&#39;Ivoire</option>
                                    <option value="HR">Croatia (Hrvatska)</option>
                                    <option value="CU">Cuba</option>
                                    <option value="CY">Cyprus</option>
                                    <option value="CZ">Czech Republic</option>
                                    <option value="DK">Denmark</option>
                                    <option value="DJ">Djibouti</option>
                                    <option value="DM">Dominica</option>
                                    <option value="DO">Dominican Republic</option>
                                    <option value="EC">Ecuador</option>
                                    <option value="EG">Egypt</option>
                                    <option value="SV">El Salvador</option>
                                    <option value="GQ">Equatorial Guinea</option>
                                    <option value="ER">Eritrea</option>
                                    <option value="EE">Estonia</option>
                                    <option value="ET">Ethiopia</option>
                                    <option value="FK">
                                      Falkland Islands (Malvinas)
                                  </option>
                                    <option value="FO">Faroe Islands</option>
                                    <option value="FJ">Fiji</option>
                                    <option value="FI">Finland</option>
                                    <option value="FR">France</option>
                                    <option value="GF">French Guiana</option>
                                    <option value="PF">French Polynesia</option>
                                    <option value="GA">Gabon</option>
                                    <option value="GM">Gambia</option>
                                    <option value="GE">Georgia</option>
                                    <option value="DE">Germany</option>
                                    <option value="GH">Ghana</option>
                                    <option value="GI">Gibraltar</option>
                                    <option value="GR">Greece</option>
                                    <option value="GL">Greenland</option>
                                    <option value="GD">Grenada</option>
                                    <option value="GP">Guadeloupe</option>
                                    <option value="GU">Guam</option>
                                    <option value="GT">Guatemala</option>
                                    <option value="GN">Guinea</option>
                                    <option value="GW">Guinea-Bissau</option>
                                    <option value="GY">Guyana</option>
                                    <option value="HT">Haiti</option>
                                    <option value="HN">Honduras</option>
                                    <option value="HK">Hong Kong</option>
                                    <option value="HU">Hungary</option>
                                    <option value="IS">Iceland</option>
                                    <option value="IN">India</option>
                                    <option value="ID">Indonesia</option>
                                    <option value="IQ">Iraq</option>
                                    <option value="IE">Ireland</option>
                                    <option value="IL">Israel</option>
                                    <option value="IT">Italy</option>
                                    <option value="JM">Jamaica</option>
                                    <option value="JP">Japan</option>
                                    <option value="JO">Jordan</option>
                                    <option value="KZ">Kazakhstan</option>
                                    <option value="KE">Kenya</option>
                                    <option value="KI">Kiribati</option>
                                    <option value="KR">Korea, Republic of</option>
                                    <option value="KW">Kuwait</option>
                                    <option value="KG">Kyrgyzstan</option>
                                    <option value="LV">Latvia</option>
                                    <option value="LB">Lebanon</option>
                                    <option value="LS">Lesotho</option>
                                    <option value="LR">Liberia</option>
                                    <option value="LY">
                                      Libyan Arab Jamahiriya
                                  </option>
                                    <option value="LI">Liechtenstein</option>
                                    <option value="LT">Lithuania</option>
                                    <option value="LU">Luxembourg</option>
                                    <option value="MO">Macau</option>
                                    <option value="MG">Madagascar</option>
                                    <option value="MW">Malawi</option>
                                    <option value="MY">Malaysia</option>
                                    <option value="MV">Maldives</option>
                                    <option value="ML">Mali</option>
                                    <option value="MT">Malta</option>
                                    <option value="MH">Marshall Islands</option>
                                    <option value="MQ">Martinique</option>
                                    <option value="MR">Mauritania</option>
                                    <option value="MU">Mauritius</option>
                                    <option value="YT">Mayotte</option>
                                    <option value="MX">Mexico</option>
                                    <option value="MD">
                                      Moldova, Republic of
                                  </option>
                                    <option value="MC">Monaco</option>
                                    <option value="MN">Mongolia</option>
                                    <option value="MS">Montserrat</option>
                                    <option value="MA">Morocco</option>
                                    <option value="MZ">Mozambique</option>
                                    <option value="MM">Myanmar</option>
                                    <option value="NA">Namibia</option>
                                    <option value="NR">Nauru</option>
                                    <option value="NP">Nepal</option>
                                    <option value="NL">Netherlands</option>
                                    <option value="AN">
                                      Netherlands Antilles
                                  </option>
                                    <option value="NC">New Caledonia</option>
                                    <option value="NZ">New Zealand</option>
                                    <option value="NI">Nicaragua</option>
                                    <option value="NE">Niger</option>
                                    <option value="NG">Nigeria</option>
                                    <option value="NU">Niue</option>
                                    <option value="NF">Norfolk Island</option>
                                    <option value="MP">
                                      Northern Mariana Islands
                                  </option>
                                    <option value="NO">Norway</option>
                                    <option value="OM">Oman</option>
                                    <option value="PW">Palau</option>
                                    <option value="PA">Panama</option>
                                    <option value="PG">Papua New Guinea</option>
                                    <option value="PY">Paraguay</option>
                                    <option value="PE">Peru</option>
                                    <option value="PH">Philippines</option>
                                    <option value="PN">Pitcairn</option>
                                    <option value="PL">Poland</option>
                                    <option value="PT">Portugal</option>
                                    <option value="PR">Puerto Rico</option>
                                    <option value="QA">Qatar</option>
                                    <option value="RE">Reunion</option>
                                    <option value="RO">Romania</option>
                                    <option value="RU">Russian Federation</option>
                                    <option value="RW">Rwanda</option>
                                    <option value="KN">
                                      Saint Kitts and Nevis
                                  </option>
                                    <option value="LC">Saint LUCIA</option>
                                    <option value="WS">Samoa</option>
                                    <option value="SM">San Marino</option>
                                    <option value="ST">
                                      Sao Tome and Principe
                                  </option>
                                    <option value="SA">Saudi Arabia</option>
                                    <option value="SN">Senegal</option>
                                    <option value="SC">Seychelles</option>
                                    <option value="SL">Sierra Leone</option>
                                    <option value="SG">Singapore</option>
                                    <option value="SK">
                                      Slovakia (Slovak Republic)
                                  </option>
                                    <option value="SI">Slovenia</option>
                                    <option value="SB">Solomon Islands</option>
                                    <option value="SO">Somalia</option>
                                    <option value="ZA">South Africa</option>
                                    <option value="ES">Spain</option>
                                    <option value="LK">Sri Lanka</option>
                                    <option value="SH">St. Helena</option>
                                    <option value="PM">
                                      St. Pierre and Miquelon
                                  </option>
                                    <option value="SD">Sudan</option>
                                    <option value="SR">Suriname</option>
                                    <option value="SZ">Swaziland</option>
                                    <option value="SE">Sweden</option>
                                    <option value="CH">Switzerland</option>
                                    <option value="SY">
                                      Syrian Arab Republic
                                  </option>
                                    <option value="TW">
                                      Taiwan, Province of China
                                  </option>
                                    <option value="TJ">Tajikistan</option>
                                    <option value="TZ">
                                      Tanzania, United Republic of
                                  </option>
                                    <option value="TH">Thailand</option>
                                    <option value="TG">Togo</option>
                                    <option value="TK">Tokelau</option>
                                    <option value="TO">Tonga</option>
                                    <option value="TT">
                                      Trinidad and Tobago
                                  </option>
                                    <option value="TN">Tunisia</option>
                                    <option value="TR">Turkey</option>
                                    <option value="TM">Turkmenistan</option>
                                    <option value="TC">
                                      Turks and Caicos Islands
                                  </option>
                                    <option value="TV">Tuvalu</option>
                                    <option value="UG">Uganda</option>
                                    <option value="UA">Ukraine</option>
                                    <option value="AE">
                                      United Arab Emirates
                                  </option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="UY">Uruguay</option>
                                    <option value="UZ">Uzbekistan</option>
                                    <option value="VU">Vanuatu</option>
                                    <option value="VE">Venezuela</option>
                                    <option value="VN">Viet Nam</option>
                                    <option value="VG">
                                      Virgin Islands (British)
                                  </option>
                                    <option value="VI">
                                      Virgin Islands (U.S.)
                                  </option>
                                    <option value="WF">
                                      Wallis and Futuna Islands
                                  </option>
                                    <option value="EH">Western Sahara</option>
                                    <option value="YE">Yemen</option>
                                    <option value="ZM">Zambia</option>
                                    <option value="ZW">Zimbabwe</option>
                                  </select>

                                </FormGroup>
                              </Col> */}
                              {/* <Col lg={4}>
                                <div className="mb-4 mb-lg-0">
                                  <Label className="form-label" htmlFor="billing-city">City</Label>
                                  <Input type="text" className="form-control" id="billing-city" placeholder="Enter City" />
                                </div>
                              </Col>
                              <Col lg={4}>
                                <div className="mb-4 mb-lg-0">
                                  <Label className="form-label" htmlFor="zip-code">Zip / Postal code</Label>
                                  <Input type="text" className="form-control" id="zip-code" placeholder="Enter Postal code" />
                                </div>
                              </Col> */}
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
                    <Link to="/brand-list" className="btn btn-success"  onClick={() => {
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

export default BrandRevise
