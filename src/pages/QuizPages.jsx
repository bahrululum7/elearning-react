import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, getDoc, query, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import Navbar from '../components/Navbar'; // sesuaikan path
import { quiz } from '../quiz'; // data quiz final

function QuizPage() {
  const { semester } = useParams();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);

  const resetState = () => {
    setQuizData(null);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setLocked(false);
    setLoading(true);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      resetState();
      if (user) fetchData(user);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [semester]);

  const fetchData = async (user) => {
    // Cek hasil sebelumnya
    const resultRef = doc(db, 'quizResults', user.uid);
    const resultSnap = await getDoc(resultRef);
    if (resultSnap.exists()) {
      const data = resultSnap.data();
      const semesterKey = `semester_${semester}`;
      if (data.quizzes && data.quizzes[semesterKey] && data.quizzes[semesterKey].submittedAt) {
        setLocked(true);
        setSubmitted(true);
        setScore(data.quizzes[semesterKey].score ?? 0);
        setAnswers(data.quizzes[semesterKey].answers ?? {});
      }
    }

    // Pakai data quiz lokal
    setQuizData(quiz);
    setLoading(false);
  };

  const selectAnswer = (questionIndex, optionIndex) => {
    if (submitted || locked) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const submitQuiz = async () => {
    if (!quizData || submitted || locked) return;
    let correct = 0;
    quizData.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });

    setScore(correct);
    setSubmitted(true);
    setLocked(true);

    const user = auth.currentUser;
    if (!user) return;

    const resultRef = doc(db, 'quizResults', user.uid);
    await setDoc(
      resultRef,
      {
        email: user.email,
        role: 'mahasiswa',
        createdAt: serverTimestamp(),
        quizzes: {
          [`semester_${semester}`]: {
            score: correct,
            total: quizData.questions.length,
            submittedAt: serverTimestamp(),
            answers: answers,
          },
        },
      },
      { merge: true }
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!quizData) return <p>Quiz tidak ditemukan</p>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>{quizData.title}</h1>
        {quizData.questions.map((q, qIndex) => (
          <div key={qIndex} style={{ marginBottom: 20 }}>
            <p>
              <b>
                {qIndex + 1}. {q.question}
              </b>
            </p>

            {q.audio && (
              <audio controls style={{ marginTop: 5, marginBottom: 10 }}>
                <source src={q.audio} type="audio/mpeg" />
                Browser Anda tidak mendukung audio.
              </audio>
            )}

            {q.options.map((opt, optIndex) => {
              const isSelected = answers[qIndex] === optIndex;
              const isCorrect = submitted && optIndex === q.answer;
              const isWrong = submitted && isSelected && optIndex !== q.answer;
              return (
                <div
                  key={optIndex}
                  onClick={() => selectAnswer(qIndex, optIndex)}
                  style={{
                    padding: '8px 12px',
                    marginBottom: 6,
                    cursor: submitted || locked ? 'default' : 'pointer',
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    backgroundColor: isCorrect ? '#bbf7d0' : isWrong ? '#fecaca' : isSelected ? '#dbeafe' : '#fff',
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        ))}

        {!submitted && !locked && (
          <button onClick={submitQuiz} style={{ padding: '10px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Submit
          </button>
        )}

        {submitted && (
          <h2>
            Skor: {score} / {quizData.questions.length}
          </h2>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
