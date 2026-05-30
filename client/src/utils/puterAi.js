export const callPuterAI = async (prompt, modelName = 'google/gemini-2.5-flash') => {
  try{
    const response = await window.puter.ai.chat(prompt, {model: modelName});
    if (response && typeof response === 'object') {
      return response.message?.content || JSON.stringify(response);
    }
    return response;
  }
  catch (error){
    console.error("Puter AI Error:", error)
    throw new Error("Puter AI is currently unavailable");
  }
}

