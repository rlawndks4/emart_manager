import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Spinner } from "reactstrap"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from 'axios'
import styled from "styled-components"
import SweetAlert from "react-bootstrap-sweetalert"
import { useHistory } from 'react-router'
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import XLSX from "xlsx";
import deletepic from "../delete.png"
import moment from 'moment';
import 'moment/locale/ko';
const CheckBox = styled.input`
margin: 14px 14px 14px;
`
const LoadingBox = styled.div`
width: 100%;
align-items: center;
display: flex;
flex-direction: column;
`
const Table = styled.table`
  width: 100%;
  background:#ffffff;
  margin-bottom: 14px;
  align-items: center;
  display:flex;
  justify-content: space-between;
  box-shadow: 1px 1px 1px #00000029;
  word-break:break-all;
  th{
    color: #596275;
  }
`
const KioskNumber = styled.th`
  width: 15%;
  color: black;
  padding: 14px 14px 14px;
  text-align: center;
`
const UniqueNumber = styled.th`
width: 15%;
  color: black;
  padding: 14px 14px 14px;
  text-align: center;
`
const Store = styled.th`
width: 15%;
  color: black;
  padding: 14px 14px 14px;
  text-align: center;
`
const Date = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align: center;
`
const Status = styled.th`
width: 15%;
  color: black;
  padding: 14px 14px 14px;
  text-align: center;
`
const Modify = styled.th`
width: 10%;
  color: black;
  padding: 14px 14px 14px;
`
const Delete = styled.th`
width: 10%;
  color: black;
  padding: 14px 14px 14px;
`
const ListText = styled.p`
font-weight: 400;
margin:0;
`
const PageBox = styled.div`
width: 100%;
align-items: center;
display: flex;
flex-direction: column;
`
const Strong = styled.strong`
font-size:10px;
@media screen and (max-width:1250px) {
  font-size:6px;
}
`
const DateContainer = styled.div`
width: 100%;
align-items: center;
display:flex;
justify-content: space-between;
`
const MenuTitle = styled.div`
width:15%;
padding-left:20px;

`
const UnPaidContent = styled.div`
width:10%;

`
const PaidContent = styled.div`
width:75%;

`
const DateContent = styled.div`
width: 15%;

