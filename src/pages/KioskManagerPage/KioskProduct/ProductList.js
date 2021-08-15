import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Spinner } from "reactstrap"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from 'axios'
import styled from "styled-components"
import SweetAlert from "react-bootstrap-sweetalert"
import { useHistory } from 'react-router';
import { AvForm } from "availity-reactstrap-validation"
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import deletepic from "../delete.png"
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
  text-align:center;
`
const ItemName = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const ItemNum = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const BrandPk = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const Classification = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const MiddleClass = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const Status = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const DetailImg = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const QrImg = styled.th`
width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
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

const ListImg = styled.img`
height: auto;
width: 40%;
`
const ProductList = () => {

  const history = useHistory()
  const [deleteNum, setDeleteNum] = useState(0)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('')
  const [with_delete, setwith_delete] = useState(false);


  const isAdmin = async () => {
    setLoading(true);
    const { data: response } = await axios.get('/api/auth')
    if (!response.third) {
      alert('회원만 접근 가능합니다.')
      history.push('/login')
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    isAdmin()
  }, [])

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const page = currentPage
      const { data: response } = await axios.get(`/api/product/${page}?keyword=${search}`);
      setPosts(response.data.result);
      setMaxPage(response.data.maxPage);
      setLoading(false);
    }
    fetchPosts()
  }, []);

  const onDelete = async (e) => {
    e.preventDefault()
    const { data: response } = await axios.post('/api/deleteitem', {
      pk: deleteNum
    })
    alert('삭제되었습니다.')
    setwith_delete(false)
    window.location.replace("/product-list")
  };

  function onChangePage(num) {
    async function fetchPosts() {
      setLoading(true);
      const page = num
      setCurrentPage(num)
      const { data: response } = await axios.get(`/api/product/${page}?keyword=${search}`);
      setPosts(response.data.result);
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


 
  const pageNumbers = [];
  for (let i = 1; i <= maxPage; i++) {
    pageNumbers.push(i);
  }


  function setClass(cla) {
    if (cla == 0) {
      return "일반상품"
    }
    else {
      return "오늘의 상품"
    }
  }
  function setBrand(brd) {
    if (brd == 1) {
      return "Fissler"
    }
    else if (brd == 2) {
      return "Silit"
    }
    else if (brd == 3) {
      return "Happycall"
    }
    else if (brd == 4) {
      return "Tefal"
    }
    else {
      return "Emile henry"
    }
  }

  function setStatus(stt) {
    if (stt === 1) {
      return "판매중"
    }
    else {
      return "품절"
    }
  }
  const onSearch = (e) => {
    setSearch(e.target.value)
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid style={{fontFamily:'NanumGothic'}}>
          <Breadcrumbs breadcrumbItem="상품관리" />
          <Row>
            <Col lg="12">

              <React.Fragment>
                <div>
                  <Card>
                    <AvForm className="app-search d-none d-lg-block" onSubmit={() => { onChangePage(1) }}>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                          
                          value={search}
                          onChange={onSearch}
                        />
                        <span className="uil-search"></span>
                      </div>
                    </AvForm>
                  </Card>
                  <div className="table-responsive mb-4">

                    <Table style={{ background: '#EEF1FD' }}>
                      <CheckBox type="checkbox" id="cb1" />
                      <MainImg>메인사진</MainImg>
                      <ItemName>상품명</ItemName>
                      <ItemNum>상품번호</ItemNum>
                      <BrandPk>브랜드</BrandPk>
                      <Classification>분류</Classification>
                      <MiddleClass>중분류</MiddleClass>
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
                      {posts && posts.map(post => (
                        <Table key={post.pk}>
                          <CheckBox type="checkbox" id="cb1" />
                          <MainImg><ListImg src={"http://emart.cafe24app.com" + post.main_image} /></MainImg>
                          <ItemName><ListText>{post.item_name}</ListText></ItemName>
                          <ItemNum><ListText>{post.item_num}</ListText></ItemNum>
                          <BrandPk><ListText>{setBrand(post.brand_pk)}</ListText></BrandPk>
                          <Classification><ListText>{setClass(post.classification)}</ListText></Classification>
                          <MiddleClass><ListText>{post.middle_class}</ListText></MiddleClass>
                          <Status><ListText>{setStatus(post.status)}</ListText></Status>
                          <DetailImg><ListImg src={"http://emart.cafe24app.com" + post.detail_image} /></DetailImg>
                          <QrImg><ListImg src={"http://emart.cafe24app.com" + post.qr_image} /></QrImg>
                          <Modify><Link to={{
                            pathname: '/product-revise',
                            state: {
                              pk: post.pk, name: post.item_name, num: post.item_num, brand: setBrand(post.brand_pk),
                              class: setClass(post.classification), middleclass: post.middle_class, status: setStatus(post.status) 
                              , mainImage: post.main_image, detailImage: post.detail_image, qrImage: post.qr_image
                            }


                          }}><i className="uil uil-pen font-size-18"></i></Link></Modify>
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
                        <Link to="/add-product" className="btn btn-primary">+ 추가하기</Link>
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

export default ProductList
