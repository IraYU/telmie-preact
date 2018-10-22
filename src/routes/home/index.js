import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import { hideSearchBox } from '../../actions';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import Spinner from '../../components/global/spinner';
import { Element, scroller, Link as ScrollLink } from 'react-scroll'

import InfoComponent from '../../components/new-landing/info-component'
import PhotoCards from '../../components/new-landing/photo-cards'
import FeaturedServices from '../../components/new-landing/featured-services'
import HowWorksDetails from '../../components/new-landing/how-works-details'
import LandingFAQ from '../../components/new-landing/landing-faq'
import AppDetails from '../../components/new-landing/app-details'
import ProDetails from '../../components/new-landing/pro-details'
import BlogArticles from '../../components/new-landing/blog-articles'
import ContactForm from '../../components/new-landing/contact-form'

import { route } from 'preact-router';
import { verify } from '../../actions/user';
import style from './style.scss';

// mock-data
import { photoCards, serviceCards, landingFAQ, blogArtilces, autoprintWords } from './mock-data'
const appLink = 'https://itunes.apple.com/us/app/telmie/id1345950689';

class HomePage extends Component {
	constructor(props){
		super(props);
		this.state =  {
			doc: null,
			notFound: false,
			verifyFailure: false
	  }
	  this.contactUs = null;
	}
	scrollToContact = () => {
		(window.location.hash.indexOf('contact-us') + 1) &&
			(this.scrollInterval = setInterval(() => {
				this.contactUs !== null && (
					scroller.scrollTo('contactUsElement', {
						spy: true,
						smooth: true,
						duration: 500,
						offset: -50,
					}),
					clearInterval(this.scrollInterval),
					this.scrollInterval = null
				)
			}, 100));
	}
	componentDidMount(){
	//	window.scrollTo(0, 0);
		this.fetchPage(this.props);
		if (typeof this.props.token != 'undefined') {
			this.props.verify(this.props.token)
		}
		this.scrollToContact();
	}
	componentWillReceiveProps(nextProps){
		if (this.props.prismicCtx == null && nextProps.prismicCtx != null) {
			this.fetchPage(nextProps);
		}

		if (nextProps.verifySuccess) {
			route('/log-in');
		}

		if (nextProps.verifyFailure) {
			this.setState({
				verifyFailure: true
			})
		}

	}
	componentWillUnmount(){
		clearInterval(this.scrollInterval);
		this.scrollInterval = null;
	}

	fetchPage(props) {
    if (props.prismicCtx) {
      // We are using the function to get a document by its uid
      return props.prismicCtx.api.getByID(props.uid).then((doc, err) => {
        if (doc) {
					console.log('doc',doc);
          // We put the retrieved content in the state as a doc variable
          this.setState({ doc });
        } else {
          // We changed the state to display error not found if no matched doc
          this.setState({ notFound: !doc });
        }
      });
			/*
			return props.prismicCtx.api.query('').then(function(response) {
			   console.log(response);
			});*/
    }
    return null;
  }
	render() {
		if (this.state.doc) {
			const pageData = this.state.doc.data;
			const {userData : user  = {}} = this.props;
			return (
				<div id="homepage" style={{paddingTop: 100}}>
						
					<InfoComponent wordsToPrint={autoprintWords} appLink={appLink}/>

					<div class={style.photoContainer}>
						<PhotoCards cards = {photoCards}/>
					</div>

					<HowWorksDetails videoId={pageData.main_video.video_id} appLink={appLink}/>

					<FeaturedServices serviceCards={serviceCards} />

					<div class={style.iosAppSection}>
						<AppDetails appLink={appLink}/>
					</div>

					<div class={style.faqContainer}>
						<LandingFAQ {...landingFAQ}/>
					</div>

					<div class={style.proWrapper}>
						<ProDetails appLink={appLink} />
					</div>

					{/*<div class={`${style.blogContainer} uk-container`}>
						<div class={style.header}>Blog</div>
						<BlogArticles articles = {blogArtilces}/>
					</div>*/}
					<Element name="contactUsElement"></Element>					
					<ContactForm ref={ref=> this.contactUs = ref} />
				</div>

			);
		}
		return (
			<div  className="uk-container uk-container-small" id="staticPage" >
				<Spinner />
			</div>

		);

	}
}

const mapStateToProps = (state) => ({
	hiddenSearchBox: state.hiddenSearchBox,
	verifySuccess: state.verifySuccess,
	verifyFailure: state.verifyFailure,
	userData: state.loggedInUser
});

const mapDispatchToProps = dispatch => bindActionCreators({
	hideSearchBox,
	verify
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage);
