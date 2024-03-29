import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Spinner, Button } from "reactstrap"
import { Link, useHistory } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import axios from 'axios'
import styled from "styled-components"
import SweetAlert from "react-bootstrap-sweetalert"
import { AvForm } from "availity-reactstrap-validation";
import deletepic from "../delete.png"
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import ServerLink from '../data/ServerLink'
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
const AdName = styled.th`
  width: 15%;
  color: black;
  padding: 14px 14px 14px;
  text-align: center;
`
const AdImg = styled.th`
width: 20%;
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


const ListImg = styled.img`
height: auto;
width: 50%;
`

const AdList = () => {
  const history = useHistory()
  const [deleteNum, setDeleteNum] = useState(0)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('')
  const [maxPage, setMaxPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);


  const [with_delete, setwith_delete] = useState(false);

  const isAdmin = async () => {

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
      const { data: response } = await axios.get(`/api/ad/${page}?keyword=${search}`);
      console.log(response)
      setPosts(response.data.result);
      setMaxPage(response.data.maxPage);
      setLoading(false);
    }
    fetchPosts()
  }, []);

  const onSearch = (e) => {
    setSearch(e.target.value)
  }
  const onDelete = async (e) => {
    e.preventDefault()
    const { data: response } = await axios.post('/api/deletead', {
      pk: deleteNum
    })
    alert('삭제되었습니다.')
    setwith_delete(false)
    window.location.replace("/ad-list")
  };



  function onChangePage(num) {
    async function fetchPosts() {
      setLoading(true);
      const page = num
      setCurrentPage(num)
      const { data: response } = await axios.get(`/api/ad/${page}?keyword=${search}`);
      setPosts(response.data.result);
      setMaxPage(response.data.maxPage);
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
  function onCreateTime(num) {
    num = num.split('.')[0]
    num = num.replace('T', ' ')
    return num
  }
  const pageNumbers = [];
  for (let i = 1; i <= maxPage; i++) {
    pageNumbers.push(i);
  }
  async function submitOnOff(onoff_num,ad_pk,manager_pk){
    let obj = {
      pk:ad_pk,
      managerPk:manager_pk
    }

    if(onoff_num==0){
      obj.onOffCount = 0
    }
    else if(onoff_num==1){
      obj.onOffCount = 1
    }
    const {data:response} = await axios.post(`/api/adonoff`,obj)
    console.log(response)
    if(response.result<0){
      alert(response.message)
    }
    else{
      alert(response.message)
      window.location.reload()
    }
  }
  return (
    <React.Fragment>

      <div className="page-content" style={{color:'#596275'}}>
        <Container fluid style={{fontFamily:'NanumGothic'}}>

          <Breadcrumbs breadcrumbItem="광고관리" />
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
                      <AdName>광고명</AdName>
                      <AdImg>광고사진</AdImg>
                      <Date>생성시간</Date>
                      <Modify>온오프</Modify>
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
                          <AdName><ListText>{post.ad_name}</ListText></AdName>
                          <AdImg><ListImg src={ServerLink + post.ad_image} /></AdImg>
                          <Date><ListText>{onCreateTime(post.create_time)}</ListText></Date>
                          <Modify>{post.onoff==0?
                          <Button onClick={()=>{
                            if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                              submitOnOff(1,post.pk,post.manager_pk)
                            }
                          }}>{'off'}</Button>
                        :
                        <Button style={{background:'#2ecc71'}} onClick={()=>{
                          if (window.confirm("상태를 off로 변경하시겠습니까?")) {
                            submitOnOff(0,post.pk,post.manager_pk)
                          }
                        }}>{'on'}</Button>}</Modify>
                          <Modify><Link to={{
                            pathname: '/ad-revise',
                            state: { pk: post.pk, name: post.ad_name, img: post.ad_image }
                          }} className="px-3 text-primary" ><i className="uil uil-pen font-size-18"></i></Link></Modify>
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
                        <Link to="/add-ad" className="btn btn-primary">+ 추가하기</Link>
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

//페이지 선택시 텍스트 색깔 #ffffff 배경 #5B73E8
//선택 안할시 텍스트 색깔 #74788D 배경 #ffffff

export default AdList
