import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
export const TrainingSchoolTemplate = ({ businessName, demoMode, }) => {
    return (_jsxs("div", { className: "font-sans min-h-screen bg-white", children: [_jsxs("header", { className: "border-b border-gray-100 py-4 px-6 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg", children: "A" }), _jsx("div", { className: "font-bold text-gray-900", children: businessName || "Apex Academy" })] }), _jsxs("div", { className: "hidden md:flex gap-6 text-sm font-medium text-gray-600", children: [_jsx("a", { href: "#", children: "Programs" }), _jsx("a", { href: "#", children: "Admissions" }), _jsx("a", { href: "#", children: "Portal" })] }), _jsx(Button, { className: "bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-700 h-auto", children: "Apply Now" })] }), _jsxs("section", { className: "bg-slate-900 text-white py-20 px-6 text-center", children: [_jsx("span", { className: "bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block", children: "Enrollment Open" }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-6", children: "Launch your career in Tech." }), _jsx("p", { className: "text-slate-400 max-w-2xl mx-auto mb-8 text-lg", children: "Practical, hands-on training in Data Science, Software Engineering, and Product Design. 100% money-back guarantee." }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsx(Button, { className: "bg-blue-600 px-8 py-3 rounded font-bold hover:bg-blue-500 h-auto", children: "View Courses" }), _jsx(Button, { variant: "outline", className: "border border-slate-600 px-8 py-3 rounded font-bold hover:bg-white/5 bg-transparent text-white h-auto", children: "Download Syllabus" })] })] }), _jsx("section", { className: "py-20 px-6 max-w-6xl mx-auto", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
                        {
                            title: "Frontend Engineering",
                            duration: "6 Months",
                            level: "Beginner",
                            icon: "💻",
                        },
                        {
                            title: "Data Analysis",
                            duration: "4 Months",
                            level: "Intermediate",
                            icon: "📊",
                        },
                        {
                            title: "Product Design (UI/UX)",
                            duration: "3 Months",
                            level: "Beginner",
                            icon: "🎨",
                        },
                    ].map((c, i) => (_jsxs("div", { className: "border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer group", children: [_jsx("div", { className: "w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all", children: c.icon }), _jsx("h3", { className: "font-bold text-xl mb-2", children: c.title }), _jsxs("div", { className: "flex gap-4 text-sm text-gray-500 mb-6", children: [_jsxs("span", { children: ["\u23F1 ", c.duration] }), _jsxs("span", { children: ["\uD83D\uDCC8 ", c.level] })] }), _jsx(Button, { variant: "outline", className: "w-full border border-blue-600 text-blue-600 font-bold py-2 rounded hover:bg-blue-50 h-auto", children: "View Curriculum" })] }, i))) }) }), _jsx("section", { className: "bg-blue-50 py-12 border-y border-blue-100", children: _jsxs("div", { className: "max-w-4xl mx-auto flex justify-between text-center px-6", children: [_jsxs("div", { children: [_jsx("div", { className: "text-3xl font-black text-blue-900 mb-1", children: "500+" }), _jsx("div", { className: "text-xs uppercase font-bold text-blue-400", children: "Graduates" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-black text-blue-900 mb-1", children: "92%" }), _jsx("div", { className: "text-xs uppercase font-bold text-blue-400", children: "Employment Rate" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-black text-blue-900 mb-1", children: "4.9" }), _jsx("div", { className: "text-xs uppercase font-bold text-blue-400", children: "Student Rating" })] })] }) })] }));
};
