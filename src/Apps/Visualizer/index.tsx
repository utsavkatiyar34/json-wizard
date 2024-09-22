import { FC, Fragment, memo } from 'react';
import { VisualizerInputComponent } from './Components/VisualizerInputComponent';

import './utils/styles.css';

interface Props {
	theme: string;
}

export const JsonVisualizer: FC<Props> = memo(({ theme }) => {
	return (
		<Fragment>
			<div className={theme == 'dark' ? 'visualizer-wrapper-dark' : 'visualizer-wrapper-light'}>
				<VisualizerInputComponent theme={theme} />
			</div>
		</Fragment>
	);
});
