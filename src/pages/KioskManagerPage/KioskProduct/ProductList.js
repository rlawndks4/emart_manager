import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Label, Input, Card, Spinner } from "reactstrap"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from 'axios'
import styled from "styled-components"
import SweetAlert from "react-bootstrap-sweetalert"

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
const MainImg = styled.th`
  width: 20%;
  color: black;
  padding: 14px 14px 14px;
  
`
const ItemName = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const ItemNum = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const BrandPk = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const Classification = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const Status = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const DetailImg = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
`
const QrImg = styled.th`
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

const ProductList = () => {


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [with_delete, setwith_delete] = useState(false);
  const [pagecolor, setPagecolor] = useState("white");

  function deleteKiosk(id) {
    
    
    const { data: response } = axios.post('/api/deletekiosk', {
      
    })
   
  }
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const response = await axios.get('/api/product');
      setPosts(response.data);
      setLoading(false);
    }
    fetchPosts()
  }, []);

  console.log(posts);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  function currentPosts(tmp) {
    let currentPosts = 0;
    currentPosts = tmp.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItem="상품관리" />
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
                      <MainImg>메인사진</MainImg>
                      <ItemName>상품명</ItemName>
                      <ItemNum>상품번호</ItemNum>
                      <BrandPk>브랜드</BrandPk>
                      <Classification>분류</Classification>
                      <Status>상태</Status>
                      <DetailImg>상세사진</DetailImg>
                      <QrImg>QR</QrImg>
                      <Modify>수정</Modify>
                      <Delete>삭제</Delete>
                    </Table>
                    <>
                      {
                        loading &&
                        <LoadingBox><Spinner className="m-1" color="primary" /></LoadingBox>
                      }
                      {currentPosts(posts).map(post => (
                        <Table key={post.pk}>
                          <CheckBox type="checkbox" id="cb1" />
                          <MainImg><ListText>{post.main_image}</ListText></MainImg>
                          <ItemName><ListText>{post.item_name}</ListText></ItemName>
                          <ItemNum><ListText>{post.item_num}</ListText></ItemNum>
                          <BrandPk><ListText>{post.brand_pk}</ListText></BrandPk>
                          <Classification><ListText>{post.classification}</ListText></Classification>
                          <Status><ListText>{post.status}</ListText></Status>
                          <DetailImg><ListText>{post.detail_image}</ListText></DetailImg>
                          <QrImg><ListText>{post.qr_image}</ListText></QrImg>
                          <Modify><Link to="/product-revise" className="px-3 text-primary"><i className="uil uil-pen font-size-18"></i></Link></Modify>
                          <Delete><Link to="#" className="px-3 text-danger" onClick={() => {
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
                        <Link to="/add-product" className="btn btn-primary">+ 추가하기</Link>
                      </div>
                    </Row>

                    <Row className="row mb-4">

                      <PageBox>
                        <PageUl className="pagination">
                          <PageLi onClick={() => setCurrentPage(1)}>처음</PageLi>
                          {pageNumbers.map(number => (
                            <PageLi key={number} className="page-item">
                              <PageSpan onClick={() => setCurrentPage(number)}>
                                {number}
                              </PageSpan>
                            </PageLi>
                          ))}
                          <PageLi onClick={() => setCurrentPage(posts.length / 10)}>마지막</PageLi>
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



export default ProductList
