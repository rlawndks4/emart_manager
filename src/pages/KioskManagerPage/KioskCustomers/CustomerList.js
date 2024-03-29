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
  th{
    color: #596275;
  }
`
const ID = styled.th`
  width: 15%;
  color: black;
  padding: 14px 14px 14px;
  text-align: center;
`
const PW = styled.th`
  width: 20%;
  color: black;
  padding: 14px 14px 14px;
  text-align: center;
`
const UserLevel = styled.th`
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

const CustomerList = (props) => {


  const history = useHistory()
  const [deleteNum, setDeleteNum] = useState(0)

  const [maxPage, setMaxPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [with_delete, setwith_delete] = useState(false);
  const [search, setSearch] = useState('')
  const [allUser, setAllUser] = useState([])
  const isAdmin = async () => {
    setLoading(true);
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
        setLoading(false)
      }

    }
  }
  useEffect(() => {
    isAdmin()
  }, [])
  function makeTopDown(list1, all_user1){
    let list = list1;
    let all_user = all_user1
    for(var i =0;i<list.length;i++){
      if(list[i].user_level==50){
        list[i].master_id = '';
        list[i].senior_id = '';
        list[i].user_id = '';
      } else if(list[i].user_level==45){
        list[i].master_id = list[i].id;
        list[i].senior_id = '';
        list[i].user_id = '';
      } else if(list[i].user_level==40) {
        for(var j=0;j<all_user.length;j++){
          if(list[i].senior_user_pk==all_user[j].pk&&all_user[j].user_level==45){
            list[i].master_id = all_user[j].id;
            break;
          }
        }
        if(j==all_user.length){
          list[i].master_id = '';
        }
        list[i].senior_id = list[i].id;
        list[i].user_id = '';
      } else if(list[i].user_level==0) {
        
        for(var j=0;j<all_user.length;j++){
          if(list[i].senior_user_pk==all_user[j].pk&&all_user[j].user_level==40){
            list[i].senior_id = all_user[j].id;
            list[i].senior_ppk = all_user[j].senior_user_pk
            break;
          }
        }
        if(j==all_user.length){
          list[i].senior_id = '';
        }
        if(list[i].senior_id){
          for(var j = 0;j<all_user.length;j++){
            if(list[i].senior_ppk==all_user[j].pk&&all_user[j].user_level==45){
              list[i].master_id = all_user[j].id
              break;
            }
          }
          if(j==all_user.length){
          list[i].master_id = '';
          }
        } else {
          list[i].master_id = '';
        }
        list[i].user_id = list[i].id;
      }
    }
    return list;
  }
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const page = currentPage
      const { data: response } = await axios.get(`/api/user?page=${page}&keyword=${search}`);

      const {data: response2} = await axios.get(`/api/user?keyword=${search}`)
      console.log(response2)
      setAllUser(response2.data.result)
      let list = response.data.result;
      let all_user = response2.data.result;
      let result = await makeTopDown(list,all_user);
      setPosts(result)
      setPosts(response.data.result);
      setMaxPage(response.data.maxPage);

      setLoading(false);
    }
    fetchPosts()
  }, []);

  const onDelete = async (e) => {
    e.preventDefault()
    const { data: response } = await axios.post('/api/deleteuser', {
      pk: deleteNum
    })
    if(response.result<0){
      alert(response.message)
    }
    else{
      alert(response.message)
    }
    setwith_delete(false)
    window.location.replace("/customer-list")
  };

  function onChangePage(num) {
    async function fetchPosts() {
      setLoading(true);
      const page = num
      setCurrentPage(num)
      const { data: response } = await axios.get(`/api/user?page=${page}&keyword=${search}`);

      let result = await makeTopDown(response.data.result,allUser);
      setPosts(result);
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
  function onUserLevel(num){
    if(num==0){
      return '일반유저'
    }
    else if(num==40){
      return '관리자'
    }
    else if(num==45){
      return '최고 관리자'
    }
    else{
      return 'dev'
    }
  }
  const pageNumbers = [];
  for (let i = 1; i <= maxPage; i++) {
    pageNumbers.push(i);
  }
  const onSearch = (e) => {
    setSearch(e.target.value)
  }
  return (
    <React.Fragment>
      <div className="page-content" style={{color:'#596275'}}>
        <Container fluid style={{fontFamily:'NanumGothic'}}>
          <Breadcrumbs breadcrumbItem="회원관리" />
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
                      <ID>최고관리자</ID>
                      <ID>관리자</ID>
                      <ID>일반유저</ID>
                      <ID>ID</ID>
                      <PW>PW</PW>
                      <UserLevel>User Level</UserLevel>
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
                          <ID>{post.master_id}</ID>
                          <ID>{post.senior_id}</ID>
                          <ID>{post.user_id}</ID>
                          <ID>
                            {
                              post.user_level == 50 ?
                              <ListText>********</ListText>
                              :
                              <>
                              <ListText>{post.id}</ListText>
                              </>
                            }
                          </ID>
                          <PW>
                            <ListText>********</ListText>
                          </PW>
                          <UserLevel><ListText>{onUserLevel(post.user_level)}</ListText></UserLevel>
                          <Date><ListText>
                            {onCreateTime(post.create_time)}
                          </ListText></Date>
                          <Modify>
                            {
                              post.user_level == 50 ?
                              <Link className="px-3 text-primary" ><i className="uil uil-pen font-size-18"></i></Link>
                              :
                              <>
                            <Link to={{
                              pathname: `/customer-revise/${post.pk}`,
                              state: { pk: post.pk, id: post.id }
                            }} className="px-3 text-primary" >
                              <i className="uil uil-pen font-size-18"></i>
                            </Link>
                            </>
                            }
                          </Modify>
                          <Delete>
                            {post.user_level == 50 ?
                            <Link className="px-3 text-danger"><i className="uil uil-trash-alt font-size-18"></i></Link>
                            :
                            <>
                             <Link to="#" className="px-3 text-danger" onClick={() => {
                            setDeleteNum(post.pk)
                            setwith_delete(true)
                             }}><i className="uil uil-trash-alt font-size-18"></i></Link>

                            </>
                            }
                           
                          </Delete>
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
                        <Link to="/add-customer" className="btn btn-primary">+ 추가하기</Link>
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


export default CustomerList
