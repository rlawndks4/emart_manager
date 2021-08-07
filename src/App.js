import PropTypes from 'prop-types'
import React, { createContext, useMemo, useState} from "react"

import { Switch, BrowserRouter as Router} from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"

import NonAuthLayout from "./components/NonAuthLayout"
// Import scss
import "./assets/scss/theme.scss"



// Activating fake backend
export const LoginContext = createContext({
  ID: '',
  setID: () => {},
  PW: '',
  setPW: () => {},
  success: false,
  setSuccess: () => {},
  signUpFlag: false,
  setSignUpFlag: () => {}
})

const App = (props) => {

  const [ID, setID] = useState('')
    const [PW, setPW] = useState('')
    const [success, setSuccess] = useState(false)
    const [signUpFlag, setSignUpFlag] = useState(false)
  const loginContextValue = useMemo(() => ({ 
    ID, setID, PW, setPW, success, setSuccess, signUpFlag, setSignUpFlag
}), [ID, setID, PW, setPW, success, setSuccess, signUpFlag, setSignUpFlag])

  

  function getLayout() {
    let layoutCls = VerticalLayout

    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = VerticalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()

 
  
  return (
    <React.Fragment>
      <LoginContext.Provider value={loginContextValue}>
      <Router>
        
        <Switch>
        {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
            />
          ))}
          
          {userRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
        </Switch>

      </Router>
      </LoginContext.Provider>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)