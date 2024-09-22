import { FC, Fragment, memo, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import Editor from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleDataExport, handleFileUpload, processJsonToFlowchart } from '../utils/helpers';
import { faAlignLeft, faCheckDouble, faFileExport, faFileImport, faTimes } from '@fortawesome/free-solid-svg-icons';

import '../utils/styles.css';
import DataFlowCanvas from './DataFlowCanvas';

interface Props {
	theme: string;
}

export const VisualizerInputComponent: FC<Props> = memo(({ theme }) => {
	const [sidebarWidth, setSidebarWidth] = useState(350);
	const [isWide, setIsWide] = useState<boolean>(true);
	const [value, setVal] = useState<string>('');
	const savedValue = localStorage.getItem('visualize-json-file') || '';
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [nodes, setNodes] = useState<any[]>();
	const [edges, setEdges] = useState<any[]>();

	const editorRef = useRef<any>(null);

	useEffect(() => {
		setVal(savedValue);
	}, []);

	const handleDrag = (event: any) => {
		event.preventDefault();
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (event: any) => {
		if (event?.clientX > 310 && event?.clientX < 500) {
			setSidebarWidth(event.clientX);
		}
	};

	const handleMouseUp = () => {
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	};

	const isValidJson = (): boolean => {
		try {
			JSON.parse(value || '');
			return true;
		} catch (error) {
			if (error instanceof SyntaxError) {
				const errorMessage = `Invalid JSON syntax: ${error?.message?.split('(')[0]} at line ${error?.message?.split('(')[1]?.split(' ')[1]}.`;
				setErrorMessage(errorMessage);
				return false;
			}
			return false;
		}
	};

	const handleFormatClick = () => {
		const isValid: boolean = isValidJson() || false;
		if (editorRef?.current && !!isValid) {
			editorRef?.current.getAction('editor.action.formatDocument').run();
		}
	};

	const handleVisualizeClick = () => {
		const jsonData = value;
		try {
			const parsedData = JSON.parse(jsonData);
			const { nodes, edges } = processJsonToFlowchart(parsedData);
			setNodes(nodes);
			setEdges(edges);
		} catch {}
		setIsWide(!isWide);
	};

	const setValue = (ins: any) => {
		if (ins) {
			localStorage.setItem('visualize-json-file', ins);
			setVal(ins);
		} else {
			localStorage.setItem('visualize-json-file', '');
			setVal('');
		}
	};

	const handleChange = (ins: any) => {
		setErrorMessage('');
		setValue(ins);
	};

	const editorDidMount = (editor: any) => {
		editorRef.current = editor;
		editor.focus();
	};

	return (
		<Fragment>
			<div className={isWide ? (theme == 'dark' ? 'dark-input' : 'light-input') : theme == 'dark' ? 'dark-input-small' : 'light-input-small'}>
				<div className='input-filed-wrapper' style={{ width: `${sidebarWidth}px` }}>
					<div className={theme === 'dark' ? 'json-input-header' : 'json-input-header-light'}>
						{errorMessage && value ? <span style={{ color: '#a94442', fontSize: '14px', marginLeft: '10px' }}>{errorMessage}</span> : <span></span>}
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<a data-tooltip-id='clear-code-icon-tooltip' data-tooltip-content='Clear' data-tooltip-place='left'>
								<FontAwesomeIcon
									id={'clear-code-icon'}
									icon={faTimes}
									color={theme === 'dark' ? '#1bb2ff' : '#888888'}
									style={{ marginRight: '25px', cursor: 'pointer' }}
									onClick={() => {
										setValue('');
									}}
								/>
							</a>
							<Tooltip id='clear-code-icon-tooltip' />
							<a data-tooltip-id='validate-json-icon-tooltip' data-tooltip-content='Validate' data-tooltip-place='left'>
								<FontAwesomeIcon
									id={'validate-json-icon'}
									icon={faCheckDouble}
									color={!!errorMessage && !!value ? '#a94442' : theme === 'dark' ? '#1bb2ff' : '#888888'}
									style={{ marginRight: '25px', cursor: 'pointer' }}
									onClick={() => isValidJson()}
								/>
							</a>
							<Tooltip id='validate-json-icon-tooltip' />
							<div className='custom-file-upload'>
								<label>
									<input
										type='file'
										accept='.json'
										id='file-upload'
										style={{ display: 'none' }}
										onChange={(event) => handleFileUpload(event, setValue)}
									/>
									<a data-tooltip-id='upload-json-icon-tooltip' data-tooltip-content='Import' data-tooltip-place='left'>
										<FontAwesomeIcon
											icon={faFileImport}
											color={theme === 'dark' ? '#1bb2ff' : '#888888'}
											style={{ marginRight: '25px', cursor: 'pointer', fontSize: '14px' }}
										/>
									</a>
									<Tooltip id='upload-json-icon-tooltip' />
								</label>
							</div>
							<a data-tooltip-id='export-json-data-tooltip' data-tooltip-content='Export' data-tooltip-place='left'>
								<FontAwesomeIcon
									id={'export-json-data'}
									icon={faFileExport}
									color={theme === 'dark' ? '#1bb2ff' : '#888888'}
									style={{ marginRight: '25px', cursor: 'pointer', fontSize: '14px' }}
									onClick={() => {
										if (isValidJson()) {
											handleDataExport(value);
										}
									}}
								/>
							</a>
							<Tooltip id='export-json-data-tooltip' />
							<a data-tooltip-id='format-json-icon-tooltip' data-tooltip-content='Format' data-tooltip-place='left'>
								<FontAwesomeIcon
									id={'format-json-icon'}
									icon={faAlignLeft}
									color={theme === 'dark' ? '#1bb2ff' : '#888888'}
									style={{ marginRight: '25px', cursor: 'pointer' }}
									onClick={() => handleFormatClick()}
								/>
							</a>
							<Tooltip id='format-json-icon-tooltip' />
							<a
								data-tooltip-id='visualize-json-icon-tooltip'
								data-tooltip-content={isWide ? 'Click to visualize data.' : 'Click to exit visualization mode.'}
								data-tooltip-place='left'
							>
								<button
									className={theme === 'dark' ? 'compare-button' : 'compare-button-light'}
									onClick={() => {
										isWide && handleVisualizeClick();
										!isWide && setEdges(undefined);
										!isWide && setNodes(undefined);
										!isWide && setIsWide(true);
									}}
								>
									{isWide ? 'Visualize' : 'Exit'}
								</button>
							</a>
							<Tooltip id='visualize-json-icon-tooltip' />
						</div>
					</div>
					<Editor
						className='json-input-area'
						defaultLanguage='json'
						theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
						value={value}
						onChange={handleChange}
						options={{
							cursorStyle: 'line',
							formatOnPaste: true,
							formatOnType: true,
							wordWrap: true,
							selectOnLineNumbers: true,
							readOnly: isWide ? false : true,
							autoIndent: 'full',
							contextmenu: true,
							fontFamily: 'monospace',
							fontSize: 12,
							lineHeight: 20,
							hideCursorInOverviewRuler: true,
							matchBrackets: 'always',
							scrollbar: {
								horizontalSliderSize: 2,
								verticalSliderSize: 16
							},
							automaticLayout: true,
							minimap: {
								enabled: true
							}
						}}
						onMount={editorDidMount}
					/>
				</div>
				{!isWide && (
					<div className='drag-wrapper'>
						<div className='drag-line' onMouseDown={handleDrag} />
					</div>
				)}
			</div>
			<div
				style={{
					width: `calc(100% - ${sidebarWidth + 25}px)`,
					height: 'calc(100% - 3px)',
					display: 'flex',
					backgroundColor: theme === 'dark' ? '#31363f' : 'white'
				}}
			>
				{nodes && edges && <DataFlowCanvas nodes={nodes} edges={edges} />}
			</div>
		</Fragment>
	);
});
