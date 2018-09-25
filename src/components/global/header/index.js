import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import * as router from 'preact-router';
import style from './style.scss';
import Search from '../search';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { hideSearchBox } from '../../../actions';
import { apiRoot } from '../../../api';
import { logIn, logOff } from '../../../actions/user';
import FontAwesome from 'react-fontawesome';
import Redirect from '../redirect';
import { getCurrentUrl } from 'preact-router';
import { routes } from '../../app'


const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedOff: false,
      mobileMenuOpened: false
    }
  }
  componentWillReceiveProps(nextProps){
    if (typeof this.props.userAuth != 'undefined' && typeof nextProps.userAuth != 'undefined') {
      if (Object.keys(this.props.userAuth).length != 0 && Object.keys(nextProps.userAuth).length === 0) {
        this.setState({
          loggedOff: true
        })
      } else {
        this.setState({
          loggedOff: false
        })
      }
    }


  }
	componentDidMount(){
    let that = this;
    router.subscribers.push(()=>{
      that.setState({
        mobileMenuOpened: false
      })
    });

		let userAuth = getCookie('USER_AUTH');
		if (userAuth != null) {
			this.props.logIn(userAuth)
		}
	}
  logOff(){
    this.setState({
      loggedOff: true
    });
    this.props.logOff();
  }
	render() {
		const user = this.props.userData;
    const currentUrl = getCurrentUrl();
    const isLogin = Object.keys(user).length !== 0;

		return (
			<header id={style.header} className='uk-navbar uk-navbar-container'>
        <span id={style.expandMobileMenu}  className={this.state.mobileMenuOpened ? style.opened : ''} onClick = { ()=>{this.setState({mobileMenuOpened: !this.state.mobileMenuOpened})}}>
            <span></span>
            <span></span>
            <span></span>
        </span>
        <div id={style.mobileShadow} className={this.state.mobileMenuOpened ? style.opened : ''}></div>
				<div className="uk-navbar-left">
          { this.state.loggedOff && (
            <Redirect to='/' />
          )}
					<Link href={routes.HOME} id={style.logo}>
						<img src="/assets/logo.png" alt="Telmie App" />
					</Link>
					<ul className="uk-navbar-nav" id={style.leftNav}>
            {
              isLogin ? ([
                (user.pro != null) && (<li><Link activeClassName={style.activeLink} href={routes.MY_CLIENTS}>My Clients</Link></li>),
                <li><Link activeClassName={style.activeLink} href={routes.MY_PROS}>My Pros</Link></li>,
                <li><Link activeClassName={style.activeLink} href={routes.TRANSACTIONS}>Money</Link></li>,
                (user.pro == null) && (<li><Link activeClassName={style.activeLink} href={routes.REGISTER_PRO}>Become a Pro</Link></li>)
              ]) : ([
                <li><Link activeClassName={style.activeLink} href={routes.HOME}>Home</Link></li>,
                <li><Link activeClassName={style.activeLink} href={routes.ABOUT_US}>About us</Link></li>,
                <li><Link activeClassName={style.activeLink} href={routes.FAQ}>FAQ</Link></li>
              ])
            }
						
					</ul>
				</div>

				<div className="uk-navbar-right">
          { currentUrl != '/' && (
              <Search hiddenSearchBox = {this.props.hiddenSearchBox} hideSearchBox = { this.props.hideSearchBox } home= { false }/>
          )}

					 { !isLogin  ? (
						<nav>
							<ul className="uk-navbar-nav">
								<li><Link href={routes.SIGN_UP} id={style.signUp}>Sign up</Link></li>
								<li><Link href={routes.LOG_IN}>Login</Link></li>
							</ul>
						</nav>
					) : (
						<div className={style.loggedInContainer}>
							<div className="mobile-hide">
								{ user.name } { user.lastName }
							</div>
							<FontAwesome name='caret-down' />
							<div className={style.avatar}>

								{(user.avatar != null) ? (
									<img src={apiRoot + 'image/' + user.avatar.id} alt={user.name + ' ' + user.lastName} />
								) : (
									<img src="/assets/nouserimage.jpg" alt={user.name + ' ' + user.lastName} />
								)}

							</div>
							<div className={style.dropdown + ' uk-dropdown'}>
							    <ul className="uk-nav uk-dropdown-nav">
							        {/*<li><Link href="/profile">My Account</Link></li>
											<li><Link href="/my-pros">My Pros</Link></li>
                      {(user.pro != null) && (
                          <li><Link href="/my-clients">My Clients</Link></li>
                      )}
                      <li><Link href="/my-shortlist">My Shortlist</Link></li>
											<li><Link href="/transactions">Money</Link></li>
											<li><Link href="/edit-profile">Edit Profile</Link></li>
                      <li><Link href="/register-pro">Register as Pro</Link></li>
							        <li className="uk-nav-divider"></li>
                      <li><Link href="/edit-profile">Edit Profile</Link></li>
                      <li className="uk-nav-divider"></li>*/}
                      <li><Link href="/settings">Settings</Link></li>
							        <li><a onClick={()=>this.logOff()}>Log out</a></li>
							    </ul>
							</div>

						</div>
					)}
				</div>

        <div id={style.mobileNav} className={this.state.mobileMenuOpened ? style.opened : ''}>
          {/*<Link href="/">Home</Link>
          <Link href="/about-us">About us</Link>
          <Link href="/help">FAQ</Link>*/}
          { !isLogin  ? (
					  <div>
              <h3>My account</h3>
              <Link href={routes.SIGN_UP} id={style.signUp}>Sign up</Link>
              <Link href={routes.LOG_IN}>Login</Link>
            </div>
					) : (
            <div>
              {/*<Link href="/profile">My Account</Link>
              <Link href="/my-pros">My Pros</Link>
              {(user.pro != null) && (
                  <Link href="/my-clients">My Clients</Link>
              )}
              <Link href="/my-shortlist">My Shortlist</Link>
							<Link href="/transactions">Money</Link>
							<Link href="/edit-profile">Edit Profile</Link>
              <Link href="/register-pro">Register as Pro</Link>
              <Link href="/edit-profile">Edit Profile</Link>*/}
              {(user.pro != null) && <Link activeClassName={style.activeLink} href={routes.MY_CLIENTS}>My Clients</Link>}
              <Link activeClassName={style.activeLink} href={routes.MY_PROS}>My Pros</Link>
              <Link activeClassName={style.activeLink} href={routes.TRANSACTIONS}>Money</Link>
              {(user.pro == null) && <Link activeClassName={style.activeLink} href={routes.REGISTER_PRO}>Become a Pro</Link>}
              <a onClick={()=>this.logOff()}>Log out</a>
            </div>
					)}

        </div>


			</header>
		);
	}
}




const mapStateToProps = (state) => ({
	hiddenSearchBox: state.hiddenSearchBox,
	userData: state.loggedInUser
});


const mapDispatchToProps = dispatch => bindActionCreators({
	hideSearchBox,
	logIn,
	logOff
}, dispatch);


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header);
