import PropTypes from "prop-types"
import React, { useCallback, useEffect, useRef } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"

const SidebarContent = props => {
  const ref = useRef();

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false
    }
    scrollElement(item);
    return false
  },[]);  

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    new MetisMenu("#side-menu")
    let matchingMenuItem = null
    const ul = document.getElementById("side-menu")
    const items = ul.getElementsByTagName("a")
    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }

  }, [props.location.pathname,activateParentDropdown])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  

  return (
    <React.Fragment>
      
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref} className="sidebar-menu-scroll">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            
                <li>
                  <Link to="/kiosk-list">
                  <i className="uil-window-section"></i>
                    <span style={{fontFamily: 'NanumGothic'}}>{props.t("키오스크관리")}</span>
                    </Link>
                
                     <Link to="/add-kiosk" style={{display:'none'}}></Link>
                      <Link to="/kiosk-revise" style={{display:'none'}}></Link>
                    
                      
                </li>
                <li>
                  <Link to="/customer-list">
                  <i className="uil-user-circle"></i>
                  <span style={{fontFamily: 'NanumGothic'}}>{props.t("회원관리")}</span>
                    </Link>
                    <Link to="/add-customer" style={{display:'none'}}></Link>
                      <Link to="/customer-revise" style={{display:'none'}}></Link>
                </li>
                <li>
                  <Link to="/ad-list">
                  <i className="uil-shutter-alt"></i>
                  <span style={{fontFamily: 'NanumGothic'}}>{props.t("광고관리")}</span>
                  </Link>
                  <Link to="/add-ad" style={{display:'none'}}></Link>
                      <Link to="/ad-revise" style={{display:'none'}}></Link>
                </li>
                <li>
                  <Link to="/brand-list">
                  <i className="uil-file-alt"></i>
                  <span style={{fontFamily: 'NanumGothic'}}>{props.t("브랜드관리")}</span>
                  </Link>
                  <Link to="/add-brand" style={{display:'none'}}></Link>
                  <Link to="/brand-revise" style={{display:'none'}}></Link>
                </li>
                <li>
                  <Link to="/product-list">
                  <i className="uil-store"></i>
                  <span style={{fontFamily: 'NanumGothic'}}>{props.t("상품관리")}</span>
                    </Link>
                    <Link to="/product-revise" style={{display:'none'}}></Link>
                </li>
                <li>
                  <Link to="/add-product">
                  <i className="uil-list-ul"></i>
                  <span style={{fontFamily: 'NanumGothic'}}>{props.t("상품추가")}</span>
                  </Link>
                </li>
              
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))