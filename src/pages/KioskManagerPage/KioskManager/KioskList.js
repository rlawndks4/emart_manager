import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Spinner } from "reactstrap"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from 'axios'
import styled from "styled-components"
import SweetAlert from "react-bootstrap-sweetalert"
import { useHistory } from 'react-router'
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
`
const KioskNumber = styled.th`
  width: 20%;
  color: black;
  padding: 14px 14px 14px;
  
`
const UniqueNumber = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const Store = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const Date = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const Status = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
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
const PageUl = styled.ul`
  float:left;
  list-style: none;
  text-align:center;
  border-radius:3px;
  color:black;
  padding:1px;
  
  background-color: white;
`;

const PageLi = styled.li`
  display:inline-block;
  font-size:17px;
  font-weight:600;
  padding:5px;
  
  
  &:hover{
    cursor:pointer;
    color:white;
    background-color:blue;
  }
  &:focus::after{
    color:#ffffff;
    background-color:#000000;
  }
`;

const PageSpan = styled.span`
  &:hover::after,
  &:focus::after{
    border-radius:100%;
    color:black;
    background-color:black;
  }
`;

const KioskList = () => {

  const history = useHistory()
  const [deleteNum, setDeleteNum] = useState(0)
  const [posts, setPosts] = useState([]);
  const [maxPage, setMaxPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [with_delete, setwith_delete] = useState(false);
  const [kioskNum, setkioskNum] = useState('')
  const [with_good, setwith_good] = useState(false);
  const isAdmin = async () => {
    setLoading(true);
    const { data: response } = await axios.get('/api/auth')
    if(!response.third){
      alert('회원만 접근 가능합니다.')
      history.push('/login')
    }
    else{
      
        if(!response.first){
          alert('개발자만 접근 가능합니다.')
          history.push('/product-list')
        }else{
          setLoading(false)
        }
      
    } 
  }
  useEffect(() => {
    isAdmin()
  }, [])
 
  useEffect(() => {
    async function fetchPosts() {
    setLoading(true);
    const page = currentPage
    const{ data: response } = await axios.get(`/api/kiosk/${page}`);

    setPosts(response.data.result);
    setMaxPage(response.data.maxPage);
    setLoading(false);
  }
  fetchPosts()
},[]);

  const onDelete = async (e) => {
    e.preventDefault()
    const { data: response } = await axios.post('/api/deletekiosk', {
         pk: deleteNum
        })
        alert('삭제되었습니다.')
        setwith_delete(false)
        window.location.replace("/kiosk-list")
  };
  function onChangePage(num) {
    async function fetchPosts() {
    setLoading(true);
    const page = num
    setCurrentPage(num)
    const{ data: response } = await axios.get(`/api/kiosk/${page}`);
    setPosts(response.data.result);
    setLoading(false);
  }
  fetchPosts()
  };
  
   const pageNumbers = [];
   for (let i = 1; i <= maxPage; i++) {
     pageNumbers.push(i);
   }
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItem="키오스크관리" />
          <Row>
            <Col lg="12">

              <React.Fragment>
                <div>
                  <Card>
                    <Row>
                      <Col lg={2}>
                        <br />
                        <h5 className="font-size-14 mb-4">  조회결과 순서</h5>
                      </Col>
                      <Col lg={1}>
                        <br />
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios1"
                          value="option1"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios1"
                        >
                          미지급
                        </label>
                      </Col>
                      <Col lg={1}>
                        <br />
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios2"
                          value="option2"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios2"
                        >
                          지급
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={2}>
                        <br />
                        <h5 className="font-size-14 mb-4">조회 기간</h5>
                      </Col>
                      <Col lg={2}>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="date"
                            defaultValue="2021-07-01"
                            id="example-date-input"
                          />
                        </div>
                      </Col>
                      <Col lg={2}>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="date"
                            defaultValue="2021-07-31"
                            id="example-date-input"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                  <div className="table-responsive mb-4">

                    <Table>
                      <CheckBox type="checkbox" id="cb1" />
                      <KioskNumber>키오스크 NO.</KioskNumber>
                      <UniqueNumber>고유번호</UniqueNumber>
                      <Store>지점</Store>
                      <Date>생성시간</Date>
                      <Status>상태</Status>
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
                          <Date><ListText>{post.create_time}</ListText></Date>
                          <Status><ListText>{post.status}</ListText></Status>
                          <Modify><Link to={{
                            pathname: '/kiosk-revise',
                            state: {pk: post.pk, num: post.kiosk_num, unique: post.unique_code
                            , store: post.store_name}
                            }}className="px-3 text-primary"><i className="uil uil-pen font-size-18"></i></Link></Modify>
                          <Delete><Link to="#" className="px-3 text-danger" onClick={() => {
                            setDeleteNum(post.pk)
                            setwith_delete(true)
                          }}><i className="uil uil-trash-alt font-size-18"></i></Link></Delete>
                        </Table>
                      ))}

                    </>
                    {with_delete ? (
                      <SweetAlert
                        title="정말 삭제하시겠습니까?"
                        warning
                        showConfirm={false}
                        style={{
                          paddingBottom: '42px'
                        }}
                      >
                        <br />
                        <Link to="#" className="btn btn-danger" onClick={() => {
                          setwith_delete(false)
                        }}> <i className="uil uil-times me-1" ></i> 취소 </Link>{" "}
                        <Link to="#" className="btn btn-success" onClick={onDelete}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>

                    ) : null}
                    {with_good ? (
                      <SweetAlert
                        title="삭제되었습니다."
                        warning
                        showConfirm={false}
                        style={{
                          paddingBottom: '42px'
                        }}
                      >
                        <br />

                        <Link to="/kiosk-list" className="btn btn-primary" onClick={()=>{setwith_good(false)}}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>
                    ) : null}
                    <Row className="row mb-4">
                      <div className="col text-end">
                        <Link to="/add-kiosk" className="btn btn-primary">+ 추가하기</Link>
                      </div>
                    </Row>

                    <Row className="row mb-4">

                      <PageBox>
                        <PageUl className="pagination">
                        <PageLi onClick={()=>{onChangePage(1)}}>처음</PageLi>
                          {pageNumbers.map(number => (
                            <PageLi key={number} className="page-item">
                              <PageSpan onClick={() => {onChangePage(number)}}>
                                {number}
                              </PageSpan>
                            </PageLi>
                          ))}
                          <PageLi onClick={()=>{onChangePage(maxPage)}}>마지막</PageLi>
                        </PageUl>
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
