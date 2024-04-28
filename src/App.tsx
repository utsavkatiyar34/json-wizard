import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { NavBar } from './Components/NavBar/NavBar';
import { PublicRoutes } from './Routes/PublicRoutes';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

export const App = () => {
	const location: any = useLocation();
	const navigate: NavigateFunction = useNavigate();
	const mode: string = localStorage.getItem('viewMode') || 'dark';
	const [viewMode, setViewMode] = useState(mode);

	useEffect(() => {
		if (location?.pathname == '/') {
			navigate('/format-json');
		}
	}, [location?.pathname]);

	return (
		<Fragment>
			<NavBar viewMode={viewMode} setViewMode={setViewMode} />
			<PublicRoutes viewMode={viewMode} />
		</Fragment>
	);
};

export default App;
