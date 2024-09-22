import { FC, Fragment, memo, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleDataExport, handleFileUpload } from '../utils/helpers';
import { faAlignLeft, faCheckDouble, faFileExport, faFileImport, faTimes } from '@fortawesome/free-solid-svg-icons';

import '../utils/styles.css';

interface Props {
	theme: string;
}

export const JsonDiffCheckComponent: FC<Props> = memo(({ theme }) => {
	const [value, setVal] = useState<string>('');
	const savedValue = localStorage.getItem('json-file-first') || '';
	const [secondValue, setSecondVal] = useState<string>('');
	const savedSecondValue = localStorage.getItem('json-file-second') || '';
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [errorSecondMessage, setErrorSecondMessage] = useState<string>('');
	const [isComareMode, setIsCompareMode] = useState<boolean>(false);

	const editorRef = useRef<any>(null);
	const editorSecondRef = useRef<any>(null);
	const compareEditorRef = useRef<any>(null);

	useEffect(() => {
		setVal(savedValue);
		setSecondVal(savedSecondValue);
	}, []);

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

	const isValidSecondJson = (): boolean => {
		try {
			JSON.parse(secondValue || '');
			return true;
		} catch (error) {
			if (error instanceof SyntaxError) {
				const errorMessage = `Invalid JSON syntax: ${error?.message?.split('(')[0]} at line ${error?.message?.split('(')[1]?.split(' ')[1]}.`;
				setErrorSecondMessage(errorMessage);
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

	const handleSecondFormatClick = () => {
		const isValid: boolean = isValidSecondJson() || false;
		if (editorSecondRef?.current && !!isValid) {
			editorSecondRef?.current.getAction('editor.action.formatDocument').run();
		}
	};

	const setValue = (ins: any) => {
		if (ins) {
			localStorage.setItem('json-file-first', ins);
			setVal(ins);
		} else {
			localStorage.setItem('json-file-first', '');
			setVal('');
		}
	};

	const setSecondValue = (ins: any) => {
		if (ins) {
			localStorage.setItem('json-file-second', ins);
			setSecondVal(ins);
		} else {
			localStorage.setItem('json-file-second', '');
			setSecondVal('');
		}
	};

	const handleChange = (ins: any) => {
		setErrorMessage('');
		setValue(ins);
	};

	const handleSecondChange = (ins: any) => {
		setErrorSecondMessage('');
		setSecondValue(ins);
	};

	const editorDidMount = (editor: any) => {
		editorRef.current = editor;
		editor.focus();
	};

	const editorSecondDidMount = (editor: any) => {
		editorSecondRef.current = editor;
	};

	const compreDidMount = (editor: any) => {
		compareEditorRef.current = editor;
	};

	const handleCompare = () => {
		const isFirstValid: boolean = isValidJson();
		const isSecondValid: boolean = isValidSecondJson();
		if (isFirstValid && isSecondValid) {
			handleFormatClick();
			handleSecondFormatClick();
			setTimeout(() => setIsCompareMode(true), 250);
		}
	};

	return (
		<Fragment>
			{!isComareMode ? (
				<>
					<div style={{ display: 'flex', justifyContent: 'end', backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' }}>
						<button className={theme === 'dark' ? 'compare-button' : 'compare-button-light'} onClick={handleCompare}>
							{'Compare'}
						</button>
					</div>

					<div className='flex-wrapper'>
						<div className='flex-column'>
							<div className={theme === 'dark' ? 'json-input-header' : 'json-input-header-light'}>
								{errorMessage && value ? (
									<span style={{ color: '#a94442', fontSize: '14px', marginLeft: '10px' }}>{errorMessage}</span>
								) : (
									<span></span>
								)}
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<a data-tooltip-id='clear-code-icon-tooltip' data-tooltip-content='Clear' data-tooltip-place='left'>
										<FontAwesomeIcon
											id={'clear-code-icon'}
											icon={faTimes}
											color={theme === 'dark' ? '#1bb2ff' : '#888888'}
											style={{ marginRight: '15px', cursor: 'pointer' }}
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
											style={{ marginRight: '15px', cursor: 'pointer' }}
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
													style={{ marginRight: '15px', cursor: 'pointer', fontSize: '14px' }}
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
											style={{ marginRight: '15px', cursor: 'pointer', fontSize: '14px' }}
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
											style={{ marginRight: '30px', cursor: 'pointer' }}
											onClick={() => handleFormatClick()}
										/>
									</a>
									<Tooltip id='format-json-icon-tooltip' />
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
									wordWrap: 'on',
									selectOnLineNumbers: true,
									readOnly: false
								}}
								onMount={editorDidMount}
							/>
						</div>
						<div className='flex-column-second'>
							<div className={theme === 'dark' ? 'json-input-header' : 'json-input-header-light'}>
								{errorSecondMessage && secondValue ? (
									<span style={{ color: '#a94442', fontSize: '14px', marginLeft: '10px' }}>{errorSecondMessage}</span>
								) : (
									<span></span>
								)}
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<a data-tooltip-id='clear-code-icon-tooltip-2' data-tooltip-content='Clear' data-tooltip-place='left'>
										<FontAwesomeIcon
											id={'clear-code-icon-2'}
											icon={faTimes}
											color={theme === 'dark' ? '#1bb2ff' : '#888888'}
											style={{ marginRight: '15px', cursor: 'pointer' }}
											onClick={() => {
												setSecondValue('');
											}}
										/>
									</a>
									<Tooltip id='clear-code-icon-tooltip-2' />
									<a data-tooltip-id='validate-json-icon-tooltip' data-tooltip-content='Validate' data-tooltip-place='left'>
										<FontAwesomeIcon
											id={'validate-json-icon-2'}
											icon={faCheckDouble}
											color={!!errorMessage && !!value ? '#a94442' : theme === 'dark' ? '#1bb2ff' : '#888888'}
											style={{ marginRight: '15px', cursor: 'pointer' }}
											onClick={() => isValidSecondJson()}
										/>
									</a>
									<Tooltip id='validate-json-icon-tooltip-2' />
									<div className='custom-file-upload'>
										<label>
											<input
												type='file'
												accept='.json'
												id='file-upload'
												style={{ display: 'none' }}
												onChange={(event) => handleFileUpload(event, setSecondValue)}
											/>
											<a data-tooltip-id='upload-json-icon-tooltip' data-tooltip-content='Import' data-tooltip-place='left'>
												<FontAwesomeIcon
													icon={faFileImport}
													color={theme === 'dark' ? '#1bb2ff' : '#888888'}
													style={{ marginRight: '15px', cursor: 'pointer', fontSize: '14px' }}
												/>
											</a>
											<Tooltip id='upload-json-icon-tooltip-2' />
										</label>
									</div>
									<a data-tooltip-id='export-json-data-tooltip-2' data-tooltip-content='Export' data-tooltip-place='left'>
										<FontAwesomeIcon
											id={'export-json-data-2'}
											icon={faFileExport}
											color={theme === 'dark' ? '#1bb2ff' : '#888888'}
											style={{ marginRight: '15px', cursor: 'pointer', fontSize: '14px' }}
											onClick={() => {
												if (isValidSecondJson()) {
													handleDataExport(secondValue);
												}
											}}
										/>
									</a>
									<Tooltip id='export-json-data-tooltip-2' />
									<a data-tooltip-id='format-json-icon-tooltip-2' data-tooltip-content='Format' data-tooltip-place='left'>
										<FontAwesomeIcon
											id={'format-json-icon-2'}
											icon={faAlignLeft}
											color={theme === 'dark' ? '#1bb2ff' : '#888888'}
											style={{ marginRight: '30px', cursor: 'pointer' }}
											onClick={() => handleSecondFormatClick()}
										/>
									</a>
									<Tooltip id='format-json-icon-tooltip-2' />
								</div>
							</div>
							<Editor
								className='json-input-area'
								defaultLanguage='json'
								theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
								value={secondValue}
								onChange={handleSecondChange}
								options={{
									cursorStyle: 'line',
									formatOnPaste: true,
									formatOnType: true,
									wordWrap: 'on',
									selectOnLineNumbers: true,
									readOnly: false
								}}
								onMount={editorSecondDidMount}
							/>
						</div>
					</div>
				</>
			) : (
				<Fragment>
					<div style={{ display: 'flex', justifyContent: 'end', backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff', paddingLeft: '30px' }}>
						<button
							className={theme === 'dark' ? 'compare-button' : 'compare-button-light'}
							onClick={() => {
								setIsCompareMode(false);
							}}
						>
							{'Back'}
						</button>
					</div>
					<div className='flex-wrapper'>
						<DiffEditor
							className='json-input-area'
							language='json'
							theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
							original={value}
							modified={secondValue}
							options={{
								cursorStyle: 'line',
								formatOnPaste: true,
								formatOnType: true,
								wordWrap: true,
								selectOnLineNumbers: true,
								readOnly: true,
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
							onMount={compreDidMount}
						/>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
});
