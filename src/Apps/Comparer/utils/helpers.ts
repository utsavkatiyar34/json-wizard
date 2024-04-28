export const handleDataExport = (jsonData: any) => {
	const blob = new Blob([jsonData], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = 'data.json';
	link.click();
	URL.revokeObjectURL(url);
};

export const handleFileUpload = (event: any, setValue: Function) => {
	const uploadedFile = event.target.files[0];
	if (!uploadedFile) return;
	if (uploadedFile.type !== 'application/json') {
		alert('Please upload a valid JSON file (.json)');
		return;
	}
	const reader = new FileReader();

	reader.onload = (event: any) => {
		setValue(event.target.result);
	};
	reader.onerror = () => {
		alert('Error reading the uploaded file:');
	};

	reader.readAsText(uploadedFile);
};