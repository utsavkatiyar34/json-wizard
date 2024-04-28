import { FC, Fragment, memo } from 'react';
import { JsonDiffCheckComponent } from './Components/JosnDiffCheck';

interface Props {
	theme: string;
}

export const JsonComparer: FC<Props> = memo(({ theme }) => {
	return (
		<Fragment>
			<div className='formatter-wrapper'>
				<JsonDiffCheckComponent theme={theme} />
			</div>
		</Fragment>
	);
});
