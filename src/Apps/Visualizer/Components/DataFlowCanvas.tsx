import React, { useRef } from 'react';
import { Canvas, CanvasRef } from 'reaflow';

interface DataFlowCanvasProps {
	nodes: any[];
	edges: any[];
}

const DataFlowCanvas: React.FC<DataFlowCanvasProps> = ({ nodes, edges }) => {
	const canvasRef = useRef<CanvasRef>(null);

	return (
		//@ts-ignore
		<Canvas ref={canvasRef} fit={true} nodes={nodes} edges={edges} direction='RIGHT' animated={true} />
	);
};

export default DataFlowCanvas;
