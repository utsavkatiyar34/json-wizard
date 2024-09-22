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

// export const processJsonToFlowchart = (jsonData: any) => {
// 	const nodes: any[] = [];
// 	const edges: any[] = [];

// 	const processNode = (data: any, parentId: any = null, key: string = '') => {
// 		const nodeId = parentId || nodes.length; // Generate unique node ID
// 		nodes.push({
// 			id: nodeId,
// 			text: typeof data === 'string' ? `"${key}: ${data}"` : data.constructor.name,
// 			label: typeof data === 'string' ? `"${key}: ${data}"` : data.constructor.name, // Label based on data type
// 			data // Store original data for potential interaction
// 		});

// 		if (typeof data === 'object' && data !== null) {
// 			// Loop through object properties
// 			for (const key in data) {
// 				const childId = nodes.length;
// 				nodes.push({
// 					id: childId,
// 					label: key
// 				});
// 				edges.push({ id: `${nodeId}-${childId}`, from: nodeId, to: childId });
// 				processNode(data[key], childId, key); // Recursively process child data, pass childId as parentId
// 			}
// 		} else if (Array.isArray(data)) {
// 			// Loop through array elements
// 			data.forEach((item, index) => {
// 				const childId = nodes.length;
// 				nodes.push({
// 					id: childId,
// 					label: `[${index}]`
// 				});
// 				edges.push({ id: `${nodeId}-${childId}`, from: nodeId, to: childId });
// 				processNode(item, childId); // Recursively process child data, pass childId as parentId
// 			});
// 		}
// 	};

// 	processNode(jsonData);
// 	return { nodes, edges };
// };

export const processJsonToFlowchart = (jsonData: any) => {
	const nodes: any[] = [];
	const edges: any[] = [];

	const processNode = (data: any, parentId: any = null, key: string | number = '') => {
		const nodeId = parentId || nodes.length; // Generate unique node ID

		nodes.push({
			id: nodeId,
			text:
				typeof data === 'string' || data.constructor.name === 'Number'
					? key
						? `"${key}: ${data}"`
						: `"${data}"`
					: key
					? `${key}: ${data.constructor.name}`
					: data.constructor.name,
			label:
				typeof data === 'string' || data.constructor.name === 'Number'
					? key
						? `"${key}: ${data}"`
						: `"${data}"`
					: key
					? `${key}: ${data.constructor.name}`
					: data.constructor.name,
			data // Store original data for potential interaction
		});

		if (typeof data === 'object' && data !== null) {
			// Loop through object properties
			for (const propKey in data) {
				const childId = nodes.length;
				nodes.push({
					id: childId,
					label: propKey
				});
				edges.push({ id: `${nodeId}-${childId}`, from: nodeId, to: childId });
				processNode(data[propKey], childId, propKey); // Recursively process child data, pass childId as parentId
			}
		} else if (Array.isArray(data)) {
			// Loop through array elements
			data.forEach((item, index) => {
				const childId = nodes.length;
				nodes.push({
					id: childId,
					label: `[${index}]`
				});
				edges.push({ id: `${nodeId}-${childId}`, from: nodeId, to: childId });
				processNode(item, childId, index); // Recursively process child data, pass childId as parentId
			});
		}
	};

	processNode(jsonData);
	return { nodes, edges };
};
