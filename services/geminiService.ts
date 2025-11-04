import { GoogleGenAI, Type } from '@google/genai';
import { TimeFrame, AnalysisResult } from '../types';

// IMPORTANT: This key is managed by the execution environment. Do not change it.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getEntryTime = (timeFrame: TimeFrame): string => {
    const now = new Date();
    let minutes = now.getMinutes();
    const timeFrameMinutes = parseInt(timeFrame.replace('M', ''));
    
    const remainder = minutes % timeFrameMinutes;
    const minutesToAdd = timeFrameMinutes - remainder;
    
    const entryDate = new Date(now.getTime() + minutesToAdd * 60000);
    entryDate.setSeconds(0, 0);

    // If calculated entry time is in the past or now, calculate for the next interval
    if (entryDate <= now) {
        entryDate.setMinutes(entryDate.getMinutes() + timeFrameMinutes);
    }
    
    return entryDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const generateSignal = async (currencyPair: string, timeFrame: TimeFrame): Promise<AnalysisResult> => {
  try {
    const entryTime = getEntryTime(timeFrame);
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const prompt = `
      Atue como um analista de trading de opções binárias especialista, chamado PRISMA IA. Sua estratégia combina a 'Black Belt 2.0' com price action, análise de zonas de suporte/resistência, figuras gráficas, força de candles e leitura de pavios para identificar continuação ou reversão de tendência.

      Sua tarefa é analisar o par de moedas ${currencyPair} no tempo gráfico de ${timeFrame} e gerar um sinal de trading.

      - Forneça uma breve análise técnica em português para justificar o sinal (máximo 400 caracteres). Mencione padrões de candle, suporte/resistência ou outra técnica relevante.
      - Determine a direção do sinal (CALL para compra, PUT para venda).
      - O sinal é para a próxima vela. O horário atual é ${currentTime}. A entrada deve ser às ${entryTime}.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: { 
                type: Type.STRING,
                description: "A breve análise técnica em português justificando o sinal (máximo 400 caracteres). Exemplo: 'O par EUR/USD está em forte tendência de alta no 5M. Após leve pullback, um martelo se formou em zona de suporte, indicando provável continuação da alta.'"
              },
              pair: { 
                type: Type.STRING,
                description: `O par de moedas analisado. Deve ser '${currencyPair}'.`
              },
              direction: { 
                type: Type.STRING, 
                enum: ["CALL", "PUT"],
                description: "A direção do sinal: 'CALL' para compra ou 'PUT' para venda."
              },
              time_frame: { 
                type: Type.STRING,
                description: `O tempo gráfico analisado. Deve ser '${timeFrame}'.`
              },
              entry_time: { 
                type: Type.STRING,
                description: `O horário de entrada para o sinal. Deve ser '${entryTime}'.`
              },
            },
            required: ["analysis", "pair", "direction", "time_frame", "entry_time"]
          }
        }
    });
    
    const text = response.text.trim();
    if (!text) {
        throw new Error('A IA retornou uma resposta vazia.');
    }
    
    const parsedResult: AnalysisResult = JSON.parse(text);

    // This check is redundant due to the 'required' in schema, but it's good for robustness.
    if (!parsedResult || !parsedResult.direction || !parsedResult.analysis) {
        throw new Error('Resposta da IA está incompleta.');
    }
    
    // Validate that the AI responded for the correct pair/timeframe.
    if (parsedResult.pair !== currencyPair || parsedResult.time_frame !== timeFrame) {
      console.warn("A IA respondeu com dados para um par/tempo diferente do solicitado. Corrigindo.", {
          solicitado: { par: currencyPair, tempo: timeFrame },
          recebido: { par: parsedResult.pair, tempo: parsedResult.time_frame }
      });
      parsedResult.pair = currencyPair;
      parsedResult.time_frame = timeFrame;
    }
    
    return parsedResult;

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    if (error instanceof SyntaxError) {
        console.error("A resposta da IA não era um JSON válido.");
    } else if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
    }
    throw new Error("Não foi possível gerar o sinal da IA. Por favor, tente novamente.");
  }
};