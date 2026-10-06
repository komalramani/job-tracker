import { useState } from "react";
import { checkMatch } from "../services/applicationService";
import type { MatchResult } from "../types/matchResult";
import ReactMarkdown from "react-markdown";

function MatchChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please paste both your resume and the job description.");
      return;
    }

    setIsChecking(true);
    setError("");
    setResult(null);

    try {
      const data = await checkMatch(resumeText, jobDescription);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Could not check the match. Is the match service running?");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="match-checker">
      <h2>Resume Match Checker</h2>
      <p>Paste your resume and a job description to see how well they match.</p>

      <textarea
        placeholder="Paste your resume text here"
        rows={6}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <textarea
        placeholder="Paste the job description here"
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button onClick={handleCheck} disabled={isChecking}>
        {isChecking ? "Checking..." : "Check Match"}
      </button>

      {error && <p className="match-error">{error}</p>}

      {result && (
        <div className="match-result">
          <h3>Match score: {result.match_score_percent}%</h3>

          <h4>Missing keywords</h4>
          {result.missing_keywords.length === 0 ? (
            <p>None. Your resume covers the key terms.</p>
          ) : (
            <ul>
              {result.missing_keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          )}

          <h4>Suggestions</h4>
          <ReactMarkdown>{result.ai_suggestions}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}

export default MatchChecker;