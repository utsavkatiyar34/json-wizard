import { FC, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { faSun } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './navbar.css';

interface Props {
	viewMode: string;
	setViewMode: Function;
}

export const NavBar: FC<Props> = memo(({ viewMode, setViewMode }) => {
	return (
		<div className={viewMode === 'dark' ? 'nav-wrapper' : 'nav-wrapper-light'}>
			<NavLink to={'/format-json'} className={viewMode === 'dark' ? 'logo-wrapper' : 'logo-wrapper-light'}>
				{'JSON Wizard'}
			</NavLink>
			<div className='links-wrapper'>
				<NavLink
					to='/format-json'
					className={({ isActive }) => (isActive ? (viewMode === 'dark' ? 'link-active' : 'link-active-light') : 'link-inactive')}
				>
					{'Format'}
				</NavLink>
				<NavLink
					to='/compare-json'
					className={({ isActive }) => (isActive ? (viewMode === 'dark' ? 'link-active' : 'link-active-light') : 'link-inactive')}
				>
					{'Compare'}
				</NavLink>
				{/* <NavLink to='/visualize-json' className={({ isActive }) => (isActive ? 'link-active' : 'link-inactive')}>
					{'Visualize'}
				</NavLink> */}

				<FontAwesomeIcon
					icon={faSun}
					style={{ marginLeft: '20px', marginRight: '5px', cursor: 'pointer', fontSize: '20px', color: viewMode === 'light' ? '#142334' : 'white' }}
					onClick={() => {
						if (viewMode === 'dark') {
							localStorage.setItem('viewMode', 'light');
							setViewMode('light');
						} else {
							localStorage.setItem('viewMode', 'dark');
							setViewMode('dark');
						}
					}}
				/>
			</div>
		</div>
	);
});
