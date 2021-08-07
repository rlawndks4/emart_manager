import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Spinner } from "reactstrap"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from 'axios'
import styled from "styled-components"
import SweetAlert from "react-bootstrap-sweetalert"
import {useHistory} from 'react-router';

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
const BrandName = styled.th`
  width: 15%;
  color: black;
  padding: 14px 14px 14px;
  
`
const Class1 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  
`
const Class2 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  
`
const Class3 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  
`
const Class4 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  
`
const Class5 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  
`
const Date = styled.th`
  width: 15%;
  color: black;
  padding: 14px 14px 14px;
  
`
const Modify = styled.th`
width: 7.5%;
  color: black;
  padding: 14px 14px 14px;
`
const Delete = styled.th`
width: 7.5%;
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

const BrandList = () => {

  const history = useHistory()
  const [deleteNum, setDeleteNum] = useState(0)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [with_delete, setwith_delete] = useState(false);
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

  useEffect(() => {
    async function fetchPosts() {
    setLoading(true);
    const page = currentPage
    const{ data: response } = await axios.get(`/api/brand/${page}`);
   
    setPosts(response.data.result);
    setMaxPage(response.data.maxPage);
    setLoading(false);
  }
  fetchPosts()
},[]);


  function onChangePage(num) {
    async function fetchPosts() {
    setLoading(true);
    const page = num
    const{ data: response } = await axios.get(`/api/brand/${page}`);
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
          <Breadcrumbs breadcrumbItem="브랜드관리" />
          <Row>
            <Col lg="12">

              <React.Fragment>
                <div>
                  <Card>
                    <form className="app-search d-none d-lg-block">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                        />
                        <span className="uil-search"></span>
                      </div>
                    </form>
                  </Card>
                  <div className="table-responsive mb-4">

                    <Table>
                      <CheckBox type="checkbox" id="cb1" />
                      <BrandName>브랜드</BrandName>
                      <Class1>중분류1</Class1>
                      <Class2>중분류2</Class2>
                      <Class3>중분류3</Class3>
                      <Class4>중분류4</Class4>
              
                      <Date>생성시간</Date>
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
                          <BrandName><ListText>{post.brand_name}</ListText></BrandName>
                          <Class1><ListText>{post.middle_class_1}</ListText></Class1>
                          <Class2><ListText>{post.middle_class_2}</ListText></Class2>
                          <Class3><ListText>{post.middle_class_3}</ListText></Class3>
                          <Class4><ListText>{post.middle_class_4}</ListText></Class4>
                          <Date><ListText>{post.create_time}</ListText></Date>
                          <Modify><Link to="/brand-revise" className="px-3 text-primary"><i className="uil uil-pen font-size-18"></i></Link></Modify>
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
                        <Link to="#" className="btn btn-success" onClick={() => {
                          setwith_delete(false)
                        }}> <i className="uil uil-file-alt me-1"></i> 확인 </Link>
                      </SweetAlert>

                    ) : null}

                    <Row className="row mb-4">
                      <div className="col text-end">
                        <Link to="/add-brand" className="btn btn-primary">+ 추가하기</Link>
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



export default BrandList
