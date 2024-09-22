import { FC, memo } from 'react';
import { JsonComparer } from '../Apps/Comparer';
import { Route, Routes } from 'react-router-dom';
import { JsonFormatter } from '../Apps/Formatter';
import { JsonVisualizer } from '../Apps/Visualizer';

interface Props {
	viewMode: string;
}

export const PublicRoutes: FC<Props> = memo(({ viewMode }) => {
	return (
		<Routes>
			<Route path='/' element={<JsonFormatter theme={viewMode} />} />
			<Route path='/format-json' element={<JsonFormatter theme={viewMode} />} />
			<Route path='/compare-json' element={<JsonComparer theme={viewMode} />} />
			<Route path='/visualize-json' element={<JsonVisualizer theme={viewMode} />} />
		</Routes>
	);
});
