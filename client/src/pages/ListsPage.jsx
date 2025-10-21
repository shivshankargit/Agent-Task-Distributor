import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { toast } from "sonner";
import { UploadCloud, Loader2 } from 'lucide-react'; 

import Card from '../components/ui/card';
import Button from '../components/ui/button';
import Label from '../components/ui/Label';

// Allowed file extensions for frontend validation
const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];

export default function ListsPage() {
    // --- State for file upload ---
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState(''); 

    // --- State for task display ---
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [agentFetchError, setAgentFetchError] = useState(false); 

    // Fetches all agents on component mount
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await apiClient.get('/agents/all');
                setAgents(response.data.agents);
                setAgentFetchError(false); 
            } catch (err) {
                setAgentFetchError(true); 
                toast.error("Failed to fetch agents", {
                    description: err.response?.data?.message || "Could not load agent list.",
                });
            }
        };
        fetchAgents();
    }, []); // Empty dependency array runs this once

    // Fetches tasks when the selectedAgent state changes
    useEffect(() => {
        // Don't fetch if no agent is selected
        if (!selectedAgent) {
            setTasks([]);
            return;
        }

        // Fetch tasks for the newly selected agent
        const fetchTasks = async () => {
            setIsLoadingTasks(true);
            try {
                const response = await apiClient.get(`/lists/agent/${selectedAgent}`);
                setTasks(response.data.tasks);
            } catch (err) {
                toast.error("Failed to fetch tasks", {
                    description: err.response?.data?.message || "Could not load tasks for this agent.",
                });
            } finally {
                setIsLoadingTasks(false);
            }
        };
        fetchTasks();
    }, [selectedAgent]); // Re-run this effect when selectedAgent changes

    // Checks if the file extension is in the allowed list
    const validateFile = (selectedFile) => {
        if (!selectedFile) return false;
        // Get the file extension
        const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
            setFileError(`Invalid file type. Please upload ${ALLOWED_EXTENSIONS.join(', ')}.`);
            return false;
        }
        setFileError(''); // Clear error if valid
        return true;
    };

    // Handles file selection from the <input> element
    const handleFileChange = (e) => {
        const selectedFile = e.target.files && e.target.files[0];
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
        } else {
            setFile(null); // Clear invalid file
            e.target.value = null; // Reset file input
        }
    };

    // Clears the selected file from state and resets the input
    const clearFile = () => {
        setFile(null);
        setFileError('');
        // Reset the file input visually
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = null;
        }
    };

    // Handles the file upload to the server
    const handleUpload = async () => {
        // Prevent upload if no file or if there's a validation error
        if (!file || fileError) { 
            toast.error("Cannot upload", { description: fileError || "No file selected." });
            return;
        }

        setIsUploading(true);
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Post the file to the upload endpoint
            const response = await apiClient.post('/lists/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("Upload Successful", {
                description: response.data.message,
            });
            clearFile(); // Clear the file on success

            // Refresh tasks for the current agent after upload
            if (selectedAgent) {
                const taskResponse = await apiClient.get(`/lists/agent/${selectedAgent}`);
                setTasks(taskResponse.data.tasks);
            }

        } catch (err) {
            // Handle upload errors
            let description = "An error occurred during upload.";
            if (err.response) {
                description = err.response.data.message;
            } else if (err.request) {
                description = "Network error. Could not reach server.";
            }
            toast.error("Upload Failed", { description });
        } finally {
            setIsUploading(false);
        }
    };

    // Prevents default behavior to allow drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    // Resets dragging state
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    // Handles the file drop event
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        // Get the file from the drop event
        const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0];
        // Validate and set the file
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
        } else {
            setFile(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* --- Upload Card --- */}
            <Card
                title="Upload & Distribute Lists"
                description="Upload a CSV/Excel file with FirstName, Phone, and Notes columns"
            >
                <div className="space-y-4">
                    {/* Drag-and-drop file upload area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload').click()} // Trigger hidden input
                        // Dynamic classes for drag state, error state, and hover
                        className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors cursor-pointer
                            ${isDragging ? 'bg-blue-50 border-blue-400' : (fileError ? 'bg-red-50 border-red-400' : 'bg-gray-50 border-gray-300 hover:bg-gray-100')} ` // Highlight error
                        }
                    >
                        <UploadCloud className={`w-12 h-12 ${fileError ? 'text-red-400' : 'text-gray-400'}`} />
                        <p className={`mt-2 font-semibold ${fileError ? 'text-red-600' : 'text-gray-600'}`}>
                            {file ? file.name : (fileError || "Click to upload or drag and drop")}
                        </p>
                        <p className="text-sm text-gray-500">
                            CSV, XLSX, or XLS only
                        </p>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".csv, .xlsx, .xls"
                        />
                    </div>

                    {/* Buttons appear only when a file is selected or uploading */}
                    {(file || isUploading) && (
                        <div className="flex justify-between items-center">
                            {/* Upload Button */}
                            <Button
                                type="button"
                                variant="primary"
                                className="w-auto"
                                disabled={isUploading || !!fileError} // Disable if error
                                onClick={handleUpload}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    "Upload & Distribute"
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* --- Distributed Lists Card --- */}
            <Card
                title="Distributed Lists"
                description="View how lists are distributed among agents"
            >
                {/* Agent Select Dropdown */}
                <div className="mb-6 max-w-sm">
                    <Label htmlFor="agent-select" className="mb-1">
                        Select an agent to view their tasks
                    </Label>
                    <select
                        id="agent-select"
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        disabled={agentFetchError || agents.length === 0} 
                    >
                        <option value="">
                            {agentFetchError ? "Error loading agents" : (agents.length === 0 ? "No agents found" : "Select an agent...")}
                        </option>
                        {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                                {agent.name} ({agent.email})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tasks Table */}
                <div className="flow-root">
                    <div className="-mx-6 -my-6 overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">First Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Notes</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">From Batch</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {isLoadingTasks ? (
                                        <tr>
                                            <td colSpan="4" className="py-10 text-center text-gray-500">
                                                <Loader2 className="w-6 h-6 animate-spin inline-block" />
                                            </td>
                                        </tr>
                                    ) : tasks.length > 0 ? (
                                        tasks.map((task) => (
                                            <tr key={task._id}>
                                                <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{task.firstName}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.phone}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 break-words max-w-xs">{task.notes || '-'}</td> {/* Added word break for long notes */}
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.batch.fileName}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-500">
                                                {!selectedAgent ? "Select an agent to view their tasks." : (agentFetchError ? "Could not load tasks." : "No tasks found for this agent.")}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}