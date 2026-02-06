import axios from 'axios';

export const callAIService = async (command, config, context = {}) => {
    const { activeModel, tokens } = config;
    const { activePlan = {}, scenario = 'itinerary' } = context;

    if (activeModel === 'mock') {
        return simulateMockAI(command);
    }

    const token = tokens[activeModel];
    if (!token) {
        throw new Error(`请先在设置中配置 ${activeModel.toUpperCase()} 的 API Token`);
    }

    // Construct a professional system prompt for autonomous updates
    const systemPrompt = `你是一个跨时代的 AI 旅游智脑 (AI-U)。
你的使命是用最少的人机交互，通过对话瞬间构建完美的旅行方案。

当前场景: ${scenario.toUpperCase()}
当前计划: ${JSON.stringify(activePlan)}

核心法则:
1. 你的回复必须极其精炼且专业。
2. 当用户指令涉及计划变更（如：目的地、天数、预算、景点）时，必须在回复末尾附加一个 JSON 块。
3. JSON 块必须严格遵循此格式：
   \`\`\`json
   {
     "updates": {
       "itinerary": { "destination": "...", "days": "...", "activities": [...] },
       "hotel": { "name": "...", "budget": "..." },
       "log": { "notes": "..." }
     }
   }
   \`\`\`
4. 仅包含本次对话中发生实质变更的字段。
5. 永远不要解释这个 JSON 块的作用，直接将其置于文本末尾即可。`;

    try {
        if (activeModel === 'openai') {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: command }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        }

        if (activeModel === 'gemini') {
            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${token}`, {
                contents: [{
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\n用户指令: ${command}` }]
                }]
            });
            return response.data.candidates[0].content.parts[0].text;
        }

        // DeepSeek / Doubao Style (OpenAI compatible)
        if (activeModel === 'doubao' || activeModel === 'deepseek') {
            const baseURL = activeModel === 'doubao'
                ? 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
                : 'https://api.deepseek.com/chat/completions';

            const response = await axios.post(baseURL, {
                model: activeModel === 'doubao' ? 'doubao-pro-32k' : 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: command }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        }

        // Fallback for Qwen and others
        const qwenURL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
        if (activeModel.startsWith('qwen')) {
            const response = await axios.post(qwenURL, {
                model: activeModel === 'qwen-max' ? 'qwen-max' : 'qwen-turbo',
                input: {
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: command }
                    ]
                },
                parameters: { result_format: 'message' }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.output.choices[0].message.content;
        }

        return "暂不支持该模型的高级指令集，请尝试 OpenAI 或 Gemini。";

    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error(error.response?.data?.error?.message || "AI 服务调用失败，请检查的网络或 Token 是否正确。");
    }
};

const simulateMockAI = (command) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (command.includes('规划') || command.includes('行程')) {
                resolve("为您生成了京都5日游行程：Day 1 清水寺，Day 2 岚山，Day 3 金阁寺...");
            } else if (command.includes('酒店')) {
                resolve("为您推荐了京都丽思卡尔顿酒店，评分 4.9，位于鸭川边。");
            } else {
                resolve("好的，我已经为您安排好了！");
            }
        }, 1500);
    });
};
