import { useState } from 'react';

type ResumeFormProps = {
  onGenerated: (output: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
};

export default function ResumeForm({ 
  onGenerated, 
  isGenerating,
  setIsGenerating
}: ResumeFormProps) {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          jobTitle,
          skills: skills.split(',').map(s => s.trim()),
        }),
      });

      const data = await response.json();
      onGenerated(data.output || data.error || 'No response received');
    } catch (error: any) {
      onGenerated(error.message || 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-base font-bold text-gray-800 mb-1" htmlFor="name">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          className="w-full p-3 border rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isGenerating}
        />
      </div>

      <div>
        <label className="block text-base font-bold text-gray-800 mb-1" htmlFor="jobTitle">
          Job Title
        </label>
        <input
          id="jobTitle"
          type="text"
          placeholder="Enter job title"
          className="w-full p-3 border rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          disabled={isGenerating}
        />
      </div>

      <div>
        <label className="block text-base font-bold text-gray-800 mb-1" htmlFor="skills">
          Skills (comma separated)
        </label>
        <input
          id="skills"
          type="text"
          placeholder="e.g. Python, SQL, React"
          className="w-full p-3 border rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
          disabled={isGenerating}
        />
        <p className="mt-1 text-sm text-gray-500">Separate skills with commas</p>
      </div>

      <button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
          isGenerating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          'Generate Resume & Cover Letter'
        )}
      </button>
      
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Your data is processed securely and not stored. The AI might take 10-20 seconds to generate content.
        </p>
      </div>
    </form>
  );
}