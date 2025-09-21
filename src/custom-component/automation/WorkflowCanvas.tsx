'use client';

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Node Components
const TriggerNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
    <div className="flex">
      <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
      </div>
      <div className="ml-2">
        <div className="text-lg font-bold">{data.label}</div>
        <div className="text-gray-500">{data.description}</div>
      </div>
    </div>
  </div>
);

const ActionNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
    <div className="flex">
      <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="ml-2">
        <div className="text-lg font-bold">{data.label}</div>
        <div className="text-gray-500">{data.description}</div>
      </div>
    </div>
  </div>
);

const DMNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px]">
    <div className="flex">
      <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
      </div>
      <div className="ml-2">
        <div className="text-lg font-bold">{data.label}</div>
        <div className="text-gray-500">{data.description}</div>
      </div>
    </div>
  </div>
);

// Node types
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  comment_reply: ActionNode,
  dm_message: DMNode,
};

// Custom Edge Component
const CustomEdge = ({ data }: { data: any }) => (
  <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
    {data?.label || '→'}
  </div>
);

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Main Workflow Component
const WorkflowCanvas = ({ workflow }: { workflow: any }) => {
  const { fitView } = useReactFlow();

  // Convert workflow to React Flow format
  const initialNodes: Node[] = useMemo(() => {
    if (!workflow?.nodes) return [];
    
    return workflow.nodes.map((node: any, index: number) => ({
      id: node.id,
      type: node.kind,
      position: { x: 250, y: 100 + (index * 150) },
      data: {
        label: node.label,
        description: getNodeDescription(node),
        config: node.config,
      },
    }));
  }, [workflow]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!workflow?.edges) return [];
    
    return workflow.edges.map((edge: any, index: number) => ({
      id: `e${index}`,
      source: edge.from,
      target: edge.to,
      type: 'custom',
      data: { label: '→' },
    }));
  }, [workflow]);

  // Use React Flow's state management hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Connection handler
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Auto-fit view when workflow changes
  React.useEffect(() => {
    if (workflow && fitView) {
      setTimeout(() => fitView(), 100);
    }
  }, [workflow, fitView]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <div className="bg-white p-2 rounded shadow">
            <h3 className="font-semibold">Workflow Status</h3>
            <p className="text-sm text-gray-600">
              {workflow?.type === 'comment-reply' ? 'Comment Reply' : 'Comment Reply + DM'}
            </p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Helper function to get node descriptions
const getNodeDescription = (node: any): string => {
  switch (node.kind) {
    case 'trigger':
      return `Triggers when user comments on media ${node.config?.mediaId || 'N/A'}`;
    case 'comment_reply':
      return `Replies with: "${node.config?.text || 'Custom message'}"`;
    case 'dm_message':
      return `Sends DM: "${node.config?.text || 'Custom message'}"`;
    default:
      return 'Action node';
  }
};

// Wrapper with ReactFlowProvider
const WorkflowCanvasWrapper = ({ workflow }: { workflow: any }) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas workflow={workflow} />
    </ReactFlowProvider>
  );
};

export default WorkflowCanvasWrapper;