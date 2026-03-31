import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Activity, Users, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [showReportForm, setShowReportForm] = useState(null);
    const [reportDiagnosis, setReportDiagnosis] = useState('');

    useEffect(() => {
        if (user?.referenceId) {
            loadDoctorData();
            loadAlerts();
        }
    }, [user]);

    const loadDoctorData = async () => {
        try {
            const res = await api.get(`/appointments/doctor/${user.referenceId}`);
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to load appointments");
        }
    };

    const loadAlerts = async () => {
        try {
            // In a real app, doctor might get all active emergencies or assigned ones
            // Here we mock by getting some emergencies if accessible, or admin fetches.
            // Assuming this endpoint allows doctor to view emergencies
             const res = await api.get(`/emergency/1`); // mocked id for safety
             setAlerts(res.data.filter(a => a.status === 'ACTIVE'));
        } catch(e) {}
    }

    const handleStatus = async (id, status) => {
        try {
            await api.put(`/appointments/${id}/status`, { status });
            loadDoctorData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const submitReport = async (e, patientId) => {
        e.preventDefault();
        try {
            await api.post('/reports', {
                patient: { id: patientId },
                doctor: { id: user.referenceId },
                diagnosis: reportDiagnosis
            });
            alert('Report uploaded successfully');
            setShowReportForm(null);
            setReportDiagnosis('');
        } catch (err) {
            alert('Error generating report');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="text-emerald-600" /> Doctor Portal
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your appointments and patient records.</p>
                </div>
            </div>

            {alerts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                    <h2 className="text-red-700 font-bold flex items-center gap-2 mb-3">
                        <AlertTriangle size={20} /> Active Emergency Alerts
                    </h2>
                    {alerts.map(a => (
                        <div key={a.id} className="bg-white p-3 rounded-lg shadow-sm border border-red-100 text-sm">
                            Patient ID: {a.patient.id} - Location: {a.location} - Time: {a.triggeredAt}
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Appointment Requests</h2>
                </div>
                
                {appointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No appointments scheduled.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {appointments.map(a => (
                            <div key={a.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-slate-800 text-lg">
                                            {a.patient?.firstName} {a.patient?.lastName}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                            a.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            a.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-200 text-slate-700'
                                        }`}>
                                            {a.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-500 flex gap-4">
                                        <span>Date: {new Date(a.appointmentDate).toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {a.status === 'PENDING' && (
                                        <>
                                            <button 
                                                onClick={() => handleStatus(a.id, 'APPROVED')}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1 shadow-sm"
                                            >
                                                <CheckCircle size={16}/> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleStatus(a.id, 'REJECTED')}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1 shadow-sm"
                                            >
                                                <XCircle size={16}/> Reject
                                            </button>
                                        </>
                                    )}
                                    {a.status === 'APPROVED' && (
                                        <button 
                                            onClick={() => setShowReportForm(showReportForm === a.id ? null : a.id)}
                                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1"
                                        >
                                            <FileText size={16}/> {showReportForm === a.id ? 'Cancel' : 'Write Report'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showReportForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Generate Medical Report</h3>
                    <form onSubmit={(e) => submitReport(e, appointments.find(a => a.id === showReportForm).patient.id)}>
                        <textarea 
                            required
                            value={reportDiagnosis}
                            onChange={(e) => setReportDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis, prescription, and notes here..."
                            className="w-full text-sm p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32 mb-4 bg-slate-50"
                        />
                        <button type="submit" className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 shadow flex items-center gap-2">
                            <CheckCircle size={18}/> Submit Report
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
