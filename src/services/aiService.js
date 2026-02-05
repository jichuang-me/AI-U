import axios from 'axios';

export const callAIService = async (command, config) => {
    const { activeModel, tokens } = config;

    if (activeModel === 'mock') {
        return simulateMockAI(command);
    }

    const token = tokens[activeModel];
    if (!token) {
        throw new Error(`请先在设置中配置 ${activeModel.toUpperCase()} 的 API Token`);
    }

    try {
        if (activeModel === 'openai') {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: '你是一个旅游规划助手。请根据用户的需求生成简洁的行程建议、酒店推荐或旅行日志。输出请保持友好且结构化。' },
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
                contents: [{ parts: [{ text: command }] }]
            });
            return response.data.candidates[0].content.parts[0].text;
        }

        // 豆包大模型 (Doubao - Volcano Engine ARK)
        if (activeModel === 'doubao') {
            const response = await axios.post('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
                model: 'doubao-pro-32k',
                messages: [
                    { role: 'system', content: '你是一个旅游规划助手。' },
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

        // 通义千问 Qwen-Max
        if (activeModel === 'qwen-max') {
            const response = await axios.post('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
                model: 'qwen-max',
                input: {
                    messages: [
                        { role: 'system', content: '你是一个旅游规划助手。' },
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

        // 通义千问 Qwen 3
        if (activeModel === 'qwen3') {
            const response = await axios.post('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
                model: 'qwen-turbo',
                input: {
                    messages: [{ role: 'user', content: command }]
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

        // 文心一言 ERNIE Bot
        if (activeModel === 'ernie') {
            const response = await axios.post(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-4.0-8k?access_token=${token}`, {
                messages: [{ role: 'user', content: command }]
            });
            return response.data.result;
        }

        // 讯飞星火 (iFlytek Spark)
        if (activeModel === 'spark') {
            const response = await axios.post('https://spark-api.xf-yun.com/v3.5/chat', {
                messages: [{ role: 'user', content: command }]
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.payload.choices.text[0].content;
        }
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
