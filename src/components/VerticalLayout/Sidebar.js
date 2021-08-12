import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { withRouter , Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"


import EmartLogo from "../../assets/images/emart_logo.png"

const Sidebar = props => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
         

          <Link to="/product-list" className="logo logo-light">
            <span className="logo-lg">
              <img src={EmartLogo} alt="" height="20" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  }
}
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)))