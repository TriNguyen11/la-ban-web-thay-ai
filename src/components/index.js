
import CheckPrivateRoute from './CheckPrivateRoute'
import ScrollToTop from './common/ScrollToTop'
import Languages from './common/Languages'
import Content from './common/Content'
import Header from './common/Header'
import Footer from './common/Footer'
import SideBar from './common/SideBar'
import LoadingIndicator from './common/LoadingIndicator'
import BackgroundLoading from './common/BackgroundLoading'
import OverlayLoading from './common/OverlayLoading'
import NoneOfResults from './common/NoneOfResults'

const render = (code, data ={}) => {
  switch (code) {
    case '':
      break;
    default:
      return(<></>)
  }
}

export {
  CheckPrivateRoute,
  Languages,
  Header,
  Footer,
  SideBar,
  Content,
  ScrollToTop,
  LoadingIndicator,
  BackgroundLoading,
  OverlayLoading,
  NoneOfResults,
  render,
}
