import { h, Component } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { Link } from 'preact-router';
import FontAwesome from 'react-fontawesome';

export default class Details extends Component {

	changeDateISOFormat = (date) => {
		const d = new Date(date);
		console.log(d);
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}

	render({user}) {
		const dateOfBirth = (user.dateOfBirth != null) ? this.changeDateISOFormat(user.dateOfBirth) : 'TBC';

		return (
			<div className={style.details}>
				<h2>
					Your details
					<Link href='/edit-profile'>Edit <FontAwesome name="pencil" /></Link>
				</h2>
				<div className={style.inner}>
					<div>
						<span className={style.key}>Name:</span>
						<span className={style.value}>{user.name}</span>
					</div>
					<div>
						<span className={style.key}>Last name:</span>
						<span className={style.value}>{user.lastName}</span>
					</div>
					<div>
						<span className={style.key}>Email:</span>
						<span className={style.value}>{user.email}</span>
					</div>
					<div>
						<span className={style.key}>Date of birth:</span>
						<span className={style.value}>{ dateOfBirth }</span>
					</div>
					<div>
						<span className={style.key}>Location:</span>
						<span className={style.value}>{(user.location != null) ? user.location : 'TBC'}</span>
					</div>
					<div>
						<span className={style.key}>Mobile:</span>
						<span className={style.value}>{(user.mobile != null) ? user.mobile : 'TBC'}</span>
					</div>

				</div>
			</div>
		)
	}
}
