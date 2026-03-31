import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Chatbot from '../components/Chatbot';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Calendar, AlertTriangle, FileText, HeartPulse } from 'lucide-react';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [healthData, setHealthData] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [reports, setReports] = useState([]);
    
    // Booking state
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    
    // Emergency State
    const [emergencyStatus, setEmergencyStatus] = useState('');

    useEffect(() => {
        if (user && user.referenceId) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        try {
            const hData = await api.get(`/health/${user.referenceId}`);
            setHealthData(hData.data);

            const appts = await api.get(`/appointments/patient/${user.referenceId}`);
            setAppointments(appts.data);

            const docs = await api.get('/doctors');
            setDoctors(docs.data);

            const rpts = await api.get(`/reports/patient/${user.referenceId}`);
            setReports(rpts.data);
            
            const alerts = await api.get(`/emergency/${user.referenceId}`);
            const activeAlert = alerts.data.find(a => a.status === 'ACTIVE');
            if(activeAlert) setEmergencyStatus('ACTIVE SOS!');
        } catch (err) {
            console.error(err);
        }
    };

    const bookAppointment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments', {
                patient: { id: user.referenceId },
                doctor: { id: selectedDoctor },
                appointmentDate: appointmentDate + 'T00:00:00'
            });
            alert('Appointment booked successfully!');
            loadDashboardData();
        } catch (err) {
            alert('Error booking appointment');
        }
    };

    const triggerSOS = async () => {
        try {
            await api.post('/emergency', {
                patient: { id: user.referenceId },
                location: 'Current Location (GPS)'
            });
            setEmergencyStatus('ACTIVE SOS!');
            alert('Emergency Alert Sent to all connected doctors and admins!');
        } catch (err) {
            alert('Failed to send SOS');
        }
    };

    const chartData = (healthData.length ? healthData : [
        { recordedAt: '2023-01', heartRate: 72 }, { recordedAt: '2023-02', heartRate: 75 },
        { recordedAt: '2023-03', heartRate: 71 }, { recordedAt: '2023-04', heartRate: 76 }
    ]).reverse();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="text-emerald-600" /> Patient Dashboard
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Welcome back, we're here to help you stay healthy.</p>
                </div>
                <button 
                    onClick={triggerSOS}
                    className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                        emergencyStatus ? 'bg-red-600 animate-pulse' : 'bg-red-500 hover:bg-red-600 hover:shadow-red-200'
                    }`}
                >
                    <AlertTriangle size={20} />
                    {emergencyStatus || 'Trigger SOS'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                        <HeartPulse className="text-emerald-500" /> Heart Rate History
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="recordedAt" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="heartRate" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                        <Calendar className="text-emerald-500" /> Book Appointment
                    </h2>
                    <form onSubmit={bookAppointment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Select Doctor</label>
                            <select 
                                required
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
                            >
                                <option value="">Choose a specialist...</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} - {d.specialization}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                            <input 
                                required
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
                            />
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-100 mt-2">
                            Request Appointment
                        </button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                        <FileText className="text-emerald-500" /> My Appointments
                    </h2>
                    {appointments.length === 0 ? (
                        <p className="text-slate-500 text-sm">No appointments scheduled.</p>
                    ) : (
                        <div className="space-y-3">
                            {appointments.map(a => (
                                <div key={a.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center group hover:border-emerald-200 transition">
                                    <div>
                                        <p className="font-semibold text-slate-800">Dr. {a.doctor?.firstName || 'Unknown'}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{new Date(a.appointmentDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                        a.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        a.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                        a.status === 'CANCELLED' ? 'bg-slate-200 text-slate-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                        <FileText className="text-emerald-500" /> Medical Reports
                    </h2>
                    {reports.length === 0 ? (
                        <p className="text-slate-500 text-sm">No reports available.</p>
                    ) : (
                        <div className="space-y-3">
                            {reports.map(r => (
                                <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                                    <p className="font-semibold text-slate-800">{r.diagnosis}</p>
                                    <p className="text-xs text-slate-500 mt-1 flex justify-between">
                                        <span>By Dr. {r.doctor?.lastName}</span>
                                        <span>{new Date(r.uploadedAt).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Chatbot />
        </div>
    );
};

export default PatientDashboard;
