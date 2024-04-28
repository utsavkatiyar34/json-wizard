import { FC, Fragment, memo } from 'react';
import { JsonFormatterComponent } from './Components/JsonFormatterComponent';

import './utils/styles.css';

interface Props {
	theme: string;
}

export const JsonFormatter: FC<Props> = memo(({ theme }) => {
	return (
		<Fragment>
			<div className='formatter-wrapper'>
				<JsonFormatterComponent theme={theme} />
			</div>
		</Fragment>
	);
});
