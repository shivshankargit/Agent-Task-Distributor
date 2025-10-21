import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { toast } from "sonner";
import { User, Loader2 } from 'lucide-react';

// Import reusable UI components
import Card from '../components/ui/card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Button from '../components/ui/button';

export default function AgentsPage() {
    // --- State for the "Add New Agent" form ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // --- State for the "All Agents" list ---
    const [agents, setAgents] = useState([]);
    const [isLoadingAgents, setIsLoadingAgents] = useState(true); 

    // Fetches all agents from the API and updates the state
    const fetchAgents = async () => {
        setIsLoadingAgents(true); 
        try {
            const response = await apiClient.get('/agents/all');
            setAgents(response.data.agents);
        } catch (err) {
            toast.error("Failed to fetch agents", {
                description: err.response?.data?.message,
            });
        } finally {
            setIsLoadingAgents(false); 
        }
    };

    // Fetch agents when the component first mounts
    useEffect(() => {
        fetchAgents();
    }, []); // Empty dependency array ensures this runs once

    // Helper function to clear all form fields
    const clearForm = () => {
        setName('');
        setEmail('');
        setMobileNumber('');
        setPassword('');
    };

    // Handles the submission of the "Add New Agent" form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // --- Client-side validation ---
        if (password.length < 8) {
            toast.error("Invalid password", {
                description: "Password must be at least 8 characters long.",
            });
            return;
        }

        // Clean and validate phone number
        const cleanedPhoneNumber = mobileNumber.replace(/\s+/g, '');
        if (!cleanedPhoneNumber.startsWith('+')) {
            toast.error("Invalid mobile number", {
                description: "Country code is required. Please start with + (e.g., +91)",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // Send the new agent data to the API
            await apiClient.post('/agents/add', {
                name: name.trim(),
                email: email.trim(),
                mobileNumber: cleanedPhoneNumber, 
                password
            });
            toast.success("Success!", {
                description: "New agent has been created.",
            });
            clearForm();
            fetchAgents(); // Re-fetch the list to show the new agent
        } catch (err) {
            // Handle different types of errors
            let description = "An error occurred.";
            if (err.response) {
                // Error from the server (e.g., duplicate email)
                description = err.response.data.message;
            } else if (err.request) {
                // Network error (server unreachable)
                description = "Network error. Please check your connection.";
            }

            toast.error("Error creating agent", {
                description: description,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* --- Add New Agent Card --- */}
            <Card
                title="Add New Agent"
                description="Create a new agent with their contact details"
            >
                <form onSubmit={handleSubmit}>
                    {/* 2-Column Grid for inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" type="email" placeholder="agent@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="mobile">Mobile Number (with country code) *</Label>
                            <Input
                                id="mobile"
                                placeholder="+91 98765 43210"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password (min. 8 characters) *</Label>
                            <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>

                    {/* Form Footer */}
                    <div className="flex justify-end mt-6">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-auto"
                            disabled={isSubmitting}
                        >
                            {/* Show spinner when submitting */}
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Agent"}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* --- All Agents Card --- */}
            <Card
                title={`All Agents (${agents.length})`}
                description="View and manage your team of agents"
            >
                {/* Responsive Table */}
                <div className="flow-root">
                    <div className="-mx-6 -my-6 overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {isLoadingAgents ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-10 text-gray-500">
                                                <Loader2 className="w-6 h-6 animate-spin inline-block" />
                                            </td>
                                        </tr>
                                    ) : agents.length > 0 ? (
                                        agents.map((agent) => (
                                            <tr key={agent._id}>
                                                <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                                                            <User className="h-6 w-6 text-gray-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900">{agent.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{agent.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{agent.mobileNumber}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-10 text-gray-500">
                                                No agents created yet.
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