import PropTypes from 'prop-types'
import React from "react"

import { connect } from "react-redux"

import { Link } from "react-router-dom"

import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

import EmartLogo from "../../assets/images/emart_logo.png"
//i18n
import { withTranslation } from "react-i18next"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"

const Header = props => {

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  function tToggle() {
    props.toggleLeftmenu(!props.leftMenu)
    if (props.leftSideBarType === "default") {
      props.changeSidebarType("condensed", isMobile)
    } else if (props.leftSideBarType === "condensed") {
      props.changeSidebarType("default", isMobile)
    }
  }
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/product-list" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={EmartLogo} alt="" height="42" />
                </span>
                <span className="logo-lg">
                  <img src={EmartLogo} alt="" height="40" />
                </span>
              </Link>

              <Link to="/product-list" className="logo logo-light">
                <span className="logo-sm">
                  <img src={EmartLogo} alt="" height="42" />
                </span>
                <span className="logo-lg">
                  <img src={EmartLogo} alt="" height="40" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle()
              }}
              className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
          </div>

          <ProfileMenu/>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
}

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
  } = state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
