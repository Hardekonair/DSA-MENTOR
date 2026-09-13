export const sendQuestion = async (question, messages) => {
  const response = await fetch("http://localhost:5000/api/chat/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      messages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.answer;
};

// {
//   "question": "What is its time complexity?",
//   "messages": [
//     {
//       "role": "user",
//       "content": "Explain binary search"
//     },
//     {
//       "role": "assistant",
//       "content": "Binary search works on sorted arrays..."
//     }
//   ]
// }