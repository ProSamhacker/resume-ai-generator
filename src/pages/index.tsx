import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import OutputViewer from '../../components/OutputViewer';
import ResumeForm from '../../components/ResumeForm';

export default function HomePage() {
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // ✅ Correct way (NO generic used)
  const handlePrint = useReactToPrint({
    content: () => outputRef.current as HTMLElement, // cast to HTMLElement
    documentTitle: 'AI_Generated_Resume',
  });

  const handleGenerated = (result: string) => {
    const cleanedOutput = result.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
    setOutput(cleanedOutput);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          AI Resume & Cover Letter Generator
        </h1>
        <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
          Create professional resumes and cover letters powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <ResumeForm 
            onGenerated={handleGenerated} 
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </div>

        {output && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Generated Output</h2>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                disabled={isGenerating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Download as PDF
              </button>
            </div>

            <OutputViewer ref={outputRef} content={output} />
          </div>
        )}
      </div>
    </div>
  );
}
