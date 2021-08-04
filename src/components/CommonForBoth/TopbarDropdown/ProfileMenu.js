import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { withRouter, Link, useHistory } from "react-router-dom"
import axios from "axios"
// users
import user4 from "../../../assets/images/users/avatar-4.jpg"

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)
  const history = useHistory()
  const [username, setUsername] = useState("Admin")
  const [userLevel, setUserLevel] = useState("")
  const isAdmin = async () => {
  
    const { data: response } = await axios.get('/api/auth')
    setUsername(response.id)
    if(response.first){
      setUserLevel("개발자")
    }
    else{
      if(response.second){
        setUserLevel("관리자")
      }
      else{
        if(response.third){
          setUserLevel("일반회원")
        }
        
      }
    }
  }
  useEffect(() => {
    isAdmin()
  }, [])
  const onLogout = async () => {
    axios.post('/api/logout')
    alert("로그아웃 되었습니다.")
  }
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          
          <span>{username}</span>{" "}
          
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/product-list">
            {" "}
            <i className="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>
            {props.t(username)}{" "}
          </DropdownItem>
          
          <DropdownItem>
            <i className="uil uil-lock-alt font-size-18 align-middle me-1 text-muted"></i>
            {props.t(userLevel)}
          </DropdownItem>
          <div className="dropdown-divider" />
          <Link to="/login" className="dropdown-item"
          onClick={onLogout}>
            <i className="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
