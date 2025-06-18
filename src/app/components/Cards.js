// WorkflowCards.jsx
import { Upload, Loader, CheckCircle, FileText } from "lucide-react";

const steps = [
  {
    title: "Video Upload",
    description: "Drag & Drop Interface",
    icon: <Upload className="h-6 w-6 text-purple-600" />,
  },
  {
    title: "Processing",
    description: "AI Analysis in Progress",
    icon: <Loader className="h-6 w-6 text-yellow-500 animate-spin" />,
  },
  {
    title: "Results Dashboard",
    description: "AI Analysis Complete",
    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Transcript View",
    description: "Full Text with Timestamps",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
  },
];

const Cards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-2xl p-5 flex flex-col items-start hover:shadow-xl transition-all"
        >
          <div className="mb-3">{step.icon}</div>
          <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
          <p className="text-sm text-gray-500">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