`
const ButtonContent = styled.div`
width:10%;
text-align:center;
padding-left:16px;
`
const ExtractContent = styled.div`
width:45%;
`

const KioskList = () => {

  const history = useHistory()
  
  const date1 = moment().subtract(1,'year').format('YYYY-MM-DD')
  const date2 = moment().add(1,'days').format('YYYY-MM-DD')
  
  const [deleteNum, setDeleteNum] = useState(0)
  const [posts, setPosts] = useState([]);
  const [maxPage, setMaxPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [with_delete, setwith_delete] = useState(false);
  const [kioskNum, setkioskNum] = useState('')
  const [with_good, setwith_good] = useState(false);

  const [revisePk, setRevisePk] = useState(0)
  const [firstDate, setFirstDate] = useState(date1)
  const [secondDate, setSecondDate] = useState(date2)
  const [exelPost, setExelPost] = useState([])
  const [paid, setPaid] = useState(0)
  const [unPaid, setUnPaid] = useState(0)
  const [myPk, setMyPk] = useState(0)
  const headers = [
    { label: "Kiosk Number", key: "kiosk_num" },
    { label: "Store Name", key: "store_name" },
    { label: "Unique Code", key: "unoque_code" },
    { label: "Status", key: "status" }
  ]
  const isAdmin = async () => {
    setLoading(true);
    const { data: response } = await axios.get('/api/auth')
    if (!response.third) {

      alert('회원만 접근 가능합니다.')
      history.push('/login')
    }
    else{
      setMyPk(response.pk)
      const page = currentPage
      const { data: response2 } = await axios.get(`/api/kiosk?page=${page}&firstDate=${firstDate}&lastDate=${secondDate}&pk=${response.pk}`);
      setPosts(response2.data.result);
      setMaxPage(response2.data.maxPage);
      console.log(response2)
      setLoading(false);
    }
    
  }
  useEffect(() => {
    isAdmin()
  }, [])

  
 
  const onDelete = async (e) => {
    e.preventDefault()
    const { data: res } = await axios.get('/api/auth')
    if (!res.second) {
      alert('권한이 없습니다.')
      setwith_delete(false)
    }
    else {
      const { data: response } = await axios.post('/api/deletekiosk', {
        pk: deleteNum
      })
      alert('삭제되었습니다.')
      setwith_delete(false)
      window.location.replace("/kiosk-list")
    }
  };

  function onChangePage(num) {
    async function fetchPosts() {
      setLoading(true);
      const page = num
      setCurrentPage(num)
      if(paid==0&&unPaid==0){
        const { data: res } = await axios.get(`/api/kiosk?firstDate=${firstDate}&lastDate=${secondDate}&pk=${myPk}`);
        setExelPost(res.data.result);
        const { data: response } = await axios.get(`/api/kiosk?page=${page}&firstDate=${firstDate}&lastDate=${secondDate}&pk=${myPk}`);
        setPosts(response.data.result);
        setMaxPage(response.data.maxPage);
      }
      else{
        const { data: res } = await axios.get(`/api/kiosk?status=${paid}&firstDate=${firstDate}&lastDate=${secondDate}&pk=${myPk}`);
        setExelPost(res.data.result);
        const { data: response } = await axios.get(`/api/kiosk?page=${page}&status=${paid}&firstDate=${firstDate}&lastDate=${secondDate}&pk=${myPk}`);
        setPosts(response.data.result);
        setMaxPage(response.data.maxPage);
      }
      setLoading(false);
    }
    fetchPosts()
  };
 
  function onChangePageColor(num) {
    if (currentPage == num) {
      return { background: '#5B73E8', color: '#ffffff' }
    }
    else {
      return { background: '#ffffff', color: '#74788D' }
    }
  }
  function onStatus(num) {
    if (num == 1) {
      return true;
    }
    else {
      return false;
    }
  }
  async function handleGiveKiosk(num) {
    const { data: res } = await axios.get('/api/auth')
    if (!res.second) {
      alert('권한이 없습니다.')
    }
    else {
      axios.post('/api/kioskstatus', {
        pk: num,
        status: 0
      }).then(() => {
        alert('지급을 완료 하였습니다.')
        window.location.replace("/kiosk-list")
      })
    }

  }
  async function handleCancelKiosk(num) {
    const { data: res } = await axios.get('/api/auth')
    if (!res.second) {
      alert('권한이 없습니다.')
    }
    else {
      axios.post('/api/kioskstatus', {
        pk: num,
        status: 1
      }).then(() => {
        alert('지급을 취소 하였습니다.')
        window.location.replace("/kiosk-list")
      })
    }
  }
  function getExcel() {
    const dataWS = XLSX.utils.json_to_sheet(exelPost);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, dataWS, "nameData");
    XLSX.writeFile(wb, "emart_kiosk.xlsx");
  }
  function onCreateTime(num) {
    num = num.split('.')[0]
    num = num.replace('T', ' ')
    return num
  }
  const pageNumbers = [];
  for (let i = 1; i <= maxPage; i++) {
    pageNumbers.push(i);
  }
  const onChangePaid = (e) => {
    setPaid(1)
    setUnPaid(0)
  }
  const onChangeUnpaid = (e) => {
    setUnPaid(1)
    setPaid(0)
  }

  const onChangeFirst = (e) => {
    setFirstDate(e.target.value)
  }
  const onChangeSecond = (e) => {
    setSecondDate(e.target.value)
  }

  return (
    <React.Fragment>
      <div className="page-content" style={{color:'#596275'}}>
        <Container fluid style={{fontFamily:'NanumGothic'}}>
          <Breadcrumbs breadcrumbItem="키오스크관리" />
          <Row>
            <Col lg="12">

              <React.Fragment>
                <div>
                  <Card>
                    <Row>
                     <DateContainer>
                      <MenuTitle>
                      <br />
                      <h5 className="font-size-14 mb-4"><strong>조회결과 순서</strong></h5>
                      </MenuTitle>
                     <UnPaidContent>
                     <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios1"
                          value="option1"
                          
                          onChange={onChangeUnpaid}
                        />
                        {" "}
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios1"
                        >
                          미지급
                        </label>
                     </UnPaidContent>
                     <PaidContent>
                     <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios2"
                          value="option1"
                          onChange={onChangePaid}
                        />
                        {" "}
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios2"
                        >
                          지급
                        </label>
                     </PaidContent>
                     </DateContainer>
                    </Row>
                    <Row>
                    <DateContainer>
                        <MenuTitle className="mb-3">
                          <br />
                          
                          <h5 className="font-size-14 mb-4"><strong>조회 기간</strong></h5>
                        </MenuTitle>
                     
                       <DateContent>
                         <div style={{width:'95%'}}>
                       <input
                            className="form-control"
                            type="date"
                            defaultValue={date1}
                            id="example-date-input"
                            onChange={onChangeFirst}
                          />
                         </div>
                       </DateContent>
                       <div>
                         {"-"}
                       </div>
                       <DateContent>
                       <div style={{width:'97%' ,paddingLeft:'8px'}}>
                       <input
                            className="form-control"
                            type="date"
                            defaultValue={date2}
                            id="example-date-input"
                            onChange={onChangeSecond}
                          />
                          </div>
                      </DateContent>
                        <ButtonContent>
                        <Link to="#" className="btn btn-primary" onClick={() => {
                          onChangePage(1)
                        }}>조회하기</Link>
                        </ButtonContent>
                        <ExtractContent>
                        <Link to="#" className="btn btn-primary" style={{ marginLeft: '10px' }} onClick={
                          getExcel
                        }>
                          추출하기
                        </Link>
                        </ExtractContent>
                        </DateContainer>
                        </Row>
                  </Card>

                  <div className="table-responsive mb-4">

                    <Table style={{ background: '#EEF1FD' }}>
                      <CheckBox type="checkbox" id="cb1" />
                      <KioskNumber>키오스크 NO.</KioskNumber>
                      <UniqueNumber>고유번호</UniqueNumber>
                      <Store>지점</Store>
                      <Date>생성시간</Date>
                      <Status>배경색</Status>
                      <Status>중분류색</Status>
                      <Status>글자색</Status>
                      <Status>상태</Status>
                      <Status></Status>
                      <Modify>수정</Modify>
                      <Delete>삭제</Delete>
                    </Table>
                    <>
                      {
                        loading &&
                        <LoadingBox><Spinner className="m-1" color="primary" /></LoadingBox>
                      }
                      {posts && posts.map(post => (
                        <Table key={post.pk}>
                          <CheckBox type="checkbox" id="cb1" />
                          <KioskNumber><ListText>{post.kiosk_num}</ListText></KioskNumber>
                          <UniqueNumber><ListText>{post.unique_code}</ListText></UniqueNumber>
                          <Store><ListText>{post.store_name}</ListText></Store>
                          <Date><ListText>{onCreateTime(post.create_time)}</ListText></Date>
                          <Status>
                            <ListText style={{color:`${post.background_color}`}}>{post.background_color}</ListText>
                          </Status>
                          <Status>
                            <ListText style={{color:`${post.middle_class_color}`}}>{post.middle_class_color}</ListText>
                          </Status>
                          <Status>
                            <ListText style={{color:`${post.font_color}`}}>{post.font_color}</ListText>
                          </Status>
                          <Status>
                            {
                              onStatus(post.status) ?
                                <ListText>완료</ListText>
                                :
                                <>
                                  <ListText>미지급</ListText>
                                </>
                            }
                          </Status>
                          
                          <Status style={{ padding: 'none important!', width: '20% important!' }}>
                            {
                              onStatus(post.status) ?
                              
                                    <Link to="#" className="btn btn-primary" onClick={() => {
                                      handleCancelKiosk(post.pk)
                                    }} style={{padding:'7.5px 21px 7.5px'}}><strong>취소</strong></Link>
                           
                                :
                                <>
                                  <Link to="#" className="btn btn-primary" onClick={() => {
                                    handleGiveKiosk(post.pk)
                                  }}><strong>지급하기</strong></Link>
                                </>
                            }
                          </Status>

                          <Modify><Link to={{
                            pathname: `/kiosk-revise/${post.pk}`
                            
                          }} className="px-3 text-primary"><i className="uil uil-pen font-size-18"></i></Link></Modify>
                          <Delete><Link to="#" className="px-3 text-danger" onClick={() => {
                            setDeleteNum(post.pk)
                            setwith_delete(true)
                          }}><i className="uil uil-trash-alt font-size-18"></i></Link></Delete>
                        </Table>
                      ))}

                    </>

                    {with_delete ? (
                      <SweetAlert
                        
                        showConfirm={false}
                        style={{
                          paddingBottom: '42px'
                        }}
                      >
                        <div style={{ paddingBottom: '52px', paddingTop: '30px' }}>
                            <img src={deletepic} />
                          </div>

                          <h3><strong>정말 삭제 하시겠습니까?</strong></h3>
                          <br />
                        <Link to="#" className="btn btn-danger" onClick={() => {
                          setwith_delete(false)
                        }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                        <Link to="#" className="btn btn-success" onClick={onDelete}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>
                    ) : null}
                    
                    <Row className="row mb-4">
                      <div className="col text-end">
                        <Link to="/add-kiosk" className="btn btn-primary">+ 추가하기</Link>
                      </div>
                    </Row>

                    <Row className="row mb-4">

                      <PageBox>
                        <Pagination aria-label="Page navigation example">
                          <PaginationItem>
                            <PaginationLink onClick={() => { onChangePage(1) }}>처음</PaginationLink>
                          </PaginationItem>
                          {pageNumbers.map(number => (
                            <PaginationItem key={number} >
                              <PaginationLink onClick={() => { onChangePage(number) }} style={onChangePageColor(number)}>
                                {number}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationLink onClick={() => { onChangePage(maxPage) }}>마지막</PaginationLink>
                          </PaginationItem>
                        </Pagination>
                      </PageBox>
                    </Row>
                  </div>
                </div>
              </React.Fragment>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}



export default KioskList
