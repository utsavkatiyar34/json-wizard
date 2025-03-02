import { FC, memo } from 'react';
import { Switch } from 'antd';
import { NavLink } from 'react-router-dom';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

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
				<NavLink
					to='/visualize-json'
					className={({ isActive }) => (isActive ? (viewMode === 'dark' ? 'link-active' : 'link-active-light') : 'link-inactive')}
				>
					{'Visualize'}
				</NavLink>
				<Switch
					className='ml-10'
					style={{ transition: 'all 0.5s' }}
					checkedChildren={<MoonOutlined />}
					unCheckedChildren={<SunOutlined />}
					checked={viewMode === 'dark'}
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
