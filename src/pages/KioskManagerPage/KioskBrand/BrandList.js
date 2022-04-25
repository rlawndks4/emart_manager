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
import { Button } from "reactstrap";
import ServerLink from "../data/ServerLink";
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
const BrandName = styled.th`
  width: 15%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const Class1 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const Class2 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const Class3 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const Class4 = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const Status = styled.th`
  width: 11%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
`
const Date = styled.th`
  width: 15%;
  color: black;
  padding: 14px 14px 14px;
  text-align:center;
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
const ListImg = styled.img`
height: auto;
width: 100%;
`
const BrandList = () => {

  const history = useHistory()
  const [deleteNum, setDeleteNum] = useState(0)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [with_delete, setwith_delete] = useState(false);
  const [search, setSearch] = useState('')
  const [myPk, setMyPk] = useState(0)
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
        setMyPk(response.pk)
        const page = currentPage
        const { data: response2 } = await axios.get(`/api/brand?page=${page}&keyword=${search}&pk=${response.pk}`);
        console.log(response2)
        setPosts(response2.data.result);
        setMaxPage(response2.data.maxPage);
        setLoading(false)
      }
    }
  }
  useEffect(() => {
    isAdmin()
  }, [])


  function setStatus(stt) {
    if (stt === 1) {
      return "사용중"
    }
    else {
      return "사용안함"
    }
  }
  const onSearch = (e) => {
    setSearch(e.target.value)
  }
  function onChangePage(num) {
    async function fetchPosts() {
      setLoading(true);
      const page = num
      const { data: response } = await axios.get(`/api/brand?page=${page}&keyword=${search}&pk=${myPk}`);
      setPosts(response.data.result);
      setLoading(false);
    }
    fetchPosts()
  };
  function onCreateTime(num) {
    num = num.split('.')[0]
    num = num.replace('T', ' ')
    return num
  }
  const pageNumbers = [];
  for (let i = 1; i <= maxPage; i++) {
    pageNumbers.push(i);
  }
  async function submitOnOff(onoff_num,brand_pk){
    let obj = {
      pk:brand_pk,
    }

    if(onoff_num==0){
      obj.onOffCount = 0
    }
    else if(onoff_num==1){
      obj.onOffCount = 1
    }
    const {data:response} = await axios.post(`/api/brandonoff`,obj)
    if(response.result<0){
      alert(response.message)
    }
    else{
      alert(response.message)
      window.location.reload()
    }
  }
  async function onDelete(num){
    const {data:response} = await axios.post('/api/deletebrand',{
      pk:num
    })
    if(response.result<0){
      alert(response.message)
    }
    else{
      alert("삭제되었습니다.")
      window.location.reload()
    }
  }
  async function middleClassOnOff(brand_pk,class_num,onoff_count){
    const {data:response} = await axios.post('/api/brandclassonoff',{
      pk:brand_pk,
      classNum:class_num,
      count:onoff_count
    })
    if(response.result>0){
      alert(response.message)
      window.location.reload()
    }
    else{
      alert(response.message)
    }
  }
  return (
    <React.Fragment>
      <div className="page-content" style={{color:'#596275'}}>
        <Container fluid style={{fontFamily:'NanumGothic'}}>
          <Breadcrumbs breadcrumbItem="브랜드관리" />
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
                      <BrandName>이미지</BrandName>
                      <BrandName>브랜드</BrandName>
                      
                      <Class1>중분류1</Class1>
                      <Class2>중분류2</Class2>
                      <Class3>중분류3</Class3>
                      <Class4>중분류4</Class4>
                      <Class4>중분류5</Class4>
                      <Class4>중분류6</Class4>
                      <Class4>중분류7</Class4>
                      <Class4>중분류8</Class4>
                      <Class4>중분류9</Class4>
                      <Class4>중분류10</Class4>
                      <Status>온오프</Status>
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
                          <BrandName><ListImg src={ServerLink + post.image_src} /></BrandName>
                          <BrandName><ListText>{post.brand_name}</ListText></BrandName>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[0]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[0]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,1,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,1,1)
                              }
                            }
                          }}>{post.middle_class_1}</ListText></Class1>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[1]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[1]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,2,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,2,1)
                              }
                            }
                          }}>{post.middle_class_2}</ListText></Class1>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[2]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[2]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,3,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,3,1)
                              }
                            }
                          }}>{post.middle_class_3}</ListText></Class1>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[3]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[3]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,4,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,4,1)
                              }
                            }
                          }}>{post.middle_class_4}</ListText></Class1>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[4]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[4]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,5,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,5,1)
                              }
                            }
                          }}>{post.middle_class_5}</ListText></Class1>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[5]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[5]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,6,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,6,1)
                              }
                            }
                          }}>{post.middle_class_6}</ListText></Class1>

                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[6]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[6]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,7,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,7,1)
                              }
                            }
                          }}>{post.middle_class_7}</ListText></Class1>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[7]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[7]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,8,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,8,1)
                              }
                            }
                          }}>{post.middle_class_8}</ListText></Class1>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[8]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[8]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,9,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,9,1)
                              }
                            }
                          }}>{post.middle_class_9}</ListText></Class1>
                          <Class1><ListText style={{padding:'4px',background:`${JSON.parse(post.middle_class_onoff_list)[9]==1?'#2ecc71':'#74788d'}`,color:`white`,borderRadius:'4px',cursor:'pointer'}} onClick={()=>{
                            if(JSON.parse(post.middle_class_onoff_list)[9]==1){
                              if (window.confirm("상태를 off으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,10,0)
                              }
                            }
                            else{
                              if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                                middleClassOnOff(post.pk,10,1)
                              }
                            }
                          }}>{post.middle_class_10}</ListText></Class1>
                          <Status>{post.onoff==0?
                          <Button onClick={()=>{
                            if (window.confirm("상태를 on으로 변경하시겠습니까?")) {
                              submitOnOff(1,post.pk)
                            }
                          }}>{'off'}</Button>
                        :
                        <Button style={{background:'#2ecc71'}} onClick={()=>{
                          if (window.confirm("상태를 off로 변경하시겠습니까?")) {
                            submitOnOff(0,post.pk)
                          }
                        }}>{'on'}</Button>}</Status>
                          <Status><ListText>{setStatus(post.status)}</ListText></Status>
                          <Modify><Link to={{
                            pathname: '/brand-revise',
                            state: {
                              pk: post.pk, name: post.brand_name, class1: post.middle_class_1
                              , class2: post.middle_class_2, class3: post.middle_class_3, class4: post.middle_class_4,
                              status: setStatus(post.status)
                              , class5: post.middle_class_5, class6: post.middle_class_6, class7: post.middle_class_7
                              , class8: post.middle_class_8, class9: post.middle_class_9, class10: post.middle_class_10
                            }
                          }} className="px-3 text-primary"><i className="uil uil-pen font-size-18"></i></Link></Modify>
                          <Delete><Link to="#" className="px-3 text-danger"
                           onClick={() => {
                            if (window.confirm("정말 삭제 하시겠습니까?")) {
                              onDelete(post.pk)
                            }}}
                          ><i className="uil uil-trash-alt font-size-18"></i></Link></Delete>
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
